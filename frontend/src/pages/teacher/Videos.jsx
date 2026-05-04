import { useState } from "react"
import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Search } from "lucide-react"
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

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Video Lessons</h1>
          <p className="text-gray-600 mt-1">Upload and manage video lectures for your students.</p>
          {classContext && (
            <p className="text-sm text-primary mt-2 font-medium">Selected class: {classContext.title}</p>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl p-4 shadow-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <VideoUpload onUploadSuccess={handleUploadSuccess} classContext={classContext} />
        
        {/* Video Library */}
        <VideoLibrary refreshTrigger={refreshTrigger} />
      </div>
    </div>
  )
}
