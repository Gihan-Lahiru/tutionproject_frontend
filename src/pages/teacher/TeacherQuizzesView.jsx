import { useState } from 'react';
import { ExternalLink, Maximize2, Sparkles, Smartphone, CheckSquare } from 'lucide-react';

export default function TeacherQuizzesView() {
  const [fullscreen, setFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState('quizzes'); // 'quizzes' | 'grading' | 'marks'

  const getUrl = () => {
    if (activeTab === 'quizzes') return 'http://localhost:5174/lms/teacher/quizzes';
    if (activeTab === 'grading') return 'http://localhost:5174/lms/teacher/assignments';
    return 'http://localhost:5174/lms/teacher/marks-attendance';
  };

  const targetUrl = getUrl();

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 rounded-2xl p-6 text-white shadow-md flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>AI Powered Assessment Suite</span>
          </div>
          <h1 className="text-2xl font-black mt-2 tracking-tight">
            MCQ Quizzes &amp; Gemini AI Generator
          </h1>
          <p className="text-xs text-blue-100 mt-1">
            Build timed quizzes, parse questions from text/PDF, and generate assessments using Google Gemini 1.5 Flash.
          </p>
        </div>

        <a
          href={targetUrl}
          target="_blank"
          rel="noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-white text-indigo-700 px-4 py-2.5 text-xs font-bold shadow-sm hover:bg-blue-50 transition"
        >
          <span>Open Mobile Console</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* Switcher Tab */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('quizzes')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'quizzes'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          MCQ Quizzes &amp; AI Generator
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('grading')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'grading'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Assignment Grading Center
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('marks')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'marks'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Roll Call Attendance &amp; Marks
        </button>
      </div>

      {/* Embedded Console Frame */}
      <div
        className={`bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-all duration-300 ${
          fullscreen ? 'fixed inset-4 z-50 flex flex-col' : 'h-[760px]'
        }`}
      >
        <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-indigo-600" />
            <span>Teacher Mobile LMS Engine</span>
          </div>
          <button
            type="button"
            onClick={() => setFullscreen((v) => !v)}
            className="inline-flex items-center gap-1 text-indigo-700 hover:text-indigo-900 font-bold"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            <span>{fullscreen ? 'Exit Full Screen' : 'Full Screen'}</span>
          </button>
        </div>

        <iframe
          key={targetUrl}
          src={targetUrl}
          title="LMS Teacher Console"
          className="w-full flex-1 h-full border-0"
        />
      </div>
    </div>
  );
}
