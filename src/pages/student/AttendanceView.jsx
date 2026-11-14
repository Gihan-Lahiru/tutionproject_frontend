import { useState } from 'react';
import { FiClock, FiExternalLink, FiMaximize2, FiSmartphone, FiAward } from 'react-icons/fi';

export default function AttendanceView() {
  const [fullscreen, setFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState('attendance'); // 'attendance' | 'results'

  const targetUrl =
    activeTab === 'attendance'
      ? 'http://localhost:5174/lms/attendance'
      : 'http://localhost:5174/lms/results';

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-2xl p-6 text-white shadow-md flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-md">
            <FiAward className="text-amber-300" />
            <span>Student Performance Hub</span>
          </div>
          <h1 className="text-2xl font-black mt-2 tracking-tight">
            {activeTab === 'attendance' ? 'Monthly Attendance Record' : 'Academic Term Marks'}
          </h1>
          <p className="text-xs text-emerald-100 mt-1">
            Track your class presence percentage, monthly attendance logs, and term exam report cards.
          </p>
        </div>

        <div className="flex gap-2">
          <a
            href={targetUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-white text-teal-800 px-4 py-2.5 text-xs font-bold shadow-sm hover:bg-teal-50 transition"
          >
            <span>Open PWA</span>
            <FiExternalLink />
          </a>
        </div>
      </div>

      {/* Switcher Tab */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'attendance'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Attendance Percentage &amp; Log
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('results')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'results'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Term Marks &amp; Report Cards
        </button>
      </div>

      {/* Embedded Frame */}
      <div
        className={`bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-all duration-300 ${
          fullscreen ? 'fixed inset-4 z-50 flex flex-col' : 'h-[740px]'
        }`}
      >
        <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-2">
            <FiSmartphone className="text-teal-600" />
            <span>LMS Performance Engine</span>
          </div>
          <button
            type="button"
            onClick={() => setFullscreen((v) => !v)}
            className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-900 font-bold"
          >
            <FiMaximize2 />
            <span>{fullscreen ? 'Exit Full Screen' : 'Full Screen'}</span>
          </button>
        </div>

        <iframe
          key={targetUrl}
          src={targetUrl}
          title="LMS Attendance & Marks"
          className="w-full flex-1 h-full border-0"
        />
      </div>
    </div>
  );
}
