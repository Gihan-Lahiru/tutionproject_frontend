import FeeTable from '../../components/Teacher/FeeTable'

export default function Payments() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Fee Management</h1>
        <p className="text-gray-600 mt-1">Track and manage student fee payments</p>
      </div>

      <FeeTable />
    </div>
  )
}
        .filter((p) => p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0)
      const pending = mockPayments.filter((p) => p.status === 'pending').length

      setStats({
        totalRevenue: total,
        pendingPayments: pending,
        thisMonth: total,
      })
    } catch (error) {
      console.error('Failed to fetch payments:', error)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Payments</h1>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex items-center space-x-4">
            <div className="bg-green-500 text-white p-4 rounded-lg">
              <FiDollarSign size={32} />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold">Rs {stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-4">
            <div className="bg-yellow-500 text-white p-4 rounded-lg">
              <FiClock size={32} />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Pending Payments</p>
              <p className="text-2xl font-bold">{stats.pendingPayments}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-4">
            <div className="bg-blue-500 text-white p-4 rounded-lg">
              <FiCheck size={32} />
            </div>
            <div>
              <p className="text-gray-600 text-sm">This Month</p>
              <p className="text-2xl font-bold">Rs {stats.thisMonth.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Payments Table */}
      <Card>
        <h2 className="text-xl font-bold mb-4">Payment History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Student</th>
                <th className="text-left py-3 px-4">Class</th>
                <th className="text-left py-3 px-4">Amount</th>
                <th className="text-left py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    {new Date(payment.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 font-medium">{payment.student}</td>
                  <td className="py-3 px-4">{payment.class}</td>
                  <td className="py-3 px-4 font-semibold">
                    Rs {payment.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        payment.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
