import { FiAward, FiTarget, FiUsers } from 'react-icons/fi'

const AboutSection = () => {
  return (
    <section id="about" className="pt-4 md:pt-6 pb-2 md:pb-3 bg-gray-100 relative" style={{ backgroundImage: "url('/3d-medical-background-with-dna-strands-plexus-design.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white via-white/95 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/95 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative w-full max-w-[280px] sm:max-w-[340px] mx-auto lg:max-w-[420px] mt-4">
            <div className="relative w-full aspect-square rounded-full overflow-hidden">
              <img src="/round.png" alt="Background" className="w-full h-full object-cover animate-spin-slow" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[88%] max-w-xs text-center px-2 sm:px-3 py-2 rounded-2xl bg-black/0 backdrop-blur-[1px]">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mx-auto mb-3 rounded-full overflow-hidden shadow-lg border-4 border-white">
                    <img src="/sirnew.png" alt="Mr. Maleesha Wickramasinghe" className="w-full h-full object-cover" style={{ objectPosition: 'center 15%' }} />
                  </div>
                  <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white mb-2 leading-tight" style={{ textShadow: '2px 2px 6px rgba(0,0,0,0.9)' }}>Mr. Maleesha Wickramasinghe</h3>
                  <p className="text-xs sm:text-sm md:text-base text-white mb-3" style={{ textShadow: '2px 2px 6px rgba(0,0,0,0.9)' }}>Science & Chemistry Educator</p>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <div className="px-3 py-1.5 rounded-full bg-blue-600 text-white text-xs sm:text-sm font-semibold shadow-lg">O/L Science</div>
                    <div className="px-3 py-1.5 rounded-full bg-cyan-600 text-white text-xs sm:text-sm font-semibold shadow-lg">A/L Chemistry</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
              Guiding Students to Success in{' '}
              <span className="text-orange-400 font-extrabold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                O/L Science & A/L Chemistry!
              </span>
            </h2>

            <div className="bg-white/90 backdrop-blur-sm border-l-4 border-blue-600 p-4 rounded-lg mb-8">
              <p className="text-base md:text-lg font-bold text-gray-900 mb-2">
                🌟 දිවයිනේ විශිෂ්ටතම ප්‍රතිඵල නිරතුරුවම බිහි කරන ගුරුවරයා!
              </p>
              <p className="text-sm md:text-base text-gray-800 font-semibold leading-relaxed" style={{ fontFamily: "'Noto Sans Sinhala', sans-serif" }}>
                මෙවරත් දිවයිනේ විශිෂ්ටයන් රැසක් බිහි කරමින් ළමුන් 500+ කට අධික සංඛ්‍යාවකගේ O/L සහ A/L කඩයිම ජය ගැනීමට මඟ පෙන්වූ ඒ අසහාය ගුරුවරයා සමඟ ඔබත් එකතු වන්න.
              </p>
            </div>

            <div className="space-y-6">
              {[
                { icon: FiTarget, title: 'Concept-Based Teaching', description: 'Deep understanding over rote learning' },
                { icon: FiAward, title: 'Proven Results', description: 'Track record of student success' },
                { icon: FiUsers, title: 'Personal Attention', description: 'Individual focus for every student' },
              ].map((item, index) => (
                <div key={index} className="flex gap-4 items-start group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shrink-0 shadow-lg group-hover:shadow-xl transition-shadow">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4
                      className={`text-orange-400 mb-1 ${item.title === 'Personal Attention' ? 'font-extrabold' : 'font-semibold'}`}
                      style={item.title === 'Personal Attention' ? undefined : { textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
                    >
                      {item.title}
                    </h4>
                    <p className="text-white font-medium" style={{ textShadow: '2px 2px 3px rgba(0,0,0,0.8)' }}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
