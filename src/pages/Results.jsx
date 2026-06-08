import { FiAward, FiTrendingUp, FiStar, FiUsers } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';

const Results = () => {
  const achievements = [
    {
      year: '2024',
      title: 'A/L Results',
      highlights: [
        '2024 A/L අදාළ දැනුම් ප්‍රදානය සදහා නම්යශීලීත්වයෙන් යුතු දිශානතිය නිර්මාණය කිරීම',
        'Multiple students achieved 3A passes',
        'Several students secured district rankings',
        'High success rate in Biology and Chemistry'
      ],
      gradient: 'from-blue-600 to-cyan-500'
    },
    {
      year: '2023',
      title: 'Outstanding Performance',
      highlights: [
        'Students achieved island ranks',
        '95% pass rate in O/L Science',
        'Top performers in district exams',
        'Multiple A grades in A/L subjects'
      ],
      gradient: 'from-purple-600 to-pink-500'
    }
  ];

  const statistics = [
    { icon: <FiAward />, value: '500+', label: 'Students Enrolled' },
    { icon: <FiTrendingUp />, value: '95%', label: 'Pass Rate' },
    { icon: <FiStar />, value: '50+', label: 'A Grades' },
    { icon: <FiUsers />, value: '10+', label: 'Island Ranks' }
  ];

  const testimonials = [
    {
      name: 'Student Name',
      grade: 'A/L 2024',
      achievement: '3A with Island Rank',
      message: 'The concept-based teaching approach helped me truly understand the subjects rather than just memorizing. Highly recommend!',
      image: null
    },
    {
      name: 'Student Name',
      grade: 'A/L 2023',
      achievement: 'District Rank in Biology',
      message: 'Sir\'s dedication and well-structured lessons made complex topics easy to understand. Thank you for everything!',
      image: null
    },
    {
      name: 'Student Name',
      grade: 'O/L 2024',
      achievement: 'A Pass in Science',
      message: 'The study materials and regular tests helped me prepare thoroughly. Best tuition class in the area!',
      image: null
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our{' '}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Results
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Proven track record of academic excellence. See how our students have achieved remarkable success in their examinations.
            </p>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {statistics.map((stat, index) => (
              <div key={index} className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white mx-auto mb-3">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements by Year */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Recent{' '}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Achievements
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all"
              >
                <div className={`inline-block px-4 py-2 rounded-lg bg-gradient-to-r ${achievement.gradient} text-white font-semibold mb-4`}>
                  {achievement.year}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {achievement.title}
                </h3>
                <ul className="space-y-3">
                  {achievement.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${achievement.gradient} flex items-center justify-center shrink-0 mt-0.5`}>
                        <FiAward className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-600">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Testimonials */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              What Our{' '}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Students Say
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "{testimonial.message}"
                </p>
                <div className="border-t border-gray-200 pt-4">
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.grade}
                  </div>
                  <div className="text-sm text-blue-600 font-medium mt-1">
                    {testimonial.achievement}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Be Part of Our{' '}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Success Story
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join our successful students and achieve your academic goals with expert guidance and proven teaching methods.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-4 text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg font-medium hover:shadow-xl transition-all transform hover:scale-105"
            >
              Enroll Now
            </Link>
            <Link
              to="/classes"
              className="px-8 py-4 text-gray-700 bg-white border-2 border-gray-300 rounded-lg font-medium hover:border-blue-600 hover:text-blue-600 transition-all"
            >
              View Classes
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Results;
