import { useState } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import PaperUpload from "../../components/Teacher/PaperUpload";
import RecentPapers from "../../components/Teacher/RecentPapers";

export default function Papers() {
  const location = useLocation();
  const navigate = useNavigate();
  const [classContext] = useState(() => location.state?.classContext || null);
  const [quickAction] = useState(() => location.state?.quickAction || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (location.state?.classContext || location.state?.quickAction) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  const mapQuickActionToType = (action) => {
    if (action === 'assignment') return 'Assignment';
    if (action === 'note') return 'Note';
    if (action === 'paper') return 'Paper';
    return '';
  };

  const defaultType = mapQuickActionToType(quickAction);

  const handleUploadSuccess = () => {
    // Trigger refresh of RecentPapers component
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paper Management</h1>
          <p className="text-gray-600 mt-1">Upload and manage question papers, assignments, and study materials.</p>
          {classContext && (
            <p className="text-sm text-primary mt-2 font-medium">
              Selected class: {classContext.title}
            </p>
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
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <PaperUpload
          onUploadSuccess={handleUploadSuccess}
          classContext={classContext}
          initialType={defaultType}
        />
        
        {/* Recently Uploaded */}
        <RecentPapers refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
}
