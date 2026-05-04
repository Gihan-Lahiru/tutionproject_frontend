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
                          const delay = letterIndex * 0.15;
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
                          const delay = letterIndex * 0.15;
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
                  <p className="text-gray-700 leading-relaxed text-base mb-4" style={{ fontFamily: "'Noto Sans Sinhala', 'Gemunu Libre', sans-serif" }}>
                    නින්දෙදී දකින සිහන නුදුරේම සැබෑ වන්නට  මං මාවත් සොයා සැරි සරන වර්තමානයක ...
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
                  මලීෂා වික්‍රමසිංහ මහතා 6-11 විද්‍යා ගුරුවරයෙක් සහ උසස් පෙළ රසායන විද්‍යා ගුරුවරයෙකි. 2020  වර්ෂයේ සිට 2025 දක්වා  O/L , A/L විශිෂ්ට ප්‍රතිඵල සිසුන්ට ලබා දෙන ලදී. 
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

      {/* Achievements Section */}
      <section className="relative py-20 bg-white" style={{ backgroundImage: "url('/assortment-different-medals.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
        <div className="absolute inset-0 bg-white/10"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-gradient-text">
              Our Achievements
            </h2>
            <p className="text-white max-w-2xl mx-auto font-bold text-lg md:text-xl" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
              A track record of excellence and student success that speaks for itself
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: FiAward,
                value: "Best",
                label: "Outstanding Results",
                gradient: "from-orange-500 to-red-500",
                hoverColor: "bg-orange-500",
                content: "Recognized for producing top results in national exams."
              },
              {
                icon: FiTrendingUp,
                value: "High",
                label: "Consistent Pass Rates",
                gradient: "from-blue-500 to-cyan-500",
                hoverColor: "bg-blue-500",
                content: "Year after year, our students achieve high pass rates."
              },
              {
                icon: FiUsers,
                value: "1000+",
                label: "Students Guided",
                gradient: "from-purple-500 to-pink-500",
                hoverColor: "bg-purple-500",
                content: "Over a thousand students have benefited from our guidance."
              },
              {
                icon: FiStar,
                value: "Numerous",
                label: "A Grades & Distinctions",
                gradient: "from-yellow-500 to-orange-500",
                hoverColor: "bg-yellow-500",
                content: "Many students have earned A grades and distinctions."
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-full aspect-square p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 text-center border border-gray-200 flex flex-col items-center justify-center max-w-[220px] mx-auto overflow-hidden"
              >
                {/* Icon with gradient background, changes color on hover */}
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110 group-hover:${item.hoverColor}`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                {/* Value */}
                <p className="text-xl md:text-2xl font-bold text-gray-900 mb-2 transition-colors duration-300 group-hover:text-white">
                  {item.value}
                </p>
                {/* Label */}
                <p className="text-xs md:text-sm text-gray-600 leading-tight px-2 transition-colors duration-300 group-hover:text-white">{item.label}</p>
                {/* Hidden content, appears on hover */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 text-xs md:text-sm text-center z-10 rounded-full">
                  <div
                    className={`absolute inset-0 rounded-full achievement-card-gradient z-[-1]`}
                  />
                  <p className="relative z-10 font-bold text-base md:text-lg">{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teaching Approach Section */}
      <section id="approach" className="relative pt-8 pb-20 bg-white overflow-hidden" style={{ backgroundImage: "url('/3696093.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
        <div className="absolute inset-0 bg-white/50"></div>
        {/* Animated Wave Overlay - reveals background as it moves */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 45%, rgba(255,255,255,0) 55%, rgba(255,255,255,0.5) 100%)',
            width: '100%',
            animation: 'wave 15s ease-in-out infinite',
            pointerEvents: 'none'
          }}
        ></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6" style={{ textShadow: '2px 2px 6px rgba(255,255,255,0.9)' }}>
                Our Teaching Approach
              </h2>
              <p className="text-black mb-8 leading-relaxed text-lg font-semibold" style={{ textShadow: '1px 1px 4px rgba(255,255,255,0.9)' }}>
                We believe every student has the potential to succeed when guided correctly. 
                Our methodology combines traditional teaching excellence with modern 
                exam-focused strategies.
              </p>

              <div className="space-y-4">
                {[
                  { icon: FiZap, title: "Smart Teaching", description: "Simplified methods that make complex concepts easy to understand" },
                  { icon: FiTarget, title: "Exam-Oriented", description: "Lesson planning focused on exam success and practical application" },
                  { icon: FiUserCheck, title: "Individual Attention", description: "Personalized guidance for every student's unique learning needs" },
                  { icon: FiClipboard, title: "Regular Revision", description: "Consistent practice through paper discussions and progress tracking" },
                  { icon: FiClock, title: "Flexible Schedules", description: "Student-friendly class timings that work for everyone" },
                ].map((approach, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-white transition-all duration-300 group border border-transparent hover:border-gray-200 hover:shadow-md opacity-0 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.2}s`, animationFillMode: 'forwards' }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 transition-colors">
                      <approach.icon className="w-6 h-6 text-blue-600 group-hover:text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-black mb-1" style={{ textShadow: '1px 1px 3px rgba(255,255,255,0.9)' }}>{approach.title}</h4>
                      <p className="text-sm text-black font-semibold" style={{ textShadow: '1px 1px 3px rgba(255,255,255,0.8)' }}>{approach.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl blur-2xl opacity-60 animate-pulse" />
              <div className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-pink-700 rounded-3xl shadow-2xl p-8 space-y-6 border border-purple-500">
                <h3 className="text-2xl font-bold text-yellow-300 text-center">
                  අප තෝරා ගන්නේ ඇයි?
                </h3>

                <div className="space-y-4">
                  {[
                    "පළපුරුදු සහ සුදුසුකම් ලත් ගුරුවරයා",
                    "ඔප්පු වූ ප්‍රතිඵල සහ ශාස්ත්‍රීය විශිෂ්ටත්වය",
                    "සහායක සහ විනයගරුක ඉගෙනුම් පරිසරයක්",
                    "අවබෝධය සහ විභාග කාර්ය සාධනය යන දෙකටම අවධානය යොමු කිරීම",
                  ].map((reason, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <FiCheckCircle className="w-5 h-5 text-pink-300 flex-shrink-0" />
                      <span className="text-white font-medium" style={{ fontFamily: "'Noto Sans Sinhala', sans-serif" }}>{reason}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-br from-purple-800 to-pink-800 rounded-xl p-6 text-center border border-purple-600">
                  <blockquote className="text-lg italic text-pink-100 leading-relaxed font-medium" style={{ fontFamily: "'Noto Sans Sinhala', sans-serif" }}>
                    "නිවැරදි මඟ පෙන්වීමක් ලැබූ විට සෑම සිසුවෙකුටම සාර්ථක වීමට හැකියාව ඇති බව අපි විශ්වාස කරමු. විශ්වාසයෙන් එකතු වී ඔබේ අධ්‍යාපන ඉලක්ක සාක්ෂාත් කර ගන්න."
                  </blockquote>
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
      answer: "අපි විශේෂඥ වෙන්නේ G.C.E. A/L Chemistry සහ ඒ ආශ්‍රිත විද්‍යා විෂයයන් වලට. Classes වලට cover කරන්නේ  Organic Chemistry, Inorganic Chemistry, MCQ techniques, structured question practice සහ essey questions.",
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
    <section className="relative pt-12 pb-12 md:pt-16 md:pb-16 overflow-hidden">
      <div 
        className="absolute inset-0" 
        style={{ 
          backgroundImage: "url('/faq.jpg')", 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          animation: 'zoomInOut 20s ease-in-out infinite'
        }}
      ></div>
      <div className="absolute inset-0 bg-white/30"></div>
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Questions</span>
          </h2>
          <p className="text-blue-700 text-xl font-semibold max-w-2xl mx-auto">
            Find answers to common questions about our classes, schedules, and teaching methods.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`border rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md ${
                expandedIndex === index 
                  ? 'bg-gradient-to-br from-purple-100 to-pink-100 border-purple-400' 
                  : 'bg-gradient-to-br from-blue-200 via-cyan-200 to-teal-200 border-blue-500'
              }`}
            >
              <button
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className={`w-full text-left px-6 py-5 flex items-center justify-between gap-4 transition-colors ${
                  expandedIndex === index ? 'bg-purple-200/50' : 'hover:bg-blue-300/40'
                }`}
              >
                <span className={`font-semibold ${expandedIndex === index ? 'text-purple-900' : 'text-blue-900'}`}>
                  {faq.question}
                </span>
                <FiChevronDown
                  className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                    expandedIndex === index ? 'rotate-180 text-purple-700' : 'text-blue-800'
                  }`}
                />
              </button>
              {expandedIndex === index && (
                <div className="px-6 pb-5 text-gray-800 font-medium">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-900 text-lg font-semibold mb-4">
            Still have questions? Feel free to reach out to us!
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 text-blue-700 text-lg font-bold hover:text-blue-800 hover:underline transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default About;
