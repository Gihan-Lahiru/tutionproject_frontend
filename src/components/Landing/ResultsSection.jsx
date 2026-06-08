import { FiAward, FiClock, FiMessageCircle, FiStar, FiTrendingUp, FiUser } from 'react-icons/fi'

const ResultsSection = () => {
  return (
    <>
      <section id="results" className="relative pt-8 pb-32 md:pt-12 md:pb-40 overflow-visible">
        {/* Background image - absolute positioned from section top */}
        <div
          className="absolute inset-0 bg-cover bg-top bg-no-repeat"
          style={{
            backgroundImage: 'url(/future-visions-business-technology-concept.jpg)',
            zIndex: 0
          }}
        >
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* Horizontal Scrolling Text */}
        <div className="scrolling-text-container" style={{ top: '30%', zIndex: 1 }}>
          <div className="scrolling-text scrolling-text-1">
            SCIENCE  •  CHEMISTRY  •  SUCCESS  •  A+  •  EXCELLENCE  •  O/L  •  A/L  •  SCIENCE  •  CHEMISTRY  •  SUCCESS  •  A+  •  EXCELLENCE  •  O/L  •  A/L  •  SCIENCE  •  CHEMISTRY  •  SUCCESS  •  A+  •  EXCELLENCE  •  O/L  •  A/L  •  SCIENCE  •  CHEMISTRY  •  SUCCESS  •  A+  •  EXCELLENCE  •  O/L  •  A/L  •  SCIENCE  •  CHEMISTRY  •  SUCCESS  •  A+  •  EXCELLENCE  •  O/L  •  A/L  •
          </div>
        </div>
        <div className="scrolling-text-container" style={{ top: '50%', zIndex: 1 }}>
          <div className="scrolling-text scrolling-text-2">
            95% PASS RATE  •  TOP GRADES  •  EXPERT TEACHING  •  PROVEN RESULTS  •  95% PASS RATE  •  TOP GRADES  •  EXPERT TEACHING  •  PROVEN RESULTS  •  95% PASS RATE  •  TOP GRADES  •  EXPERT TEACHING  •  PROVEN RESULTS  •  95% PASS RATE  •  TOP GRADES  •  EXPERT TEACHING  •  PROVEN RESULTS  •  95% PASS RATE  •  TOP GRADES  •  EXPERT TEACHING  •  PROVEN RESULTS  •
          </div>
        </div>
        <div className="scrolling-text-container" style={{ top: '70%', zIndex: 1 }}>
          <div className="scrolling-text scrolling-text-3">
            QUALITY EDUCATION  •  STUDENT SUCCESS  •  ACHIEVEMENT  •  LEARNING  •  QUALITY EDUCATION  •  STUDENT SUCCESS  •  ACHIEVEMENT  •  LEARNING  •  QUALITY EDUCATION  •  STUDENT SUCCESS  •  ACHIEVEMENT  •  LEARNING  •  QUALITY EDUCATION  •  STUDENT SUCCESS  •  ACHIEVEMENT  •  LEARNING  •  QUALITY EDUCATION  •  STUDENT SUCCESS  •  ACHIEVEMENT  •  LEARNING  •
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-20">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 border border-cyan-200 mb-6">
              <FiAward className="w-4 h-4 text-cyan-600" />
              <span className="text-sm font-medium text-cyan-600">Results & Achievements</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
              <span className="typing-text-letter-animation">
                Proven Track Record of Success
              </span>
            </h2>
            <p className="text-white text-lg md:text-xl drop-shadow-md">
              Our students consistently achieve excellent results in their examinations
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mb-10">
            {[
              { value: '95%', label: 'Pass Rate', description: 'Consistently high pass rates', icon: 'FiTrendingUp', color: 'from-emerald-500 to-green-600', bgGlow: 'group-hover:shadow-emerald-500/50' },
              { value: '100+', label: 'A Passes', description: 'Students achieving A grades', icon: 'FiAward', color: 'from-amber-500 to-orange-600', bgGlow: 'group-hover:shadow-amber-500/50' },
              { value: '500+', label: 'Students', description: 'Successfully guided', icon: 'FiUsers', color: 'from-blue-500 to-cyan-600', bgGlow: 'group-hover:shadow-blue-500/50' },
              { value: '5+', label: 'Years', description: 'Teaching excellence', icon: 'FiClock', color: 'from-purple-500 to-pink-600', bgGlow: 'group-hover:shadow-purple-500/50' },
            ].map((item, index) => (
              <div
                key={index}
                className="group relative text-center p-5 md:p-6 rounded-2xl bg-white/95 backdrop-blur-sm border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 overflow-hidden"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                {/* Animated background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                {/* Glow effect */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${item.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10`}></div>

                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} mb-3 shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:rotate-12 group-hover:scale-110`}>
                    <FiTrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div
                    className={`text-4xl md:text-5xl font-black bg-gradient-to-r ${item.color} bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform duration-300`}
                    style={{
                      textShadow: '0 0 30px rgba(59, 130, 246, 0.3)',
                    }}
                  >
                    {item.value}
                  </div>
                  <div className="font-bold text-gray-900 mb-1 text-base tracking-wide uppercase">{item.label}</div>
                  <div className="text-xs text-gray-600 leading-relaxed">{item.description}</div>
                </div>

                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-white/50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Quote Box - grouped in flow on mobile, floating overlay on md+ */}
        <div className="relative mt-10 z-30 md:absolute md:bottom-0 md:left-0 md:right-0 md:mt-0 md:translate-y-1/2">
          <div className="max-w-6xl mx-auto px-4">
            <div className="relative p-10 md:p-14 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: 'url(/SL_071219_21480_25.jpg)',
                  backgroundAttachment: 'fixed',
                }}
              >
                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/95 to-cyan-500/95"></div>
              </div>

              <div className="absolute top-6 left-6 opacity-20 z-10">
                <FiMessageCircle className="w-20 h-20 text-white" />
              </div>
              <div className="relative z-10 text-center max-w-4xl mx-auto">
                <p className="text-xl sm:text-2xl md:text-3xl text-white font-medium italic mb-6 leading-relaxed">
                  "Student success is my greatest achievement. When my students excel,
                  I know my teaching has made a difference."
                </p>
                <p className="text-white text-lg font-semibold">— Mr. Maleesha Wickramasinghe</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section with Full Background */}
      <section className="relative py-20 md:py-28 overflow-hidden pt-16 md:pt-52">
        {/* Full Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-top"
          style={{
            backgroundImage: 'url(/SL_071219_21480_25.jpg)',
            backgroundAttachment: 'fixed',
          }}
        >
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          {/* Testimonials Heading */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
              Student <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Testimonials</span>
            </h2>
            <p className="text-white text-lg font-semibold drop-shadow-md">Hear from our successful students</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Dinuka Perera',
                year: 'A/L Year: 2022',
                text: 'Chemistry subject එකට මම හැමදාම බයයි. සංකීර්ණ problems, හැබැයි Sir දෙන simple tricks, real-life examples, ඒ vibe ඒකෙන් තමයි මම විශ්වාසයක් develop කරගත්තේ. 1st shy එකේ essay ප්‍රශ්න 2ක්වත් හරියට කලේ නෑ. අද essay ප්‍රශ්න 5ක් කලා. මට ගොඩාක් සතුටුයි.මන් ගිය පාරට වඩා මෙවර විභාගය හොඳට කලා.සර්ට ගොඩාක් පින්...',
                image: null
              },
              {
                name: 'Deshani Fernando',
                year: 'A/L Year: 2023',
                text: 'මන් A/L 3rd shy එකටත් attempt එකක් දුන්නේ හොදටම බයවෙලා. පස්සේ සර්ගේ වීඩියෝ, zoom sessions, revision notes ඒවාට මුල් තැන දීලා confidence එක build up කරගත්තා. physics විතරක් නෙමේ, ජීවිතේ ගොඩ යන්නත් motivation එක ලැබුණේ සර්ගෙන්. මම ඉහළින් ම විභාගය pass උනා. සර්ට ගොඩාක් ස්තූතියි ..',
                image: null
              },
              {
                name: 'Malith Fernando',
                year: 'A/L Year: 2024',
                text: 'මම කිසිදා හිතුවේ නෑ Chemistry කියන subject එක මම pass වෙයි කියලා. But Sir simple example වලින් කියන විදියෙන් ඒ අමාරු chapters මතක තියාගන්න මට ලේසි වුණා. සමහර වෙලාවට හිතුනා මම Fail කියලා, හැබැයි Sir කියන එකම වචනේ "Fail වෙලා ඇති. ඒත් දැන් stop වෙන එක නෙමෙයි. ගේම ගහපන්." ඒකයි මට ජීවිතේ බලය දුන්නේ.Sir, you\'re not just a teacher you\'re a true mentor and guide.',
                image: null
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="rounded-3xl bg-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2 overflow-hidden relative"
                style={{
                  boxShadow: '0 2px 6px -1px rgba(0, 0, 0, 0.16), 0 1px 4px -1px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div className="p-8">
                  <div className="flex justify-end mb-4">
                    <div className="text-7xl text-cyan-500 opacity-20 leading-none font-serif">"</div>
                  </div>
                  <p
                    className="text-gray-700 mb-6 leading-relaxed text-base"
                    style={{
                      fontFamily: "'Noto Sans Sinhala', sans-serif",
                      lineHeight: '1.8'
                    }}
                  >
                    {testimonial.text}
                  </p>
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className="w-5 h-5 fill-cyan-500 text-cyan-500" />
                    ))}
                  </div>
                </div>
                <div className="border-t border-gray-100 px-8 py-6 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">{testimonial.year}</p>
                    <p className="font-bold text-gray-900 text-xl">{testimonial.name}</p>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg ring-4 ring-white">
                    <FiUser className="w-8 h-8 text-white" aria-hidden="true" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default ResultsSection
