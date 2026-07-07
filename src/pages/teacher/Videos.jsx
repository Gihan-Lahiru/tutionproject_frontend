import { useState } from "react"
import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Search, Video as VideoIcon } from "lucide-react"
import VideoUpload from "../../components/Teacher/VideoUpload"
import VideoLibrary from "../../components/Teacher/VideoLibrary"

export default function Videos() {
  const location = useLocation()
  const navigate = useNavigate()
  const [classContext] = useState(() => location.state?.classContext || null)
  const [searchQuery, setSearchQuery] = useState("")
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    if (location.state?.classContext || location.state?.quickAction) {
      navigate(location.pathname, { replace: true, state: null })
    }
  }, [location.pathname, location.state, navigate])

  const handleUploadSuccess = () => setRefreshTrigger(prev => prev + 1)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="rounded-2xl p-6 sm:p-8" style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1a1040 60%,#1e293b 100%)', boxShadow: '0 8px 32px rgba(15,23,42,0.2)' }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg,#8b5cf6,#a855f7)', boxShadow: '0 4px 12px rgba(139,92,246,0.4)' }}>
            <VideoIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Video Lessons</h1>
            <p className="text-sm mt-0.5" style={{ color: '#94a3b8' }}>Upload and manage video lectures for your students.</p>
            {classContext && (
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: 'rgba(139,92,246,0.2)', color: '#c4b5fd' }}>📚 {classContext.title}</span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.08)', color: '#94a3b8' }}>📍 {classContext.location || classContext.institute || 'Class Location'}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="rounded-2xl p-4" style={{ background: '#fff', border: '1.5px solid rgba(226,232,240,0.8)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search video lessons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
            style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', color: '#1e293b' }}
            onFocus={e => e.target.style.borderColor = '#8b5cf6'}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1.5px solid rgba(226,232,240,0.8)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          <VideoUpload onUploadSuccess={handleUploadSuccess} classContext={classContext} />
        </div>
        <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1.5px solid rgba(226,232,240,0.8)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          <VideoLibrary refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  )
}
