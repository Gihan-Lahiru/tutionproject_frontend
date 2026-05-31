import { useEffect, useState } from 'react'
import { AlertCircle } from 'lucide-react'
import FeeTable from '../../components/Teacher/FeeTable'
import api from '../../api/axios'

export default function Payments() {
  const [pendingReceipts, setPendingReceipts] = useState([])

  useEffect(() => {
    const fetchPendingReceipts = async () => {
      try {
        const response = await api.get('/payments/receipts/pending')
        const receipts = response.data.payments || []
        setPendingReceipts(receipts)
      } catch (error) {
        console.error('Error fetching pending receipts:', error)
      }
    }

    fetchPendingReceipts()
    
    // Refresh every 10 seconds to show updated count
    const interval = setInterval(fetchPendingReceipts, 10000)
    return () => clearInterval(interval)
  }, [])

  const pendingReceiptsCount = pendingReceipts.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Fee Management</h1>
        <p className="text-gray-600 mt-1">Track and manage student fee payments</p>
      </div>

      {pendingReceiptsCount > 0 && (
        <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-blue-900">
              {pendingReceiptsCount} Receipt{pendingReceiptsCount > 1 ? 's' : ''} Pending Review
            </p>
            <p className="text-sm text-blue-700">
              <span className="font-semibold">
                {pendingReceipts.slice(0, 3).map(r => r.user?.name || r.payer_name || 'Student').join(', ')}
                {pendingReceipts.length > 3 ? ` and ${pendingReceipts.length - 3} others` : ''}
              </span>
              {pendingReceiptsCount > 1 ? ' have' : ' has'} submitted payment receipt{pendingReceiptsCount > 1 ? 's' : ''} awaiting your approval. Scroll down to review.
            </p>
          </div>
        </div>
      )}

      <FeeTable />
    </div>
  )
}
