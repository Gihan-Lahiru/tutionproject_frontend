import { useEffect, useMemo, useState, useContext, useRef } from 'react'
import PayNowButton from '../../components/Student/PayNowButton'
import { FiCreditCard, FiDownload, FiCheckCircle, FiXCircle, FiCalendar, FiUpload, FiAlertCircle } from 'react-icons/fi'
import { AuthContext } from '../../contexts/AuthContext'
import { toast } from 'react-toastify'
import api from '../../api/axios'
import QRCode from 'qrcode'
import html2canvas from 'html2canvas'

export default function PaymentHistory() {
  const { user, fetchCurrentUser } = useContext(AuthContext)
  const [refreshKey, setRefreshKey] = useState(0)
  const [payments, setPayments] = useState([])
  const [loadingPayments, setLoadingPayments] = useState(true)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [cardQrDataUrl, setCardQrDataUrl] = useState('')
  const [isDownloadingCard, setIsDownloadingCard] = useState(false)
  const [reactivationMessage, setReactivationMessage] = useState('')
  const [sendingReactivation, setSendingReactivation] = useState(false)
  const [receiptUploadPaymentId, setReceiptUploadPaymentId] = useState(null)
  const [receiptFile, setReceiptFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const cardRef = useRef(null)

  const isInactiveStudent = String(user?.status || 'active').toLowerCase() === 'inactive'
  
  const getMonthlyFee = () => {
    const grade = user?.grade?.toLowerCase() || ''
    if (grade.includes('a/l')) return 2300
    const gradeNum = parseInt(grade.replace(/\D/g, ''))
    if (gradeNum >= 6 && gradeNum <= 9) return 1000
    if (gradeNum >= 10 && gradeNum <= 11) return 1500
    return 1500
  }

  const monthlyFee = getMonthlyFee()

  const { currentMonthName, currentYear, currentMonthIndex } = useMemo(() => {
    const now = new Date()
    return {
      currentMonthName: now.toLocaleString('en-US', { month: 'long' }),
      currentYear: now.getFullYear(),
      currentMonthIndex: now.getMonth(),
    }
  }, [])

  const getMonthIndexFromValue = (value) => {
    if (value == null) return null
    const raw = String(value).trim().toLowerCase()
    if (!raw) return null
    if (/^\d+$/.test(raw)) {
      const numeric = Number(raw)
      if (numeric >= 1 && numeric <= 12) return numeric - 1
      if (numeric >= 0 && numeric <= 11) return numeric
      return null
    }
    const monthNames = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december',
    ]
    const matchedIndex = monthNames.findIndex((m) => m === raw || m.slice(0, 3) === raw.slice(0, 3))
    return matchedIndex >= 0 ? matchedIndex : null
  }

  const getDateFromRaw = (raw) => {
    if (!raw) return null
    const normalized = String(raw).includes(' ') ? String(raw).replace(' ', 'T') : String(raw)
    const d = new Date(normalized)
    return Number.isNaN(d.getTime()) ? null : d
  }

  const isCurrentMonthPayment = (payment) => {
    const parsedDate = getDateFromRaw(payment.payment_date || payment.date)
    const monthIndex = getMonthIndexFromValue(payment.month)
    const yearValue = payment.year != null ? Number(payment.year) : null
    const effectiveMonthIndex = monthIndex != null ? monthIndex : parsedDate?.getMonth()
    const effectiveYear = Number.isFinite(yearValue) ? yearValue : parsedDate?.getFullYear()
    return effectiveMonthIndex === currentMonthIndex && Number(effectiveYear) === Number(currentYear)
  }

  useEffect(() => {
    const fetchPayments = async () => {
      if (!user) return
      try {
        setLoadingPayments(true)
        const res = await api.get('/payments/my-payments')
        setPayments(Array.isArray(res.data) ? res.data : (res.data.payments || []))
      } catch (e) {
        console.error('Failed to fetch payments:', e)
        setPayments([])
      } finally {
        setLoadingPayments(false)
      }
    }
    fetchPayments()
  }, [user, refreshKey])

  const isPaidForCurrentMonth = useMemo(() => {
    return (payments || []).some((p) => {
      const status = String(p.status || '').toLowerCase()
      return status === 'completed' && isCurrentMonthPayment(p)
    })
  }, [payments, currentMonthIndex, currentYear])

  const currentMonthPendingPayment = useMemo(() => {
    return (payments || []).find((p) => {
      const status = String(p.status || '').toLowerCase()
      return status === 'pending' && isCurrentMonthPayment(p)
    }) || null
  }, [payments, currentMonthIndex, currentYear])

  const currentDueDateISO = useMemo(() => {
    const due = new Date(currentYear, currentMonthIndex, 14)
    return due.toISOString().slice(0, 10)
  }, [currentMonthIndex, currentYear])

  const sortedPayments = useMemo(() => {
    const toTime = (p) => {
      const raw = p?.payment_date || p?.date || ''
      if (!raw) return 0
      const normalized = String(raw).includes(' ') ? String(raw).replace(' ', 'T') : String(raw)
      const t = Date.parse(normalized)
      return Number.isFinite(t) ? t : 0
    }
    return [...(payments || [])].sort((a, b) => toTime(b) - toTime(a))
  }, [payments])

  const overduePayments = useMemo(() => {
    return (sortedPayments || []).filter((payment) => {
      const status = String(payment.status || '').toLowerCase()
      return status !== 'completed'
    })
  }, [sortedPayments])

  const overdueTotal = useMemo(() => {
    return overduePayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0)
  }, [overduePayments])

  const formatWhen = (raw) => {
    if (!raw) return ''
    const rawText = String(raw).trim()
    const normalized = rawText.includes(' ') ? rawText.replace(' ', 'T') : rawText
    const hasTimezone = /([zZ]|[+-]\d{2}:?\d{2})$/.test(normalized)
    const parseTarget = hasTimezone ? normalized : `${normalized}Z`
    const d = new Date(parseTarget)
    if (Number.isNaN(d.getTime())) return String(raw)
    return d.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Colombo',
    })
  }

  useEffect(() => {
    const generateCardQr = async () => {
      if (!selectedPayment) {
        setCardQrDataUrl('')
        return
      }
      const payload = {
        status: 'success',
        studentName: user?.name || '',
        grade: user?.grade || '',
        month: selectedPayment.month || '',
        year: selectedPayment.year || '',
        amount: Number(selectedPayment.amount || 0),
        paidAt: formatWhen(selectedPayment.payment_date || selectedPayment.date || ''),
      }
      try {
        const encodedPayload = encodeURIComponent(JSON.stringify(payload))
        const verifyUrl = `${window.location.origin}/payment-card/verify?data=${encodedPayload}`
        const qrData = await QRCode.toDataURL(verifyUrl, { margin: 1, width: 520, errorCorrectionLevel: 'M' })
        setCardQrDataUrl(qrData)
      } catch (err) {
        console.error('Failed to generate payment QR:', err)
        setCardQrDataUrl('')
      }
    }
    generateCardQr()
  }, [selectedPayment, user])

  const downloadPaymentCard = async () => {
    if (!cardRef.current || !selectedPayment) return
    try {
      setIsDownloadingCard(true)
      const canvas = await html2canvas(cardRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' })
      const url = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      const cardMonth = String(selectedPayment.month || 'payment').replace(/\s+/g, '-')
      const cardYear = String(selectedPayment.year || '')
      const studentName = String(user?.name || 'student').trim().replace(/\s+/g, '-')
      link.href = url
      link.download = `payment-card-${studentName}-${cardMonth}${cardYear ? `-${cardYear}` : ''}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('Payment card downloaded')
    } catch (err) {
      console.error('Failed to download payment card:', err)
      toast.error('Failed to download payment card')
    } finally {
      setIsDownloadingCard(false)
    }
  }

  const handlePaymentSuccess = () => {
    toast.success('Payment recorded successfully')
    setRefreshKey(prev => prev + 1)
  }

  const handleRequestReactivation = async () => {
    try {
      setSendingReactivation(true)
      await api.post('/users/request-reactivation', { message: reactivationMessage })
      toast.success('Reactivation request sent')
      setReactivationMessage('')
      if (fetchCurrentUser) fetchCurrentUser()
    } catch {
      toast.error('Failed to send reactivation request')
    } finally {
      setSendingReactivation(false)
    }
  }

  const handleReceiptUpload = async () => {
    if (!receiptFile || !receiptUploadPaymentId) return
    try {
      setUploading(true)
      const data = new FormData()
      data.append('receipt', receiptFile)
      await api.post(`/payments/${receiptUploadPaymentId}/upload-receipt`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Receipt uploaded successfully')
      setReceiptUploadPaymentId(null)
      setReceiptFile(null)
      setRefreshKey(prev => prev + 1)
    } catch {
      toast.error('Failed to upload receipt')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="rounded-2xl p-6 sm:p-8" style={{ background: 'linear-gradient(135deg,#0f172a 0%,#0f2240 60%,#1e293b 100%)', boxShadow: '0 8px 32px rgba(15,23,42,0.2)' }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)', boxShadow: '0 4px 12px rgba(59,130,246,0.4)' }}>
            <FiCreditCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Payments & Billing</h1>
            <p className="text-sm mt-0.5" style={{ color: '#94a3b8' }}>Pay class fees online, submit bank receipts, and download virtual student cards</p>
          </div>
        </div>
      </div>

      {/* Account Suspended Alert (Reactivation banner) */}
      {isInactiveStudent && (
        <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
              <FiAlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Account Inactive</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Please pay overdue fees to request activation.</p>
            </div>
          </div>

          {overduePayments.length > 0 ? (
            <div className="space-y-3">
              {overduePayments.map((payment) => {
                const label = [payment.month, payment.year].filter(Boolean).join(' ') || 'Overdue Fee'
                return (
                  <div key={`overdue_${payment.id}`} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{label}</p>
                      <p className="text-xs text-slate-400 font-semibold mt-0.5">Amount: Rs {Number(payment.amount || 0).toLocaleString()}</p>
                    </div>
                    <PayNowButton
                      amount={Number(payment.amount || 0)}
                      month={payment.month}
                      year={payment.year}
                      onSuccess={handlePaymentSuccess}
                    />
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100 inline-block">No unpaid months. You can request activation now.</p>
          )}

          <div className="space-y-1 pt-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Message to teacher (optional)</label>
            <textarea
              value={reactivationMessage}
              onChange={(e) => setReactivationMessage(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:bg-white focus:border-blue-400 outline-none"
              rows={2}
              maxLength={300}
              placeholder="Sir, I completed my dues. Please verify and reactivate."
            />
          </div>

          <button
            onClick={handleRequestReactivation}
            disabled={sendingReactivation || overduePayments.length > 0}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)' }}
          >
            {sendingReactivation ? 'Sending Request...' : 'Send Activation Request'}
          </button>
        </div>
      )}

      {/* Current Month & Due Card Status */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between h-36">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
            <FiCreditCard className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xxs font-bold text-slate-400 uppercase tracking-wider">Monthly Class Fee</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">Rs. {monthlyFee.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between h-36">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
            <FiCalendar className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-xxs font-bold text-slate-400 uppercase tracking-wider">{currentMonthName} {currentYear} Billing Status</p>
            {user?.paymentStatus === 'pending_verification' ? (
              <p className="text-xl font-bold text-amber-500 mt-1">Verifying Receipt</p>
            ) : user?.paymentStatus === 'rejected' ? (
              <div className="flex items-center justify-between gap-3 mt-1 flex-wrap">
                <span className="text-xl font-bold text-rose-500">Rejected Receipt</span>
                <PayNowButton
                  amount={monthlyFee}
                  month={currentMonthName}
                  year={currentYear}
                  onSuccess={handlePaymentSuccess}
                />
              </div>
            ) : isPaidForCurrentMonth ? (
              <span className="text-emerald-600 text-sm font-bold bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100 inline-block mt-2">Paid for {currentMonthName}</span>
            ) : (
              <div className="flex items-center justify-between gap-3 mt-1 flex-wrap">
                <span className="text-slate-400 text-xs font-semibold">Due on {new Date(currentDueDateISO).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                <PayNowButton
                  amount={monthlyFee}
                  month={currentMonthName}
                  year={currentYear}
                  onSuccess={handlePaymentSuccess}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment History Lists */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold text-slate-800 text-sm">Payment Card Receipts History</h3>
        </div>

        <div className="p-6">
          {loadingPayments ? (
            <div className="text-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-xs text-slate-500 mt-2 font-medium">Loading payments list...</p>
            </div>
          ) : sortedPayments.length === 0 ? (
            <p className="text-center py-6 text-sm text-slate-400 font-medium">No payments or receipts submitted yet.</p>
          ) : (
            <div className="space-y-3">
              {sortedPayments.map((payment) => {
                const status = String(payment.status || '').toLowerCase()
                const isCompleted = status === 'completed'
                const badgeClass = isCompleted ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/15' : status === 'failed' ? 'bg-rose-500/10 text-rose-600 border-rose-500/15' : 'bg-amber-500/10 text-amber-600 border-amber-500/15'
                const when = payment.payment_date || payment.date
                const label = [payment.month, payment.year].filter(Boolean).join(' ') || 'Class Fee'
                const hasReceipt = payment.receipt_url
                const approvalStatus = String(payment.approval_status || 'pending').toLowerCase()

                return (
                  <div
                    key={payment.id || `${label}_${when}`}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border border-slate-150 rounded-2xl hover:bg-slate-50/40 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${badgeClass}`}>
                        {isCompleted ? <FiCheckCircle className="h-5.5 w-5.5" /> : <FiXCircle className="h-5.5 w-5.5" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-800 text-sm truncate">{label}</p>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">
                          Status: <span className="capitalize">{status || 'pending'}</span> {when ? ` • ${formatWhen(when)}` : ''}
                        </p>
                        {hasReceipt && (
                          <span className="inline-block mt-1.5 text-xxs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                            Receipt: {approvalStatus === 'approved' ? 'Approved' : approvalStatus === 'rejected' ? 'Rejected' : 'Reviewing'}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                      <div className="text-left sm:text-right">
                        <p className="font-extrabold text-slate-800">Rs. {Number(payment.amount || 0).toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2">
                        {isCompleted && (
                          <button
                            onClick={() => setSelectedPayment(payment)}
                            className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200 transition-colors"
                            title="Generate payment card"
                          >
                            <FiDownload className="h-4 w-4" />
                          </button>
                        )}
                        {!isCompleted && !hasReceipt && status === 'pending' && (
                          <button
                            onClick={() => setReceiptUploadPaymentId(payment.id)}
                            className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 transition-colors"
                            title="Upload receipt"
                          >
                            <FiUpload className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Upload receipt modal overlay */}
      {receiptUploadPaymentId && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Upload Payment Receipt</h3>
              <button
                onClick={() => { setReceiptUploadPaymentId(null); setReceiptFile(null) }}
                className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
              >
                ×
              </button>
            </div>

            <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50 rounded-2xl p-6 text-center transition-colors">
              <FiUpload className="h-10 w-10 text-slate-400 mx-auto mb-2" />
              <label className="cursor-pointer block">
                <p className="text-sm font-bold text-slate-700 mb-1">
                  {receiptFile ? receiptFile.name : 'Select receipt file'}
                </p>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <p className="text-xs text-slate-400">PDF, JPG, or PNG (Max 5MB)</p>
              </label>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => { setReceiptUploadPaymentId(null); setReceiptFile(null) }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleReceiptUpload}
                disabled={!receiptFile || uploading}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)' }}
              >
                {uploading ? 'Uploading...' : 'Upload Receipt'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR verification card modal overlay */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <FiBookOpen className="text-blue-600" />
                Virtual Student Card
              </h3>
              <button
                onClick={() => setSelectedPayment(null)}
                className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100"
              >
                ×
              </button>
            </div>

            <div
              ref={cardRef}
              className="rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-blue-50/50 p-5 shadow-sm space-y-4"
            >
              <div className="rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-2.5">
                <p className="text-sm font-bold text-blue-900">Maleesha Udantha Tuition Class</p>
                <p className="text-xxs text-blue-800 font-semibold">Contact: 071 439 0924 (Issues & support)</p>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xxs font-bold text-slate-400 uppercase tracking-wider">Student Name</p>
                  <p className="font-extrabold text-slate-800 text-base leading-tight mt-0.5">{user?.name || 'Student'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xxs font-bold text-slate-400 uppercase tracking-wider">Grade</p>
                  <p className="font-extrabold text-slate-800 mt-0.5">{user?.grade || '-'}</p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 font-medium">
                <p><span className="text-slate-400">Class Month:</span> {selectedPayment.month || '-'} {selectedPayment.year || ''}</p>
                <p><span className="text-slate-400">Amount Paid:</span> Rs. {Number(selectedPayment.amount || 0).toLocaleString()}</p>
                <p><span className="text-slate-400">Verified On:</span> {formatWhen(selectedPayment.payment_date || selectedPayment.date)}</p>
              </div>

              <div className="flex flex-col items-center gap-3 pt-2">
                <div className="w-48 h-48 border border-slate-200 rounded-xl bg-white p-2 flex items-center justify-center shadow-inner">
                  {cardQrDataUrl ? (
                    <img src={cardQrDataUrl} alt="Payment QR" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-xs text-gray-400">QR Loading</span>
                  )}
                </div>
                <div className="text-center w-full">
                  <p className="text-xxs text-slate-400 leading-normal font-semibold">Verify receipt details by scanning this secure barcode.</p>
                  <p className="text-xxs text-slate-400 font-bold tracking-wider mt-1 break-all bg-slate-100 py-1 rounded">
                    ID: {selectedPayment.transaction_id || selectedPayment.payment_id || selectedPayment.gateway_payment_id || '-'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setSelectedPayment(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={downloadPaymentCard}
                disabled={isDownloadingCard || !cardQrDataUrl}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)' }}
              >
                {isDownloadingCard ? 'Saving Card...' : 'Save Payment Card'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
