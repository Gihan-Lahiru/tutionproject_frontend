import { FiAward, FiClock, FiMessageCircle, FiStar, FiTrendingUp, FiUsers, FiUser } from 'react-icons/fi'

const ResultsSection = () => {
  return (
    <>
      <section id="results" className="relative pt-16 pb-28 md:pt-20 md:pb-36 overflow-hidden bg-slate-900">
        {/* Background image with overlay */}
        <div
          className="absolute inset-0 bg-cover bg-top bg-no-repeat opacity-25"
          style={{
            backgroundImage: 'url(/future-visions-business-technology-concept.jpg)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/90 to-slate-950" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs sm:text-sm font-medium mb-4 backdrop-blur-sm">
              <FiAward className="w-4 h-4 text-blue-400" />
              <span>Results & Milestones</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
              Proven Track Record of <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">Excellence</span>
            </h2>
            <p className="text-slate-300 text-base md:text-lg">
              Our students consistently achieve stellar results through deep conceptual teaching and structured exam guidance.
            </p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
            {[
              { value: '95%', label: 'Pass Rate', description: 'Consistently high pass rates', icon: FiTrendingUp, color: 'from-emerald-500 to-teal-600', textGradient: 'from-emerald-400 to-teal-300' },
              { value: '100+', label: 'A Passes', description: 'Students achieving A grades', icon: FiAward, color: 'from-amber-500 to-orange-600', textGradient: 'from-amber-400 to-orange-300' },
              { value: '500+', label: 'Students', description: 'Successfully guided', icon: FiUsers, color: 'from-blue-500 to-indigo-600', textGradient: 'from-blue-400 to-indigo-300' },
              { value: '5+', label: 'Years', description: 'Teaching excellence', icon: FiClock, color: 'from-purple-500 to-pink-600', textGradient: 'from-purple-400 to-pink-300' },
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <div
                  key={index}
                  className="group relative p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 backdrop-blur-md shadow-lg hover:border-slate-500 transition-all duration-300 hover:-translate-y-1.5 text-center"
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} mb-3 shadow-md group-hover:scale-105 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r ${item.textGradient} bg-clip-text text-transparent mb-1`}>
                    {item.value}
                  </div>
                  <div className="font-bold text-white mb-1 text-sm sm:text-base tracking-wide uppercase">{item.label}</div>
                  <div className="text-xs text-slate-400 leading-relaxed">{item.description}</div>
                </div>
              )
            })}
          </div>

          {/* Quote Card */}
          <div className="relative p-8 md:p-12 rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900/60 border border-blue-500/20 backdrop-blur-md shadow-2xl text-center max-w-4xl mx-auto">
            <FiMessageCircle className="w-16 h-16 text-blue-500/20 absolute -top-2 -left-2" />
            <p className="relative z-10 text-lg sm:text-2xl text-slate-100 font-medium italic mb-4 leading-relaxed">
              "Student success is my greatest achievement. When my students excel with genuine conceptual clarity, I know our hard work was truly meaningful."
            </p>
            <p className="relative z-10 text-blue-400 font-semibold tracking-wide uppercase text-sm sm:text-base">
              — Mr. Maleesha Wickramasinghe
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-20 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
              Student <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Testimonials</span>
            </h2>
            <p className="text-slate-400 text-base">Hear directly from students who transformed their performance</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Dinuka Perera',
                year: 'A/L Year: 2022',
                text: 'Chemistry subject එකට මම හැමදාම බයයි. සංකීර්ණ problems, හැබැයි Sir දෙන simple tricks, real-life examples, ඒ vibe ඒකෙන් තමයි මම විශ්වාසයක් develop කරගත්තේ. 1st shy එකේ essay ප්‍රශ්න 2ක්වත් හරියට කලේ නෑ. අද essay ප්‍රශ්න 5ක් කලා. මට ගොඩාක් සතුටුයි.මන් ගිය පාරට වඩා මෙවර විභාගය හොඳට කලා.සර්ට ගොඩාක් පින්...',
              },
              {
                name: 'Deshani Fernando',
                year: 'A/L Year: 2023',
                text: 'මන් A/L 3rd shy එකටත් attempt එකක් දුන්නේ හොදටම බයවෙලා. පස්සේ සර්ගේ වීඩියෝ, zoom sessions, revision notes ඒවාට මුල් තැන දීලා confidence එක build up කරගත්තා. chemistry විතරක් නෙමේ, ජීවිතේ ගොඩ යන්නත් motivation එක ලැබුණේ සර්ගෙන්. මම ඉහළින් ම විභාගය pass උනා. සර්ට ගොඩාක් ස්තූතියි ..',
              },
              {
                name: 'Malith Fernando',
                year: 'A/L Year: 2024',
                text: 'මම කිසිදා හිතුවේ නෑ Chemistry කියන subject එක මම pass වෙයි කියලා. But Sir simple example වලින් කියන විදියෙන් ඒ අමාරු chapters මතක තියාගන්න මට ලේසි වුණා. සමහර වෙලාවට හිතුනා මම Fail කියලා, හැබැයි Sir කියන එකම වචනේ "Fail වෙලා ඇති. ඒත් දැන් stop වෙන එක නෙමෙයි. ගේම ගහපන්." ඒකයි මට ජීවිතේ බලය දුන්නේ.Sir, you\'re not just a teacher you\'re a true mentor and guide.',
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="flex flex-col justify-between rounded-2xl bg-slate-900/90 border border-slate-800 p-6 md:p-7 shadow-lg hover:border-slate-700 transition-all hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center gap-1 mb-4 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p
                    className="text-slate-300 mb-6 leading-relaxed text-sm sm:text-base font-normal"
                    style={{ lineHeight: '1.75' }}
                  >
                    "{testimonial.text}"
                  </p>
                </div>
                <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white text-base">{testimonial.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{testimonial.year}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
                    <FiUser className="w-5 h-5 text-white" />
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
