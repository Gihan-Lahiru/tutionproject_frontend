import { useEffect, useMemo, useState, useContext, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/UI/Card'
import Button from '../../components/UI/Button'
import Badge from '../../components/UI/Badge'
import PayNowButton from '../../components/Student/PayNowButton'
import { FiCreditCard, FiDownload, FiCheckCircle, FiXCircle, FiCalendar, FiUpload } from 'react-icons/fi'
import { AuthContext } from '../../contexts/AuthContext'
import { toast } from 'react-toastify'
import api from '../../api/axios'
import QRCode from 'qrcode'
import html2canvas from 'html2canvas'

export default function PaymentHistory() {
  const { user } = useContext(AuthContext)
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
  
  // Get monthly fee based on grade
  const getMonthlyFee = () => {
    const grade = user?.grade?.toLowerCase() || ''
    
    if (grade.includes('a/l')) return 2300
    
    const gradeNum = parseInt(grade.replace(/\D/g, ''))
    if (gradeNum >= 6 && gradeNum <= 9) return 1000
    if (gradeNum >= 10 && gradeNum <= 11) return 1500
    
    return 1500 // Default
  }

  const monthlyFee = getMonthlyFee()

  const { currentMonthName, currentYear, currentMonthIndex } = useMemo(() => {
    const now = new Date()
    const currentMonthNameLocal = now.toLocaleString('en-US', { month: 'long' })
    const currentYearLocal = now.getFullYear()
    const currentMonthIndexLocal = now.getMonth()

    return {
      currentMonthName: currentMonthNameLocal,
      currentYear: currentYearLocal,
      currentMonthIndex: currentMonthIndexLocal,
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
        setPayments(res.data.payments || [])
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

  const isProcessingForCurrentMonth = useMemo(() => {
    return currentMonthPendingPayment && currentMonthPendingPayment.receipt_url
  }, [currentMonthPendingPayment])

  const isPendingWithoutReceiptForCurrentMonth = useMemo(() => {
    return currentMonthPendingPayment && !currentMonthPendingPayment.receipt_url
  }, [currentMonthPendingPayment])

  const currentDueDateISO = useMemo(() => {
    // Due date: 14th of the current month
    const due = new Date(currentYear, currentMonthIndex, 14)
    return due.toISOString().slice(0, 10)
  }, [currentMonthIndex, currentYear])

  const sortedPayments = useMemo(() => {
    const toTime = (p) => {
      const raw = p?.payment_date || p?.date || ''
      if (!raw) return 0
      // SQLite typically stores as "YYYY-MM-DD HH:mm:ss"; make it parseable.
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

        const qrData = await QRCode.toDataURL(verifyUrl, {
          margin: 1,
          width: 520,
          errorCorrectionLevel: 'M',
        })
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
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      })

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

  const handlePaymentSuccess = async (result) => {
    const paymentId = result?.paymentId
    const status = String(result?.status || '').toLowerCase()

    setRefreshKey((prev) => prev + 1)

    if (status === 'completed') {
      toast.success('Payment completed successfully!')
      setTimeout(() => {
        setRefreshKey((prev) => prev + 1)
      }, 1000)
      return
    }

    if (status === 'processing') {
      toast.info('Payment receipt uploaded. Waiting for teacher approval...')
    }
  }

  const handleRequestReactivation = async () => {
    try {
      setSendingReactivation(true)
      const res = await api.post('/payments/request-reactivation', {
        message: reactivationMessage,
      })
      toast.success(res?.data?.message || 'Reactivation request sent')
      setReactivationMessage('')
      setRefreshKey((prev) => prev + 1)
    } catch (error) {
      const data = error?.response?.data || {}
      const baseMessage = data?.message || 'Failed to send reactivation request'
      if (Number(data?.overdueCount || 0) > 0) {
        toast.error(`${baseMessage}. Overdue: Rs. ${Number(data.overdueTotal || 0).toLocaleString()}`)
      } else {
        toast.error(baseMessage)
      }
    } finally {
      setSendingReactivation(false)
    }
  }

  const handleReceiptUpload = async () => {
    if (!receiptFile || !receiptUploadPaymentId) {
      toast.error('Please select a file to upload')
      return
    }

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('receipt', receiptFile)

      const res = await api.post(`/payments/${receiptUploadPaymentId}/receipt`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      toast.success('Receipt uploaded successfully!')
      setReceiptFile(null)
      setReceiptUploadPaymentId(null)
      setRefreshKey((prev) => prev + 1)
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to upload receipt')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Payments</h2>
        <p className="text-gray-600 mt-1">Manage your class fees and payment history</p>
      </div>

      {isInactiveStudent && (
        <Card className="border-2 border-amber-300 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-amber-900">Inactive Account: Clear Overdue & Request Activation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-amber-800">
                Your account is currently inactive. Please pay all overdue payments, then send a message to teacher to activate your account again.
              </p>

              {overduePayments.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-amber-900">
                    Overdue total: Rs. {overdueTotal.toLocaleString()} ({overduePayments.length} item{overduePayments.length > 1 ? 's' : ''})
                  </p>
                  {overduePayments.map((payment) => {
                    const label = [payment.month, payment.year].filter(Boolean).join(' ') || 'Overdue payment'
                    return (
                      <div key={`overdue_${payment.id}`} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-lg border border-amber-200 bg-white">
                        <div>
                          <p className="font-medium text-gray-900">{label}</p>
                          <p className="text-sm text-gray-600">Amount: Rs. {Number(payment.amount || 0).toLocaleString()}</p>
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
                <p className="text-sm font-semibold text-green-700">No overdue payments found. You can request activation now.</p>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Message to teacher (optional)</label>
                <textarea
                  value={reactivationMessage}
                  onChange={(e) => setReactivationMessage(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  rows={3}
                  maxLength={300}
                  placeholder="Sir, I paid all overdue fees. Please activate my account again."
                />
              </div>

              <Button
                onClick={handleRequestReactivation}
                disabled={sendingReactivation || overduePayments.length > 0}
                className="bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-60"
              >
                {sendingReactivation ? 'Sending Request...' : 'Send Activation Request to Teacher'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Status */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiCreditCard className="h-5 w-5 text-blue-600" />
              Current Month Fee
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-4xl font-bold text-gray-900">Rs. {monthlyFee.toLocaleString()}</p>
                <p className="text-sm text-gray-600 mt-1">Monthly Class Fee</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiCalendar className="h-5 w-5 text-purple-600" />
              Payment Due
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-4xl font-bold text-gray-900">
                  {new Date(currentDueDateISO).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </p>
                <p className="text-sm text-gray-600 mt-1">{currentMonthName} {currentYear} Fee Due Date</p>
              </div>
              {isPaidForCurrentMonth ? (
                <Badge variant="success" className="flex items-center gap-1 text-sm py-2 justify-center">
                  <FiCheckCircle className="h-4 w-4" />
                  <span>Paid for {currentMonthName} {currentYear}</span>
                </Badge>
              ) : isPendingWithoutReceiptForCurrentMonth ? (
                <Button
                  onClick={() => setReceiptUploadPaymentId(currentMonthPendingPayment.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                >
                  <FiUpload className="h-4 w-4" />
                  Upload Receipt to Pay
                </Button>
              ) : isProcessingForCurrentMonth ? (
                <Badge variant="warning" className="flex items-center gap-1 text-sm py-2 justify-center">
                  <FiCalendar className="h-4 w-4" />
                  <span>Receipt submitted - Awaiting approval</span>
                </Badge>
              ) : currentMonthPendingPayment && String(currentMonthPendingPayment.approval_status || '').toLowerCase() === 'rejected' ? (
                <div className="space-y-2">
                  <Badge variant="error" className="flex items-center gap-1 text-sm py-2 justify-center w-full">
                    <FiXCircle className="h-4 w-4" />
                    <span>Receipt Rejected - Please Retry</span>
                  </Badge>
                  {currentMonthPendingPayment.approval_notes && (
                    <p className="text-xs text-red-600 bg-red-50 p-2 rounded">
                      Reason: {currentMonthPendingPayment.approval_notes}
                    </p>
                  )}
                  <Button
                    onClick={() => setReceiptUploadPaymentId(currentMonthPendingPayment.id)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2"
                  >
                    <FiUpload className="h-4 w-4" />
                    Upload New Receipt
                  </Button>
                </div>
              ) : (
                <PayNowButton 
                  amount={monthlyFee}
                  month={currentMonthName}
                  year={currentYear}
                  onSuccess={handlePaymentSuccess}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingPayments ? (
            <p className="text-gray-600">Loading payments…</p>
          ) : sortedPayments.length === 0 ? (
            <p className="text-gray-600">No payments found yet.</p>
          ) : (
            <div className="space-y-3">
              {sortedPayments.map((payment) => {
                const status = String(payment.status || '').toLowerCase()
                const isCompleted = status === 'completed'
                const badgeClass = isCompleted ? 'bg-green-100 text-green-600' : status === 'failed' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700'
                const when = payment.payment_date || payment.date
                const label = [payment.month, payment.year].filter(Boolean).join(' ') || 'Payment'
                const hasReceipt = payment.receipt_url
                const approvalStatus = String(payment.approval_status || 'pending').toLowerCase()

                return (
                  <div
                    key={payment.id || `${label}_${when}`}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${badgeClass}`}>
                        {isCompleted ? <FiCheckCircle className="h-5 w-5" /> : <FiXCircle className="h-5 w-5" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{label}</p>
                        <p className="text-sm text-gray-600">
                          Status: {status || 'pending'}{when ? ` • ${formatWhen(when)}` : ''}
                        </p>
                        {hasReceipt && (
                          <p className="text-xs text-blue-600 mt-1">
                            Receipt: {approvalStatus === 'approved' ? '✓ Approved' : approvalStatus === 'rejected' ? '✗ Rejected' : 'Pending Review'}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-gray-900">Rs. {Number(payment.amount || 0).toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2">
                        {isCompleted && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedPayment(payment)}
                            title="Generate payment card"
                          >
                            <FiDownload className="h-4 w-4" />
                          </Button>
                        )}
                        {!isCompleted && !hasReceipt && status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setReceiptUploadPaymentId(payment.id)}
                            title="Upload receipt"
                          >
                            <FiUpload className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {receiptUploadPaymentId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Upload Payment Receipt</h3>
              <button
                onClick={() => {
                  setReceiptUploadPaymentId(null)
                  setReceiptFile(null)
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <FiUpload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <label className="cursor-pointer">
                  <p className="text-sm text-gray-600 mb-1">
                    {receiptFile ? receiptFile.name : 'Click to select receipt file'}
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <p className="text-xs text-gray-500">PDF, JPG, or PNG (Max 5MB)</p>
                </label>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setReceiptUploadPaymentId(null)
                    setReceiptFile(null)
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReceiptUpload}
                  disabled={!receiptFile || uploading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {uploading ? 'Uploading...' : 'Upload Receipt'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedPayment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Payment Card</h3>
              <button
                onClick={() => setSelectedPayment(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>

            <div
              ref={cardRef}
              className="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-blue-50 p-4"
            >
              <div className="mb-3 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2">
                <p className="text-sm font-semibold text-blue-900">Maleesha Udantha Tuition Class</p>
                <p className="text-xs text-blue-800">Contact Number: 071 439 0924 (if you have any issue)</p>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-500">Student Payment Card</p>
                  <p className="font-bold text-gray-900 text-lg">{user?.name || 'Student'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Grade</p>
                  <p className="font-semibold text-gray-900">{user?.grade || '-'}</p>
                </div>
              </div>

              <div className="space-y-1 text-sm text-gray-700 mb-4">
                <p>
                  <span className="text-gray-500">Month:</span> {selectedPayment.month || '-'} {selectedPayment.year || ''}
                </p>
                <p>
                  <span className="text-gray-500">Amount:</span> Rs. {Number(selectedPayment.amount || 0).toLocaleString()}
                </p>
                <p>
                  <span className="text-gray-500">Paid At:</span> {formatWhen(selectedPayment.payment_date || selectedPayment.date)}
                </p>
              </div>

              <div className="mt-3 flex flex-col items-center gap-3">
                <div className="w-56 h-56 border-2 border-gray-300 rounded-xl bg-white p-2 flex items-center justify-center">
                  {cardQrDataUrl ? (
                    <img src={cardQrDataUrl} alt="Payment QR" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-xs text-gray-400">QR</span>
                  )}
                </div>
                <div className="w-full text-xs text-gray-500 leading-5 text-center">
                  <p>Scan this QR to verify payment details quickly.</p>
                  <p className="mt-2 break-all text-gray-600">
                    Transaction ID: {selectedPayment.transaction_id || selectedPayment.payment_id || selectedPayment.gateway_payment_id || '-'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedPayment(null)}>
                Cancel
              </Button>
              <Button onClick={downloadPaymentCard} disabled={isDownloadingCard || !cardQrDataUrl}>
                {isDownloadingCard ? 'Downloading...' : 'Download Card'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
