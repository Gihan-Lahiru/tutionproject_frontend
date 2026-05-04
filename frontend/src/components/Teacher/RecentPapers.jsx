import { Download, FileText, Eye, Edit, Trash2, X, Image } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";

export default function RecentPapers({ refreshTrigger }) {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', topic: '' });
  const [newThumbnail, setNewThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchPapers();
  }, [refreshTrigger]);

  const fetchPapers = async () => {
    try {
      const response = await api.get('/papers');
      setPapers(response.data.papers.slice(0, 4)); // Show only recent 4
    } catch (error) {
      console.error('Error fetching papers:', error);
      toast.error('Failed to load papers');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleEdit = (paper) => {
    setSelectedPaper(paper);
    setEditForm({ title: paper.title, topic: paper.topic || '' });
    setThumbnailPreview(paper.thumbnail_url);
    setEditModal(true);
  };

  const handleDelete = (paper) => {
    setSelectedPaper(paper);
    setDeleteModal(true);
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      setNewThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const confirmEdit = async () => {
    if (!editForm.title.trim()) {
      toast.error('Title is required');
      return;
    }

    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', editForm.title);
      formData.append('topic', editForm.topic);
      
      if (newThumbnail) {
        formData.append('thumbnail', newThumbnail);
      }

      await api.put(`/papers/${selectedPaper.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Paper updated successfully');
      setEditModal(false);
      setNewThumbnail(null);
      setThumbnailPreview(null);
      fetchPapers();
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update paper');
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDelete = async () => {
    setActionLoading(true);
    try {
      await api.delete(`/papers/${selectedPaper.id}`);
      toast.success('Paper deleted successfully');
      setDeleteModal(false);
      fetchPapers();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete paper');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownload = async (paper) => {
    try {
      // Fetch file with authentication using blob response
      const response = await api.get(`/papers/${paper.id}/file`, {
        responseType: 'blob'
      });
      
      // Extract filename from Content-Disposition header or use title
      let filename = (paper.topic || paper.title || 'document').trim();
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+?)"?$/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      // Create blob with proper type and download
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Download started!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recently Uploaded</h3>
        <button className="text-primary hover:text-primary/90 text-sm font-medium">
          View All
        </button>
      </div>
      
      <div className="space-y-3">
        {papers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>No papers uploaded yet</p>
          </div>
        ) : (
          papers.map((paper) => (
            <div
              key={paper.id}
              className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{(paper.topic || paper.title || 'Untitled Document').trim()}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{paper.grade}</span>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {(paper.type && ['Note', 'Paper', 'Assignment'].includes(paper.type)) ? paper.type : 'Document'}
                    </span>
                    <span>•</span>
                    <span>{formatDate(paper.uploaded_at)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    {paper.downloads} downloads
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(paper)}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4 text-primary" />
                  </button>
                  <button
                    onClick={() => handleDelete(paper)}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                  <button
                    onClick={() => handleDownload(paper)}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4 text-primary" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Edit Paper</h3>
              <button
                onClick={() => {
                  setEditModal(false);
                  setNewThumbnail(null);
                  setThumbnailPreview(null);
                }}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={actionLoading}
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter paper title"
                  disabled={actionLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topic
                </label>
                <input
                  type="text"
                  value={editForm.topic}
                  onChange={(e) => setEditForm({ ...editForm, topic: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter topic"
                  disabled={actionLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thumbnail Image (optional)
                </label>
                <div className="space-y-2">
                  {thumbnailPreview && (
                    <div className="relative inline-block">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="w-32 h-24 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        onClick={() => {
                          setNewThumbnail(null);
                          setThumbnailPreview(selectedPaper.thumbnail_url);
                        }}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        disabled={actionLoading}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition-colors cursor-pointer">
                    <Image className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {newThumbnail ? 'Change thumbnail' : 'Upload thumbnail'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="hidden"
                      disabled={actionLoading}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setEditModal(false);
                  setNewThumbnail(null);
                  setThumbnailPreview(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={confirmEdit}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={actionLoading}
              >
                {actionLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Delete Paper</h3>
              <button
                onClick={() => setDeleteModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={actionLoading}
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-2">
                Are you sure you want to delete this paper?
              </p>
              <p className="font-medium text-gray-900 bg-gray-50 p-3 rounded-lg">
                {(selectedPaper.topic || selectedPaper.title || 'Untitled Document').trim()}
              </p>
              <p className="text-sm text-red-600 mt-2">
                This action cannot be undone. The file will be permanently deleted.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={actionLoading}
              >
                {actionLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
