import { useState, useEffect } from "react";
import { Upload, File, X, Image } from "lucide-react";
import { toast } from "react-toastify";
import api from "../../api/axios";

const normalizeGradeLabel = (gradeValue) => {
  const raw = String(gradeValue || '').trim();
  if (!raw) return '';
  const digits = raw.match(/\d+/)?.[0];
  if (!digits) return raw;
  return `Grade ${digits}`;
};

export default function PaperUpload({ onUploadSuccess, classContext = null, initialType = '' }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState(() => normalizeGradeLabel(classContext?.grade));
  const [selectedType, setSelectedType] = useState(() => initialType || "");
  const [selectedClassId] = useState(() => classContext?.id || '');
  const [topic, setTopic] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(true);

  useEffect(() => {
    const guidelinesHidden = localStorage.getItem('hideUploadGuidelines');
    if (guidelinesHidden === 'true') {
      setShowGuidelines(false);
    }
  }, []);

  useEffect(() => {
    if (classContext?.grade) {
      setSelectedGrade(normalizeGradeLabel(classContext.grade));
    }
  }, [classContext]);

  useEffect(() => {
    if (initialType) {
      setSelectedType(initialType);
    }
  }, [initialType]);

  const hideGuidelines = () => {
    localStorage.setItem('hideUploadGuidelines', 'true');
    setShowGuidelines(false);
  };

  const grades = [
    "Grade 6", "Grade 7", "Grade 8", "Grade 9", 
    "Grade 10", "Grade 11", "Grade 12", "Grade 13"
  ];

  const types = ["Note", "Paper", "Assignment"];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    setSelectedFiles(prev => [...prev, ...fileArray]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
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
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview);
      setThumbnailPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedGrade) {
      toast.error("Please select a grade");
      return;
    }
    if (!selectedType) {
      toast.error("Please select a type (Note/Paper/Assignment)");
      return;
    }
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one file");
      return;
    }

    // Check file sizes (10MB limit per file)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    for (const file of selectedFiles) {
      if (file.size > maxSize) {
        toast.error(`File "${file.name}" is too large. Maximum size is 10MB. File size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
        return;
      }
    }

    setUploading(true);

    try {
      // Upload each file
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', topic.trim());
        formData.append('grade', selectedGrade);
        formData.append('type', selectedType);
        formData.append('topic', topic);
        if (selectedClassId) {
          formData.append('class_id', String(selectedClassId));
        }
        
        if (thumbnail) {
          formData.append('thumbnail', thumbnail);
        }

        await api.post('/papers/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      toast.success(`Successfully uploaded ${selectedFiles.length} file(s)`);
      
      // Reset form
      setSelectedFiles([]);
      setSelectedGrade(classContext?.grade ? normalizeGradeLabel(classContext.grade) : "");
      setSelectedType(initialType || "");
      setTopic("");
      removeThumbnail();
      
      // Notify parent component to refresh the list
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Papers / Notes / Assignments</h3>
      <p className="text-sm text-gray-600 mb-4">Upload question papers, assignments, or notes</p>
      {classContext && (
        <div className="mb-4 rounded-lg bg-blue-50 border border-blue-200 px-3 py-2 text-sm text-blue-800">
          Upload target class: {classContext.title}
        </div>
      )}

      {/* Grade Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Grade <span className="text-red-500">*</span>
        </label>
        <select
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
          disabled={!!classContext}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">Choose a grade</option>
          {grades.map((grade) => (
            <option key={grade} value={grade}>
              {grade}
            </option>
          ))}
        </select>
      </div>

      {/* Type Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Type <span className="text-red-500">*</span>
        </label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">Choose a type</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Topic Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Topic <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., Algebra - Linear Equations"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Thumbnail Upload */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Thumbnail Image (Optional)
        </label>
        {thumbnailPreview ? (
          <div className="relative inline-block">
            <img 
              src={thumbnailPreview} 
              alt="Thumbnail preview" 
              className="w-40 h-30 object-cover rounded-lg border-2 border-gray-300"
            />
            <button
              onClick={removeThumbnail}
              className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors w-fit">
            <Image className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-700">Choose Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="hidden"
            />
          </label>
        )}
        <p className="text-xs text-gray-500 mt-1">Recommended: 400x300px, Max 5MB</p>
      </div>

      {/* Drag and Drop Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive ? "border-primary bg-gray-50" : "border-gray-300 bg-gray-50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          multiple
          accept=".pdf,.doc,.docx,.ppt,.pptx"
          onChange={handleChange}
          className="hidden"
        />
        
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-700 font-medium mb-2">Drag and drop your files here</p>
        <p className="text-gray-500 text-sm mb-4">or</p>
        <label
          htmlFor="file-upload"
          className="inline-block bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg cursor-pointer transition-colors"
        >
          Browse Files
        </label>
        <p className="text-xs text-gray-500 mt-3">
          Accepted formats: .pdf, .doc, .docx, .ppt, .pptx
        </p>
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Selected Files:</h4>
          {selectedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <File className="w-4 h-4 text-primary" />
                <span className="text-sm text-gray-700">{file.name}</span>
                <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-lg transition-colors font-medium mt-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} File(s)`}
          </button>
        </div>
      )}

      {/* Upload Guidelines */}
      {showGuidelines && (
        <div className="mt-6 bg-gray-50 rounded-lg p-4 relative">
          <button
            onClick={hideGuidelines}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Don't show again"
          >
            <X className="w-4 h-4" />
          </button>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Upload Guidelines</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>• Maximum file size: 25MB per file</li>
            <li>• Supported formats: PDF, DOC, DOCX, PPT, PPTX</li>
            <li>• Name files clearly (e.g., "Math_Quiz_Ch5_Class10A.pdf")</li>
            <li>• Files are automatically shared with enrolled students</li>
          </ul>
        </div>
      )}
    </div>
  );
}
