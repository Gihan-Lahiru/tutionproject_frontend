import { useState } from 'react';
import { FiVideo, FiFileText, FiCheckCircle, FiClock, FiUsers, FiAward, FiBook, FiTrendingUp, FiLayers, FiCompass } from 'react-icons/fi';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import GradesSection from '../components/Classes/GradesSection';

export default function Features() {
  const [activeSyllabus, setActiveSyllabus] = useState('ol');

  const features = [
    {
      icon: FiVideo,
      title: 'Video Lessons',
      description: 'Access comprehensive recorded video lessons anytime, anywhere. Learn at your own pace with high-quality content.',
    },
    {
      icon: FiFileText,
      title: 'Study Materials',
      description: 'Download well-organized notes, worksheets, and model papers to support your learning journey.',
    },
    {
      icon: FiCheckCircle,
      title: 'Assignments & Quizzes',
      description: 'Regular assessments and monthly evaluations to track your progress and identify areas for improvement.',
    },
    {
      icon: FiClock,
      title: 'Flexible Timing',
      description: 'Choose between physical classes and interactive online sessions that fit your daily schedule.',
    },
    {
      icon: FiUsers,
      title: 'Focused Batch Sizes',
      description: 'Individual attention in manageable groups ensures every student gets personal guidance.',
    },
    {
      icon: FiAward,
      title: 'Proven Results',
      description: 'Join successful students who have achieved top school rankings and high distinction passes.',
    },
    {
      icon: FiBook,
      title: 'Comprehensive Coverage',
      description: 'Full syllabus coverage following the national curriculum with deep, concept-based understanding.',
    },
    {
      icon: FiTrendingUp,
      title: 'Continuous Tracking',
      description: 'Monitor your performance through structured feedback and targeted revision sessions.',
    },
  ];

  const olTopics = [
    { number: '01', title: 'විද්‍යාව සහ තාක්ෂණය', english: 'Science and Technology' },
    { number: '02', title: 'විද්‍යුත් චුම්භකත්වය', english: 'Electricity and Magnetism' },
    { number: '03', title: 'තරංග', english: 'Waves' },
    { number: '04', title: 'තාපය හා ශක්තිය', english: 'Heat and Energy' },
    { number: '05', title: 'ආලෝකය', english: 'Light' },
    { number: '06', title: 'පරමාණුක ව්‍යුහය', english: 'Atomic Structure' },
    { number: '07', title: 'රසායනික ප්‍රතික්‍රියා', english: 'Chemical Reactions' },
    { number: '08', title: 'අම්ල හා භෂ්ම', english: 'Acids and Bases' },
    { number: '09', title: 'කාබනික රසායනය', english: 'Organic Chemistry' },
    { number: '10', title: 'සෛලීය ජීව විද්‍යාව', english: 'Cell Biology' },
    { number: '11', title: 'ශාක හා සතුන්', english: 'Plants and Animals' },
    { number: '12', title: 'මානව ශරීරය', english: 'Human Body Systems' },
    { number: '13', title: 'පරිසරය', english: 'Environment' },
    { number: '14', title: 'ජානමය විද්‍යාව', english: 'Genetics' },
    { number: '15', title: 'පරිණාමය', english: 'Evolution' },
  ];

  const alTopics = [
    { number: '01', title: 'පරමාණුක ව්‍යුහය', english: 'Atomic Structure' },
    { number: '02', title: 'ව්‍යුහය හා බන්ධන', english: 'Structure and Bonding' },
    { number: '03', title: 'රසායනික ගණනය කිරීම්', english: 'Chemical Calculations' },
    { number: '04', title: 'පදාර්ථයේ වායු අවස්ථාව', english: 'Gaseous State' },
    { number: '05', title: 'ශක්ති විද්‍යාව', english: 'Energetics' },
    { number: '06', title: 'අකාබනික රසායනය', english: 'Inorganic Chemistry' },
    { number: '07', title: 'චාලක රසායනය', english: 'Chemical Kinetics' },
    { number: '08', title: 'කාබනික රසායනය', english: 'Organic Chemistry' },
    { number: '09', title: 'රසායනික සමතුලිතතාවය', english: 'Chemical Equilibrium' },
    { number: '10', title: 'අයනික සමතුලිතතාවය', english: 'Ionic Equilibrium' },
    { number: '11', title: 'කලාප රසායනය', english: 'Block Chemistry' },
    { number: '12', title: 'විද්‍යුත් රසායනය', english: 'Electrochemistry' },
    { number: '13', title: 'කර්මාන්ත රසායනය', english: 'Industrial Chemistry' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <Navbar />

      {/* Page Hero Header - Dark Theme matching Home & About */}
      <section className="relative pt-32 pb-20 md:pb-24 bg-slate-950 border-b border-slate-800/80 overflow-hidden text-white">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[320px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[320px] h-[220px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[280px] h-[200px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/25 text-blue-300 text-xs sm:text-sm font-semibold mb-5 backdrop-blur-md">
            <FiCompass className="w-4 h-4 text-blue-400" />
            <span>Learning Methodology & Curriculum</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-5 leading-tight">
            Our Features & <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">Syllabus</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Discover the teaching tools, class benefits, and comprehensive syllabus structure designed to ensure your academic excellence.
          </p>
        </div>
      </section>

      {/* 8 Feature Cards Grid */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">What Makes Our Classes Stand Out</h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">Core pillars that guide every lecture and revision session</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Grade Selector / Grades Section */}
      <section className="py-12 bg-white border-y border-slate-200">
        <GradesSection />
      </section>

      {/* Syllabus Topics Section with Clean Tabs */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-semibold mb-3">
              <FiLayers className="w-3.5 h-3.5" />
              <span>Syllabus Breakdown</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
              Curriculum Units Covered
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Select between O/L Science and A/L Chemistry to view covered units
            </p>

            {/* Tab Switcher */}
            <div className="inline-flex p-1 mt-6 rounded-xl bg-slate-200/80 border border-slate-300">
              <button
                type="button"
                onClick={() => setActiveSyllabus('ol')}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeSyllabus === 'ol'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                O/L Science (Grades 6–11)
              </button>
              <button
                type="button"
                onClick={() => setActiveSyllabus('al')}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeSyllabus === 'al'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                A/L Chemistry (Grades 12–13)
              </button>
            </div>
          </div>

          {/* Active Syllabus Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(activeSyllabus === 'ol' ? olTopics : alTopics).map((topic, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:border-blue-400 hover:shadow transition-all flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 font-bold text-sm flex items-center justify-center shrink-0 border border-blue-100">
                  {topic.number}
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-slate-900 text-sm sm:text-base truncate">
                    {topic.title}
                  </h4>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{topic.english}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Confirmation Card */}
          <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <FiCheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-base sm:text-lg">
                  Complete {activeSyllabus === 'ol' ? 'O/L Science' : 'A/L Chemistry'} Syllabus Coverage
                </p>
                <p className="text-xs sm:text-sm text-blue-100">
                  Includes Theory, Practical Demonstrations, MCQs, Structured Questions & Past Papers
                </p>
              </div>
            </div>
            <a
              href="/contact"
              className="px-5 py-2.5 rounded-xl bg-white text-blue-600 text-sm font-bold shadow hover:bg-blue-50 transition-colors shrink-0"
            >
              Enroll in Class
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
