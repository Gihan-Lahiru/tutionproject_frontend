import { useState } from 'react';
import { FiCheckCircle, FiExternalLink, FiMaximize2, FiSmartphone, FiAward } from 'react-icons/fi';

export default function QuizzesView() {
  const [fullscreen, setFullscreen] = useState(false);
  const lmsUrl = 'http://localhost:5174/lms/quizzes';

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-md flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-md">
            <FiAward className="text-amber-300" />
            <span>Interactive Assessment</span>
          </div>
          <h1 className="text-2xl font-black mt-2 tracking-tight">Timed MCQ Quizzes</h1>
          <p className="text-xs text-blue-100 mt-1">
            Complete timed tests, review automated scores, and view teacher answer keys &amp; explanations.
          </p>
        </div>

        <div className="flex gap-2">
          <a
            href={lmsUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-white text-blue-700 px-4 py-2.5 text-xs font-bold shadow-sm hover:bg-blue-50 transition"
          >
            <span>Open PWA</span>
            <FiExternalLink />
          </a>
        </div>
      </div>

      {/* Embedded Player Frame */}
      <div
        className={`bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-all duration-300 ${
          fullscreen ? 'fixed inset-4 z-50 flex flex-col' : 'h-[740px]'
        }`}
      >
        <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-2">
            <FiSmartphone className="text-blue-600" />
            <span>LMS Mobile App Engine • Timed MCQ Player</span>
          </div>
          <button
            type="button"
            onClick={() => setFullscreen((v) => !v)}
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold"
          >
            <FiMaximize2 />
            <span>{fullscreen ? 'Exit Full Screen' : 'Full Screen'}</span>
          </button>
        </div>

        <iframe
          src={lmsUrl}
          title="LMS Timed Quizzes"
          className="w-full flex-1 h-full border-0"
        />
      </div>
    </div>
  );
}
