import { useMemo } from 'react'
import { FiCheckCircle } from 'react-icons/fi'

export default function PaymentCardVerify() {
  const data = useMemo(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const encoded = params.get('data')
      if (!encoded) return null
      return JSON.parse(decodeURIComponent(encoded))
    } catch (error) {
      console.error('Failed to parse payment verification data:', error)
      return null
    }
  }, [])

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <h1 className="text-xl font-bold text-gray-900">Invalid Payment Card</h1>
          <p className="mt-2 text-gray-600">This QR code does not contain valid payment verification details.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-green-200 bg-white p-6 shadow-lg">
        <div className="flex items-center gap-3 text-green-700">
          <FiCheckCircle className="h-7 w-7" />
          <h1 className="text-2xl font-bold">Payment Successful</h1>
        </div>

        <p className="mt-3 text-sm text-gray-600">Payment verified from student card QR.</p>

        <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-2 text-sm">
          <p><span className="text-gray-500">Student:</span> <span className="font-semibold text-gray-900">{data.studentName || '-'}</span></p>
          <p><span className="text-gray-500">Grade:</span> <span className="font-semibold text-gray-900">{data.grade || '-'}</span></p>
          <p><span className="text-gray-500">Month:</span> <span className="font-semibold text-gray-900">{[data.month, data.year].filter(Boolean).join(' ') || '-'}</span></p>
          <p><span className="text-gray-500">Amount:</span> <span className="font-semibold text-gray-900">Rs. {Number(data.amount || 0).toLocaleString()}</span></p>
          <p><span className="text-gray-500">Paid At:</span> <span className="font-semibold text-gray-900">{data.paidAt || '-'}</span></p>
        </div>
      </div>
    </div>
  )
}
