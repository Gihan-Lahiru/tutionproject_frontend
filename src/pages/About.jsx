import { FiAward, FiTarget, FiUsers, FiBookOpen, FiCheckCircle, FiBook, FiStar, FiTrendingUp, FiChevronDown, FiZap, FiClock, FiClipboard, FiUserCheck, FiArrowRight, FiPhone } from 'react-icons/fi';
import { FaLinkedinIn, FaFacebookF, FaTwitter, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import { useState, useEffect, useRef } from 'react';

// Keyframe animation for wave effect
const waveAnimation = `
  @keyframes wave {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  @keyframes fadeInUp {
    0% {
      opacity: 0;
      transform: translateY(30px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes zoomInOut {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }
`;

const About = () => {
  const [animationKey, setAnimationKey] = useState(0);
  const [teacherAnimationKey, setTeacherAnimationKey] = useState(0);
  const [skillsAnimationKey, setSkillsAnimationKey] = useState(0);
  const heroRef = useRef(null);
  const teacherRef = useRef(null);
  const skillsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === heroRef.current) {
              setAnimationKey(prev => prev + 1);
            } else if (entry.target === teacherRef.current) {
              setTeacherAnimationKey(prev => prev + 1);
            } else if (entry.target === skillsRef.current) {
              setSkillsAnimationKey(prev => prev + 1);
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }
    if (teacherRef.current) {
      observer.observe(teacherRef.current);
    }
    if (skillsRef.current) {
      observer.observe(skillsRef.current);
    }

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
      if (teacherRef.current) {
        observer.unobserve(teacherRef.current);
      }
      if (skillsRef.current) {
        observer.unobserve(skillsRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <style>{waveAnimation}</style>
      <Navbar />

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[85vh] flex items-center pt-20 overflow-hidden bg-gray-900">
        {/* Background Image with Animation */}
        <div className="absolute inset-0 opacity-90 animate-ken-burns">
          <img src="/cartoon-ai-robot-scene.jpg" alt="Background" className="w-full h-full object-cover object-top scale-110" />
        </div>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium mb-6 backdrop-blur-sm">
              <FiStar className="w-4 h-4 fill-current" />
              Guiding Students to the Highest Levels of Academic Success
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" key={animationKey}>
              {(() => {
                const words1 = ["Guiding", "Students", "to", "the"];
                const words2 = ["Highest", "Levels", "of", "Academic", "Success"];
                let letterIndex = 0;
                return (
                  <>
                    {words1.map((word, wordIndex) => (
                      <span key={`w1-${wordIndex}`} className="inline-block mr-2">
                        {word.split('').map((char, charIndex) => {
                          const delay = letterIndex * 0.04;
                          letterIndex++;
                          return (
                            <span
                              key={`w1-${wordIndex}-${charIndex}`}
                              className="inline-block animate-letter-fill"
                              style={{
                                animationDelay: `${delay}s`,
                                WebkitTextStroke: '2px #ffffff',
                                color: 'transparent'
                              }}
                            >
                              {char}
                            </span>
                          );
                        })}
                      </span>
                    ))}
                    {words2.map((word, wordIndex) => (
                      <span key={`w2-${wordIndex}`} className="inline-block mr-2">
                        {word.split('').map((char, charIndex) => {
                          const delay = letterIndex * 0.04;
                          letterIndex++;
                          return (
                            <span
                              key={`w2-${wordIndex}-${charIndex}`}
                              className="inline-block animate-letter-fill-red"
                              style={{
                                animationDelay: `${delay}s`,
                                WebkitTextStroke: '3px #ff4500',
                                color: 'transparent'
                              }}
                            >
                              {char}
                            </span>
                          );
                        })}
                      </span>
                    ))}
                  </>
                );
              })()}
            </h1>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              We believe every student has the potential to succeed when guided correctly through structured teaching, exam-focused strategies, and individual attention.
            </p>
          </div>
        </div>
      </section>

      {/* Teacher Profile Section */}
      <section ref={teacherRef} className="py-20 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-gradient-text">
              Meet Your Teacher
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg md:text-xl font-bold">
              5+ years of dedicated teaching experience with proven results
            </p>
          </div>

          {/* Teacher Card - Combined Image and Info */}
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 md:gap-4 items-start">
              {/* Left - Teacher Image Card */}
              <div className="flex justify-center md:justify-start">
                <div className="relative w-full max-w-[420px]" style={{ aspectRatio: '7/10' }}>
                  {/* Teacher Image */}
                  <img src="/sirnew.png" alt="Mr. Maleesha Wickramasinghe" className="w-full h-full object-cover rounded-2xl shadow-2xl" style={{ objectPosition: 'center 15%' }} />

                  {/* Overlay gradient at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-900/90 via-purple-900/70 to-transparent rounded-b-2xl p-6">
                    {/* Social Media Icons */}
                    <div className="flex justify-center gap-3 mb-4">
                      <a href="#" className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white hover:bg-blue-600 transition-all duration-300 hover:scale-110">
                        <FaLinkedinIn className="w-5 h-5" />
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white hover:bg-blue-700 transition-all duration-300 hover:scale-110">
                        <FaFacebookF className="w-5 h-5" />
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white hover:bg-sky-500 transition-all duration-300 hover:scale-110">
                        <FaTwitter className="w-5 h-5" />
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white hover:bg-red-600 transition-all duration-300 hover:scale-110">
                        <FaYoutube className="w-5 h-5" />
                      </a>
                    </div>

                    {/* Name and Title */}
                    <div className="text-center text-white">
                      <h3 className="text-2xl font-bold mb-1">Maleesha Wickramasinghe</h3>
                      <p className="text-purple-200 font-medium">Science Tutor</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Teacher Info */}
              <div className="space-y-5 px-4 md:px-0">
                <div>
                  <p className="text-orange-600 font-bold text-lg mb-3">Science Tutor :</p>
                  <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">
                    Maleesha Wickramasinghe
                  </h3>
                  <p
                    className="text-gray-700 leading-relaxed text-base mb-4 text-2xl font-semibold italic"
                    style={{
                      fontFamily: "'Noto Sans Sinhala', 'Gemunu Libre', sans-serif",
                      animation: 'fadeInUp 0.9s ease both',
                    }}
                  >
                    නින්දෙදී දකින සිහින නුදුරේම සැබෑ වන්නට  මං මාවත් සොයා සැරි සරන වර්තමානයක ...
                  </p>
                  <p className="text-gray-700 leading-relaxed text-base" style={{ fontFamily: "'Noto Sans Sinhala', 'Gemunu Libre', sans-serif" }}>
                    ඔහු තම ඉගැන්වීම් ක්‍රමවේදයෙන් සිසුන්ගේ අධ්‍යාපන මට්ටම ඉහළ නැංවීමට සමත් වී ඇති අතර විභාග සඳහා විශිෂ්ට ප්‍රතිඵල ලබා ගැනීමට සහාය වන පරිදි විෂය නිර්දේශය සකස් කර ඇත.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <p className="text-gray-900 font-bold mb-1 text-lg">Locations :</p>
                    <p className="text-gray-700 text-lg">Prebhashi Hettipola , Focus Hadungamuwa</p>
                  </div>
                  <div>
                    <p className="text-gray-900 font-bold mb-1 text-lg">Hotline :</p>
                    <p className="text-gray-700 text-lg">+94 71 439 0924</p>
                  </div>
                  <div>
                    <p className="text-gray-900 font-bold mb-1 text-lg">Email :</p>
                    <p className="text-gray-700 text-lg">maleeshaw004@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teaching Experience Section */}
      <section className="pt-8 pb-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left - The Guiding Star */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">The Guiding Star</h3>
              <p className="text-gray-700 leading-relaxed mb-6" style={{ fontFamily: "'Noto Sans Sinhala', 'Gemunu Libre', sans-serif" }}>
                මලීෂා වික්‍රමසිංහ 6-11 විද්‍යා ගුරුවරයෙක් සහ උසස් පෙළ රසායන විද්‍යා ගුරුවරයෙකි. 2020  වර්ෂයේ සිට 2025 දක්වා  O/L , A/L විශිෂ්ට ප්‍රතිඵල සිසුන්ට ලබා දෙන ලදී.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6" style={{ fontFamily: "'Noto Sans Sinhala', 'Gemunu Libre', sans-serif" }}>
                ඔහුගේ විශිෂ්ට ඉගැන්වීම් ක්‍රමවේදය සහ අධ්‍යාපන ප්‍රවේශය හේතුවෙන් සිසුන් විශාල සංඛ්‍යාවකට විශිෂ්ට ප්‍රතිඵල ලබා ගැනීමට හැකි වී ඇත.
              </p>
              <p className="text-gray-700 leading-relaxed" style={{ fontFamily: "'Noto Sans Sinhala', 'Gemunu Libre', sans-serif" }}>
                විභාග පාඨමාලා ආවරණය කරමින්, MCQ සාකච්ඡා සහ ව්‍යාපෘති පාඨමාලා ඇතුළත් පන්ති පවත්වයි. පාඨමාලාව සම්පූර්ණයෙන්ම, කෙටි සටහන්, MCQ සාකච්ඡා සහ පුද්ගලික පරීක්ෂණ ඇතුළත් වේ.
              </p>
            </div>

            {/* Right - Skilled Experience */}
            <div ref={skillsRef}>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Skilled Experience</h3>

              <div key={skillsAnimationKey} className="space-y-6">
                {/* Teaching experience */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 font-semibold">Teaching experience</span>
                    <span className="text-gray-900 font-bold">100%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full animate-progress-bar" style={{ width: '0%' }}></div>
                  </div>
                </div>

                {/* Student Mentoring */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 font-semibold">Student Mentoring & Motivation</span>
                    <span className="text-gray-900 font-bold">100%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full animate-progress-bar" style={{ width: '0%', animationDelay: '0.2s' }}></div>
                  </div>
                </div>

                {/* Exam Strategy Coaching */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 font-semibold">Exam Strategy Coaching</span>
                    <span className="text-gray-900 font-bold">100%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full animate-progress-bar" style={{ width: '0%', animationDelay: '0.4s' }}></div>
                  </div>
                </div>

                {/* Problem Solving Skills */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 font-semibold">Problem Solving Skills</span>
                    <span className="text-gray-900 font-bold">100%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full animate-progress-bar" style={{ width: '0%', animationDelay: '0.6s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Proven Track Record / Achievements Section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white overflow-hidden border-t border-slate-800">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/25 text-blue-300 text-xs sm:text-sm font-semibold mb-4 backdrop-blur-md">
              <FiAward className="w-4 h-4 text-blue-400" />
              <span>Proven Track Record</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
              Proven Track Record of <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">Success</span>
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
              A history of excellence, island & district rankings, and student distinctions that speaks for itself.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: FiAward,
                value: "Island & District",
                label: "Outstanding Results",
                gradient: "from-amber-500 to-orange-500",
                content: "Recognized for producing top results and rankings in national exams."
              },
              {
                icon: FiTrendingUp,
                value: "High Pass Rate",
                label: "Consistent Performance",
                gradient: "from-blue-500 to-cyan-500",
                content: "Year after year, students achieve exceptional pass rates and distinction grades."
              },
              {
                icon: FiUsers,
                value: "1000+",
                label: "Students Guided",
                gradient: "from-indigo-500 to-purple-500",
                content: "Over a thousand students have benefited from our systematic learning guidance."
              },
              {
                icon: FiStar,
                value: "Numerous A's",
                label: "A Grades & Distinctions",
                gradient: "from-emerald-500 to-teal-500",
                content: "Hundreds of students achieve distinction A grades in O/L Science & A/L Chemistry."
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="relative bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-white/10 hover:border-blue-400/50 shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group"
                >
                  <div>
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white mb-5 shadow-md shadow-black/30 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    {/* Stat Value */}
                    <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1">
                      {item.value}
                    </div>

                    {/* Stat Label */}
                    <h3 className="text-base font-bold text-slate-200 mb-2">
                      {item.label}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Teaching Approach Section */}
      <section id="approach" className="py-16 md:py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs sm:text-sm font-semibold mb-4">
                <FiZap className="w-4 h-4 text-blue-600" />
                <span>Proven Methodology</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                Our Teaching Approach
              </h2>
              <p className="text-slate-600 mb-8 leading-relaxed text-base md:text-lg">
                We believe every student has the potential to succeed when guided correctly.
                Our methodology combines traditional teaching excellence with modern
                exam-focused strategies.
              </p>

              <div className="space-y-3.5">
                {[
                  { icon: FiZap, title: "Smart Teaching", description: "Simplified methods that make complex concepts easy to understand" },
                  { icon: FiTarget, title: "Exam-Oriented", description: "Lesson planning focused on exam success and practical application" },
                  { icon: FiUserCheck, title: "Individual Attention", description: "Personalized guidance for every student's unique learning needs" },
                  { icon: FiClipboard, title: "Regular Revision", description: "Consistent practice through paper discussions and progress tracking" },
                  { icon: FiClock, title: "Flexible Schedules", description: "Student-friendly class timings that work for everyone" },
                ].map((approach, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all"
                  >
                    <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                      <approach.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base mb-1">{approach.title}</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">{approach.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual / Highlights Card */}
            <div className="relative">
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl shadow-xl p-8 md:p-10 border border-slate-700/80 space-y-6 relative overflow-hidden">
                {/* Subtle ambient light */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-blue-300 text-xs font-semibold mb-4">
                    <span>Student Excellence</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-6">
                    අප තෝරා ගන්නේ ඇයි?
                  </h3>

                  <div className="space-y-3.5 mb-8">
                    {[
                      "පළපුරුදු සහ සුදුසුකම් ලත් ගුරුවරයා",
                      "ඔප්පු වූ ප්‍රතිඵල සහ ශාස්ත්‍රීය විශිෂ්ටත්වය",
                      "සහායක සහ විනයගරුක ඉගෙනුම් පරිසරයක්",
                      "අවබෝධය සහ විභාග කාර්ය සාධනය යන දෙකටම අවධානය යොමු කිරීම",
                    ].map((reason, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                          <FiCheckCircle className="w-4 h-4" />
                        </div>
                        <span className="text-slate-200 text-sm md:text-base font-medium" style={{ fontFamily: "'Noto Sans Sinhala', sans-serif" }}>
                          {reason}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <blockquote className="text-sm md:text-base italic text-slate-300 leading-relaxed font-medium" style={{ fontFamily: "'Noto Sans Sinhala', sans-serif" }}>
                      "නිවැරදි මඟ පෙන්වීමක් ලැබූ විට සෑම සිසුවෙකුටම සාර්ථක වීමට හැකියාව ඇති බව අපි විශ්වාස කරමු. විශ්වාසයෙන් එකතු වී ඔබේ අධ්‍යාපන ඉලක්ක සාක්ෂාත් කර ගන්න."
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      <Footer />
    </div>
  );
};

const FAQSection = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const faqs = [
    {
      question: "Tuition classes වලට ඉගන්වන්නේ මොන විෂයයන්ද?",
      answer: "අපි විශේෂඥ වෙන්නේ G.C.E. A/L Chemistry සහ ඒ ආශ්‍රිත විද්‍යා විෂයයන් වලට. Classes වලට cover කරන්නේ Organic Chemistry, Inorganic Chemistry, MCQ techniques, structured question practice සහ essay questions.",
    },
    {
      question: "Class timings සහ schedules මොනවද?",
      answer: "අපි flexible class schedules offer කරනවා - weekday evening classes සහ weekend sessions. Physical සහ online (Zoom) classes දෙකම available. Current timetable එක සඳහා අප අමතන්න.",
    },
    {
      question: "Online classes තියෙනවද?",
      answer: "ඔව්! අපි comprehensive online learning support provide කරනවා - live Zoom classes, revision සඳහා recorded lessons, PDF notes, සහ doubts clear කරන්න WhatsApp support.",
    },
    {
      question: "Medium of instruction එක මොකක්ද?",
      answer: "Classes conduct කරන්නේ Sinhala සහ English mediums දෙකෙන්ම. ඔබට comfortable medium එක තෝරා ගන්න පුළුවන්.",
    },
    {
      question: "Classes වලට join වෙන්නෙ කොහොමද?",
      answer: "Phone, WhatsApp හරහා හෝ මේ website එකේ contact form එක fill කරලා අප අමතන්න පුළුවන්. අපි registration process එක guide කරනවා සහ appropriate class එක select කරන්න help කරනවා.",
    },
    {
      question: "Fee structure එක මොකක්ද?",
      answer: "අපේ fees competitive සහ affordable. Fee details class type (physical/online) සහ grade level අනුව වෙනස් වෙනවා. Current fee information සඳහා අප directly අමතන්න.",
    },
    {
      question: "Study materials provide කරනවද?",
      answer: "ඔව්, අපි comprehensive study materials provide කරනවා - printed notes, PDF resources, past papers, model papers, සහ thorough preparation එකක් සඳහා regular assignments.",
    },
    {
      question: "Student progress track කරන්නේ කොහොමද?",
      answer: "අපි regular assessments, term tests, සහ paper discussions conduct කරනවා. සෑම student කෙනෙකුටම individual attention දෙනවා, සහ areas for improvement identify කරන්න progress reports maintain කරනවා.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs sm:text-sm font-semibold mb-3">
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Frequently Asked <span className="text-blue-600">Questions</span>
          </h2>
          <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto">
            Find answers to common questions about our physical & online classes, schedules, and learning materials.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = expandedIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-white border-blue-400 shadow-md ring-1 ring-blue-100'
                    : 'bg-slate-50/70 border-slate-200/90 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <button
                  onClick={() => setExpandedIndex(isOpen ? null : index)}
                  className="w-full text-left px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 transition-colors cursor-pointer"
                >
                  <span className={`text-base sm:text-lg font-bold transition-colors ${
                    isOpen ? 'text-blue-600' : 'text-slate-900'
                  }`}>
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    isOpen ? 'bg-blue-50 text-blue-600 rotate-180' : 'bg-slate-200/60 text-slate-500'
                  }`}>
                    <FiChevronDown className="w-4 h-4 transition-transform duration-200" />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100">
                    <p className="pt-2">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center p-6 rounded-2xl bg-slate-50 border border-slate-200">
          <p className="text-slate-800 text-base font-semibold mb-3">
            Still have questions? Feel free to reach out to us!
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 shadow-sm hover:shadow transition-all"
          >
            Contact Us <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default About;
