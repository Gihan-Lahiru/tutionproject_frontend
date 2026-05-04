import { FiCalendar, FiClock, FiMapPin, FiPhone, FiHeart, FiChevronDown, FiArrowRight, FiBook } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import GradesSection from '../components/Classes/GradesSection';

const Classes = () => {
  const [expandedAccordion, setExpandedAccordion] = useState(null);
  const toggleAccordion = (index) => {
    setExpandedAccordion(expandedAccordion === index ? null : index);
  };

  const gradeCards = [
    {
      key: 'grade-6',
      to: '/classes/grade-6',
      badge: '6',
      title: 'Grade 6',
      subtitle: 'Science',
      theme: 'blue',
    },
    {
      key: 'grade-7',
      to: '/classes/grade-7',
      badge: '7',
      title: 'Grade 7',
      subtitle: 'Science',
      theme: 'blue',
    },
    {
      key: 'grade-8',
      to: '/classes/grade-8',
      badge: '8',
      title: 'Grade 8',
      subtitle: 'Science',
      theme: 'blue',
    },
    {
      key: 'grade-9',
      to: '/classes/grade-9',
      badge: '9',
      title: 'Grade 9',
      subtitle: 'Science',
      theme: 'blue',
    },
    {
      key: 'grade-10',
      to: '/classes/grade-10',
      badge: '10',
      title: 'Grade 10',
      subtitle: 'O/L Science',
      theme: 'blue',
    },
    {
      key: 'grade-11',
      to: '/classes/grade-11',
      badge: '11',
      title: 'Grade 11',
      subtitle: 'O/L Science',
      theme: 'blue',
    },
    {
      key: 'al-chemistry',
      to: '/classes/al-chemistry',
      badge: 'A/L',
      title: 'Chemistry',
      subtitle: 'Grade 12 & 13',
      theme: 'purple',
    },
    {
      key: 'al-biology',
      to: '/classes/al-biology',
      badge: 'A/L',
      title: 'Biology',
      subtitle: 'Grade 12 & 13',
      theme: 'purple',
    },
  ];

  console.log('Grade Cards:', gradeCards, 'Length:', gradeCards.length);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Smart Learning, Flexible Timing
              </span>
            </h1>
            <p className="text-xl text-gray-700 font-medium">Choose the class schedule that works best for you</p>
          </div>
        </div>
      </section>

      {/* Grades Section with colorful cards */}
      <GradesSection />

      {/* Flyers Gallery */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
        {/* Flyers Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { src: '/WhatsApp Image 2025-12-14 at 14.44.12_e003f416.jpg', alt: 'Class Flyer 1' },
              { src: '/WhatsApp Image 2025-12-14 at 14.44.27_7465fffd.jpg', alt: 'Class Flyer 2' },
              { src: '/WhatsApp Image 2025-12-14 at 14.44.28_114ebcb5.jpg', alt: 'Class Flyer 3' },
              { src: '/WhatsApp Image 2025-12-14 at 14.44.48_832ab7f1.jpg', alt: 'Class Flyer 4' },
            ].map((flyer, index) => (
              <div key={index} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="aspect-[3/4] relative overflow-hidden bg-gray-200">
                  <img 
                    src={flyer.src} 
                    alt={flyer.alt}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    style={{ objectPosition: 'right center' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grade Level Navigation Cards */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Select Your Grade
              </span>
            </h2>
            <p className="text-lg text-gray-600">Choose your grade level to explore available classes</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {gradeCards.map((card) => {
              const isPurple = card.theme === 'purple';

              return (
                <Link
                  key={card.key}
                  to={card.to}
                  className={
                    `group relative overflow-hidden rounded-2xl bg-white border-2 border-gray-200 ` +
                    (isPurple ? 'hover:border-purple-500 ' : 'hover:border-blue-500 ') +
                    'shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2'
                  }
                >
                  <div
                    className={
                      'aspect-square relative overflow-hidden bg-gradient-to-br ' +
                      (isPurple ? 'from-purple-50 to-pink-50' : 'from-blue-50 to-cyan-50')
                    }
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={'text-center' + (card.badge === 'A/L' ? ' px-2' : '')}>
                        <div
                          className={
                            'w-20 h-20 mx-auto mb-3 rounded-2xl bg-gradient-to-br flex items-center justify-center group-hover:scale-110 transition-transform ' +
                            (isPurple ? 'from-purple-600 to-pink-500' : 'from-blue-600 to-cyan-500')
                          }
                        >
                          <span className={(card.badge === 'A/L' ? 'text-xl' : 'text-3xl') + ' font-bold text-white'}>
                            {card.badge}
                          </span>
                        </div>
                        <h3
                          className={
                            'text-lg font-bold text-gray-900 transition-colors ' +
                            (isPurple ? 'group-hover:text-purple-600' : 'group-hover:text-blue-600')
                          }
                        >
                          {card.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{card.subtitle}</p>
                      </div>
                    </div>
                    <div
                      className={
                        'absolute inset-0 bg-gradient-to-t opacity-0 group-hover:opacity-100 transition-opacity ' +
                        (isPurple ? 'from-purple-600/20 to-transparent' : 'from-blue-600/20 to-transparent')
                      }
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Class Details Section */}
      <section className="py-20 md:py-28 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 border border-blue-200 mb-6">
                <FiCalendar className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Class Details</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Flexible{' '}
                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Class Schedules
                </span>
              </h2>
              
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                We offer both physical and online classes to accommodate all students. 
                Choose the format that works best for your learning style.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                    <FiMapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Physical Classes</h4>
                    <p className="text-gray-600">Wellawaya Town - In-person interactive sessions</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-cyan-100 flex items-center justify-center shrink-0">
                    <FiClock className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Online Classes</h4>
                    <p className="text-gray-600">Zoom sessions with recorded lessons available</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact for Schedule</h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                    <FiPhone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Call or WhatsApp</p>
                    <p className="text-lg font-semibold text-gray-900">+94 XX XXX XXXX</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Available Classes</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-gray-700">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      O/L Science - Grade 10 & 11
                    </li>
                    <li className="flex items-center gap-3 text-gray-700">
                      <div className="w-2 h-2 rounded-full bg-cyan-600"></div>
                      A/L Chemistry - Grade 12 & 13
                    </li>
                    <li className="flex items-center gap-3 text-gray-700">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      A/L Biology - Grade 12 & 13
                    </li>
                    <li className="flex items-center gap-3 text-gray-700">
                      <div className="w-2 h-2 rounded-full bg-cyan-600"></div>
                      Revision Classes
                    </li>
                  </ul>
                </div>

                <Link
                  to="/contact"
                  className="block w-full text-center px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium rounded-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  Enroll Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* A/L Chemistry Topics Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 border border-purple-200 mb-6">
              <FiBook className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">A/L Chemistry Syllabus</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Complete{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                A/L Topics Covered
              </span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Comprehensive coverage of all 13 units in the A/L Chemistry syllabus
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { number: '01', title: 'පරමානුක ව්‍යුහය', english: 'Atomic Structure' },
              { number: '02', title: 'ව්‍යුහය හා බන්ධන', english: 'Structure and Bonding' },
              { number: '03', title: 'රසායනික ගණනය කිරීම්', english: 'Chemical Calculations' },
              { number: '04', title: 'පදාර්ථයේ වායු අවස්ථාව', english: 'Gaseous State of Matter' },
              { number: '05', title: 'ශක්ති විද්‍යාව', english: 'Thermodynamics' },
              { number: '06', title: 'අකාබනික රසායනය', english: 'Inorganic Chemistry' },
              { number: '07', title: 'චාලක රසායනය', english: 'Chemical Kinetics' },
              { number: '08', title: 'කාබනික රසායනය', english: 'Organic Chemistry' },
              { number: '09', title: 'රසායනික සමතුලිතතාවය', english: 'Chemical Equilibrium' },
              { number: '10', title: 'අයනික සමතුලිතතාවය', english: 'Ionic Equilibrium' },
              { number: '11', title: 'කලාප රසායනය', english: 'Qualitative Analysis' },
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
                <p className="font-semibold text-lg">Complete Syllabus Coverage</p>
                <p className="text-purple-100">Theory, Revision, MCQs, Structured Questions & Past Papers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 mb-6">
              <FiHeart className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">FAQ</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked{' '}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Find answers to common questions about our classes, schedules, and teaching methods.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: "What subjects are taught at your tuition classes?",
                answer:
                  "We specialize in G.C.E. A/L Chemistry and related science subjects. Our classes cover Physical Chemistry, Organic Chemistry, Inorganic Chemistry, MCQ techniques, and structured question practice.",
              },
              {
                question: "What are the class timings and schedules?",
                answer:
                  "We offer flexible class schedules including weekday evening classes and weekend sessions. Both physical and online (Zoom) classes are available. Contact us for the current timetable.",
              },
              {
                question: "Do you offer online classes?",
                answer:
                  "Yes! We provide comprehensive online learning support including live Zoom classes, recorded lessons for revision, PDF notes, and WhatsApp support for doubt clearing.",
              },
              {
                question: "What is the medium of instruction?",
                answer:
                  "Classes are conducted in both Sinhala and English mediums to cater to all students. You can choose the medium that you're most comfortable with.",
              },
              {
                question: "How can I join the classes?",
                answer:
                  "You can join by contacting us via phone, WhatsApp, or by filling out the contact form on this website. We'll guide you through the registration process and help you select the appropriate class.",
              },
              {
                question: "What is the fee structure?",
                answer:
                  "Our fees are competitive and affordable. Fee details vary based on the class type (physical/online) and grade level. Please contact us directly for current fee information.",
              },
              {
                question: "Do you provide study materials?",
                answer:
                  "Yes, we provide comprehensive study materials including printed notes, PDF resources, past papers, model papers, and regular assignments to ensure thorough preparation.",
              },
              {
                question: "How do you track student progress?",
                answer:
                  "We conduct regular assessments, term tests, and paper discussions. Individual attention is given to each student, and we maintain progress reports to identify areas for improvement.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl px-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full text-left font-semibold text-gray-900 hover:text-blue-600 py-5 flex items-center justify-between gap-4"
                >
                  <span>{faq.question}</span>
                  <FiChevronDown
                    className={`w-5 h-5 text-blue-600 transition-transform duration-300 shrink-0 ${
                      expandedAccordion === index ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    expandedAccordion === index ? 'max-h-96 pb-5' : 'max-h-0'
                  }`}
                >
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Still have questions? Feel free to reach out to us!
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-blue-600 font-medium hover:underline"
            >
              Contact Us
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Classes;
