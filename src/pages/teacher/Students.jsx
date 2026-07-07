import StudentTable from '../../components/Teacher/StudentTable'
import { Users } from 'lucide-react'

export default function Students() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="rounded-2xl p-6 sm:p-8" style={{ background: 'linear-gradient(135deg,#0f172a 0%,#0f2a4a 60%,#1e293b 100%)', boxShadow: '0 8px 32px rgba(15,23,42,0.2)' }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)', boxShadow: '0 4px 12px rgba(59,130,246,0.4)' }}>
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Students</h1>
            <p className="text-sm mt-0.5" style={{ color: '#94a3b8' }}>Manage and view all enrolled students</p>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1.5px solid rgba(226,232,240,0.8)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <StudentTable />
      </div>
    </div>
  )
}
