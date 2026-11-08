import { useEffect, useState } from 'react'
import { DollarSign, AlertCircle, Clock } from 'lucide-react'
import FeeTable from '../../components/Teacher/FeeTable'
import api from '../../api/axios'

export default function Payments() {
  const [pendingReceipts, setPendingReceipts] = useState([])

  useEffect(() => {
    const fetchPendingReceipts = async () => {
      try {
        const response = await api.get('/payments/receipts/pending')
        setPendingReceipts(response.data.payments || [])
      } catch (error) {
        console.error('Error fetching pending receipts:', error)
      }
    }
    fetchPendingReceipts()
    const interval = setInterval(fetchPendingReceipts, 10000)
    return () => clearInterval(interval)
  }, [])

  const pendingCount = pendingReceipts.length

  return (
    <div className="space-y-6">
      {/* Page Header - Clean Light Design */}
      <div className="rounded-2xl p-6 sm:p-8 bg-white border border-slate-200/90 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100 shadow-xs">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Fee Management</h1>
              <p className="text-sm text-slate-500 mt-0.5">Track monthly tuition payments, review bank receipts, and verify slips.</p>
            </div>
          </div>
          {pendingCount > 0 && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 self-start sm:self-auto">
              <Clock className="w-4 h-4 text-rose-600" />
              <span className="text-sm font-bold">{pendingCount} Pending Receipts</span>
            </div>
          )}
        </div>
      </div>

      {/* Pending Alert Banner */}
      {pendingCount > 0 && (
        <div
          className="rounded-2xl p-4 sm:p-5 flex items-start gap-4"
          style={{
            background: 'linear-gradient(135deg,rgba(239,68,68,0.08),rgba(249,115,22,0.06))',
            border: '1.5px solid rgba(239,68,68,0.25)',
            boxShadow: '0 2px 12px rgba(239,68,68,0.08)',
          }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(239,68,68,0.12)' }}>
            <AlertCircle className="w-5 h-5" style={{ color: '#ef4444' }} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm" style={{ color: '#dc2626' }}>
              {pendingCount} Receipt{pendingCount > 1 ? 's' : ''} Awaiting Approval
            </p>
            <p className="text-sm mt-0.5" style={{ color: '#991b1b' }}>
              <span className="font-semibold">
                {pendingReceipts.slice(0, 3).map(r => r.user?.name || r.payer_name || 'Student').join(', ')}
                {pendingReceipts.length > 3 ? ` and ${pendingReceipts.length - 3} others` : ''}
              </span>
              {' '}{pendingCount > 1 ? 'have' : 'has'} submitted payment receipt{pendingCount > 1 ? 's' : ''} — scroll down to review.
            </p>
          </div>
        </div>
      )}

      {/* Fee Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1.5px solid rgba(226,232,240,0.8)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <FeeTable />
      </div>
    </div>
  )
}
