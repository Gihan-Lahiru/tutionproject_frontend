import StudentTable from '../../components/Teacher/StudentTable'
import { Users } from 'lucide-react'

export default function Students() {
  return (
    <div className="space-y-6">
      {/* Page Header - Clean Light Design */}
      <div className="rounded-2xl p-6 sm:p-8 bg-white border border-slate-200/90 shadow-xs relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 shadow-xs">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Student Directory</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage, review, and approve enrolled tuition students</p>
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
