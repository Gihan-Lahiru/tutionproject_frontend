import { useState, useRef } from 'react'
import { toast } from 'react-toastify'
import api from '../../api/axios'

export default function PayNowButton({ amount, month, year, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)
  const currentPaymentIdRef = useRef(null)

  const createManualPayment = async () => {
    const payload = { amount, month, year, gateway: 'manual' }
    const res = await api.post('/payments/init', payload)
    return res.data?.payment_id
  }

  const uploadReceipt = async (paymentId, file) => {
    const form = new FormData()
    form.append('receipt', file)

    const res = await api.post(`/payments/${encodeURIComponent(paymentId)}/receipt`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  }

  const handleClick = async () => {
    try {
      setLoading(true)

      // Create manual payment record
      const paymentId = await createManualPayment()
      if (!paymentId) throw new Error('Failed to create payment')
      currentPaymentIdRef.current = paymentId

      // Trigger file selector
      if (fileInputRef.current) {
        fileInputRef.current.value = null
        fileInputRef.current.click()
      }
      setLoading(false)
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || err.message || 'Failed to start payment')
      setLoading(false)
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // basic client-side validation
    const allowed = ['application/pdf', 'image/png', 'image/jpeg']
    if (!allowed.includes(file.type)) {
      toast.error('Only PDF, PNG or JPG files are allowed')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large. Max 10MB')
      return
    }

    try {
      setLoading(true)
      const paymentId = currentPaymentIdRef.current
      if (!paymentId) throw new Error('No payment record found')

      const data = await uploadReceipt(paymentId, file)
      toast.success(data?.message || 'Receipt uploaded. Awaiting approval.')
      if (onSuccess) onSuccess({ paymentId, status: 'processing' })
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || err.message || 'Failed to upload receipt')
    } finally {
      setLoading(false)
      currentPaymentIdRef.current = null
    }
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,image/png,image/jpeg"
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        onClick={handleClick}
        disabled={loading}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </span>
        ) : (
          'Upload Receipt'
        )}
      </button>
    </>
  )
}
