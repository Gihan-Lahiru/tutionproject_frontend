import { FiVideo, FiFileText, FiCheckCircle, FiClock, FiUsers, FiAward, FiBook, FiTrendingUp } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import GradesSection from '../components/Classes/GradesSection';

const Features = () => {
  const olSectionRef = useRef(null);
  const olParallaxRef = useRef(null);
  const alSectionRef = useRef(null);
  const alParallaxRef = useRef(null);

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);

    const handleScroll = () => {
      // O/L Section Parallax
      if (olParallaxRef.current && olSectionRef.current) {
        const scrolled = window.pageYOffset;
        const olSectionTop = olSectionRef.current.offsetTop;
        const olOffset = (scrolled - olSectionTop) * 0.5;
        olParallaxRef.current.style.transform = `translateY(${olOffset}px)`;
      }

      // A/L Section Parallax
      if (alParallaxRef.current && alSectionRef.current) {
        const scrolled = window.pageYOffset;
        const alSectionTop = alSectionRef.current.offsetTop;
        const alOffset = (scrolled - alSectionTop) * 0.5;
        alParallaxRef.current.style.transform = `translateY(${alOffset}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <FiVideo className="w-7 h-7" />,
      title: 'Video Lessons',
      description: 'Access comprehensive recorded video lessons anytime, anywhere. Learn at your own pace with high-quality content.',
      gradient: 'from-blue-600 to-cyan-500'
    },
    {
      icon: <FiFileText className="w-7 h-7" />,
      title: 'Study Materials',
      description: 'Download well-organized notes, worksheets, and past papers to support your learning journey.',
      gradient: 'from-cyan-600 to-blue-500'
    },
    {
      icon: <FiCheckCircle className="w-7 h-7" />,
      title: 'Assignments & Quizzes',
      description: 'Regular assessments to track your progress and identify areas that need more attention.',
      gradient: 'from-blue-700 to-cyan-600'
    },
    {
      icon: <FiClock className="w-7 h-7" />,
      title: 'Flexible Timing',
      description: 'Choose between physical classes and online sessions that fit your schedule perfectly.',
      gradient: 'from-cyan-700 to-blue-600'
    },
    {
      icon: <FiUsers className="w-7 h-7" />,
      title: 'Small Batch Sizes',
      description: 'Personal attention in small groups ensures every student gets the support they need.',
      gradient: 'from-blue-500 to-cyan-400'
    },
    {
      icon: <FiAward className="w-7 h-7" />,
      title: 'Proven Results',
      description: 'Join successful students who have achieved island rankings and top grades.',
      gradient: 'from-cyan-500 to-blue-400'
    },
    {
      icon: <FiBook className="w-7 h-7" />,
      title: 'Comprehensive Coverage',
      description: 'Complete syllabus coverage with concept-based teaching methodology.',
      gradient: 'from-blue-600 to-cyan-500'
    },
    {
      icon: <FiTrendingUp className="w-7 h-7" />,
      title: 'Progress Tracking',
      description: 'Monitor your performance with detailed analytics and personalized feedback.',
      gradient: 'from-cyan-600 to-blue-500'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
        
        {/* Hero Section */}
        <section className="pt-32 pb-12 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="hollow-to-color" style={{ 
                  fontWeight: '900'
                }}>
                  Our Features
                </span>
              </h1>
              <p className="text-xl text-gray-700 font-medium max-w-3xl mx-auto">
                Discover the comprehensive features that make our tuition classes the perfect choice for your academic success.
              </p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="pt-8 md:pt-12 pb-20 md:pb-28 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`group relative bg-gradient-to-br ${feature.gradient} rounded-2xl p-6 border-2 border-transparent overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer`}
                >
                  {/* White overlay that reduces on hover */}
                  <div className="absolute inset-0 bg-white/90 group-hover:bg-white/0 transition-all duration-500"></div>
                  
                  {/* Decorative elements */}
                  <div className={`absolute -top-10 -right-10 w-32 h-32 bg-white/50 rounded-full group-hover:scale-150 transition-transform duration-700`}></div>
                  
                  <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-5 shadow-lg transition-all duration-500`}>
                      <div className="rotate-360">
                        {feature.icon}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-white mb-3 transition-all duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-700 group-hover:text-white/90 text-sm leading-relaxed transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                  
                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Grades Section with Topics */}
        <GradesSection />

        {/* O/L Science Topics Section */}
        <section 
          ref={olSectionRef}
          className="pt-8 md:pt-12 pb-8 md:pb-12 relative overflow-hidden"
        >
        {/* Parallax Background */}
        <div 
          ref={olParallaxRef}
          className="absolute inset-0 w-full h-[120%] -top-[10%] bg-cover bg-no-repeat"
          style={{
            backgroundImage: 'url(/international-day-education-cartoon-style.jpg)',
            backgroundPosition: 'center 65%'
          }}
        ></div>
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 border border-blue-200 mb-6">
              <FiBook className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">O/L Science Syllabus</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
              Complete{' '}
              <span className="text-cyan-300">
                O/L Topics Covered
              </span>
            </h2>
            <p className="text-white/90 text-lg max-w-2xl mx-auto drop-shadow-md">
              Comprehensive coverage for Grades 6-11 O/L Science syllabus
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
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
            ].map((topic, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <span className="text-white font-bold text-lg">{topic.number}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors" style={{ fontFamily: "'UN-Gurulugomi', sans-serif" }}>
                      {topic.title}
                    </h3>
                    <p className="text-sm text-gray-600">{topic.english}</p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-600/10 to-cyan-500/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform" />
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl shadow-lg">
              <FiCheckCircle className="w-8 h-8 text-white" />
              <div className="text-white text-left">
                <p className="font-semibold text-lg">Complete Syllabus Coverage - Grades 6 to 11</p>
                <p className="text-blue-100">Theory, Practical, MCQs, Structured Questions & Past Papers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scrolling Banners Animation */}
      <section className="bg-white overflow-hidden py-8 md:py-10">
        <div className="space-y-4">
          {/* First Row - Left to Right */}
          <div className="marquee-row">
            <div className="marquee-content marquee-ltr">
              <span className="marquee-text text-blue-600">Grade 6</span>
              <span className="marquee-text text-blue-600">Grade 7</span>
              <span className="marquee-text text-blue-600">Grade 8</span>
              <span className="marquee-text text-blue-600">Grade 9</span>
              <span className="marquee-text text-blue-600">Grade 10</span>
              <span className="marquee-text text-blue-600">O/L</span>
              <span className="marquee-text text-blue-600">A/L</span>
              <span className="marquee-text text-blue-600">Science</span>
              <span className="marquee-text text-blue-600">Chemistry</span>
              <span className="marquee-text text-blue-600">Theory</span>
              <span className="marquee-text text-blue-600">Grade 6</span>
              <span className="marquee-text text-blue-600">Grade 7</span>
              <span className="marquee-text text-blue-600">Grade 8</span>
              <span className="marquee-text text-blue-600">Grade 9</span>
              <span className="marquee-text text-blue-600">Grade 10</span>
              <span className="marquee-text text-blue-600">O/L</span>
              <span className="marquee-text text-blue-600">A/L</span>
              <span className="marquee-text text-blue-600">Science</span>
              <span className="marquee-text text-blue-600">Chemistry</span>
              <span className="marquee-text text-blue-600">Theory</span>
            </div>
          </div>

          {/* Second Row - Right to Left */}
          <div className="marquee-row">
            <div className="marquee-content marquee-rtl">
              <span className="marquee-text text-blue-600">🎯 Revision</span>
              <span className="marquee-text text-blue-600">📄 Past Papers</span>
              <span className="marquee-text text-blue-600">💡 MCQ</span>
              <span className="marquee-text text-blue-600">Grade 6</span>
              <span className="marquee-text text-blue-600">Grade 7</span>
              <span className="marquee-text text-blue-600">Grade 8</span>
              <span className="marquee-text text-blue-600">Grade 9</span>
              <span className="marquee-text text-blue-600">Grade 10</span>
              <span className="marquee-text text-blue-600">O/L</span>
              <span className="marquee-text text-blue-600">A/L</span>
              <span className="marquee-text text-blue-600">🎯 Revision</span>
              <span className="marquee-text text-blue-600">📄 Past Papers</span>
              <span className="marquee-text text-blue-600">💡 MCQ</span>
              <span className="marquee-text text-blue-600">Grade 6</span>
              <span className="marquee-text text-blue-600">Grade 7</span>
              <span className="marquee-text text-blue-600">Grade 8</span>
              <span className="marquee-text text-blue-600">Grade 9</span>
              <span className="marquee-text text-blue-600">Grade 10</span>
              <span className="marquee-text text-blue-600">O/L</span>
              <span className="marquee-text text-blue-600">A/L</span>
            </div>
          </div>
        </div>
      </section>

      {/* A/L Chemistry Topics Section */}
      <section 
        ref={alSectionRef}
        className="pt-8 md:pt-12 pb-12 md:pb-16 relative overflow-hidden"
      >
        {/* Parallax Background */}
        <div 
          ref={alParallaxRef}
          className="absolute inset-0 w-full h-[120%] -top-[10%] bg-cover bg-no-repeat"
          style={{
            backgroundImage: 'url(/graduation-high-school-university-concept.jpg)',
            backgroundPosition: 'center 50%'
          }}
        ></div>
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 border border-purple-200 mb-6">
              <FiBook className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">A/L Chemistry Syllabus</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
              Complete{' '}
              <span className="text-pink-300">
                A/L Topics Covered
              </span>
            </h2>
            <p className="text-white/90 text-lg max-w-2xl mx-auto drop-shadow-md">
              Comprehensive coverage for Advanced Level Chemistry syllabus
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
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
            ].map((topic, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <span className="text-white font-bold text-lg">{topic.number}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors" style={{ fontFamily: "'UN-Gurulugomi', sans-serif" }}>
                      {topic.title}
                    </h3>
                    <p className="text-sm text-gray-600">{topic.english}</p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-600/10 to-pink-500/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform" />
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl shadow-lg">
              <FiCheckCircle className="w-8 h-8 text-white" />
              <div className="text-white text-left">
                <p className="font-semibold text-lg">Complete A/L Chemistry Coverage</p>
                <p className="text-purple-100">Theory, Practical, MCQs, Structured Questions & Past Papers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Features;