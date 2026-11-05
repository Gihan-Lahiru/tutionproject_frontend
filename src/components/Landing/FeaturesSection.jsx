import { FiCalendar, FiBook, FiUsers, FiClock, FiMapPin } from 'react-icons/fi'

const FeaturesSection = ({ featuresRef }) => {
  return (
    <section 
      ref={featuresRef}
      id="features" 
      className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden bg-slate-900"
      style={{
        backgroundImage: 'url(/3626461.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark Vignette Overlay */}
      <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px]"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs sm:text-sm font-medium mb-4 backdrop-blur-sm">
            <FiCalendar className="w-4 h-4 text-blue-400" />
            <span>Class Details & Locations</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Flexible Learning <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Options</span>
          </h2>
          
          <p className="text-slate-300 text-base md:text-lg">
            Choose the learning format that suits you best. Physical and interactive online classes designed for deep understanding.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Left Side - Class Info Cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: FiBook, title: 'All Grades', value: 'Grade 6–11 O/L & A/L' },
              { icon: FiUsers, title: 'Small Batches', value: '15–20 Students' },
              { icon: FiClock, title: 'Flexible Times', value: 'Weekend & Evening' },
              { icon: FiMapPin, title: 'Modes', value: 'Physical & Online' },
            ].map((item, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 backdrop-blur-md shadow-lg hover:border-slate-500 transition-all hover:-translate-y-1"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-3 shadow-md">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-xs uppercase tracking-wider text-slate-400 mb-1 font-semibold">{item.title}</h4>
                <p className="text-base sm:text-lg font-bold text-white">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Right Side - Class Institutes */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 backdrop-blur-md shadow-lg hover:border-slate-500 transition-all overflow-hidden group">
              <div className="h-40 bg-slate-800 relative overflow-hidden">
                <img
                  src="/3635048.jpg"
                  alt="Prebhashi Hettipola"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              </div>
              <div className="p-5 text-center">
                <h4 className="text-xl font-bold text-white mb-0.5">Prebhashi</h4>
                <p className="text-amber-400 text-sm font-semibold">Hettipola</p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 backdrop-blur-md shadow-lg hover:border-slate-500 transition-all overflow-hidden group">
              <div className="h-40 bg-slate-800 relative overflow-hidden">
                <img
                  src="/3626461.jpg"
                  alt="Focus Hadungamuwa"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              </div>
              <div className="p-5 text-center">
                <h4 className="text-xl font-bold text-white mb-0.5">Focus</h4>
                <p className="text-emerald-400 text-sm font-semibold">Hadungamuwa</p>
              </div>
            </div>
          </div>
        </div>

        {/* Flyers Gallery */}
        <div className="mt-8 pt-12 border-t border-slate-800">
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Smart Learning, Flexible Schedules
            </h3>
            <p className="text-slate-400 text-sm sm:text-base">Browse the latest class announcements and flyer schedules</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { src: '/WhatsApp Image 2025-12-14 at 14.44.12_e003f416.jpg', alt: 'Class Flyer 1' },
              { src: '/WhatsApp Image 2025-12-14 at 14.44.27_7465fffd.jpg', alt: 'Class Flyer 2' },
              { src: '/WhatsApp Image 2025-12-14 at 14.44.28_114ebcb5.jpg', alt: 'Class Flyer 3' },
              { src: '/WhatsApp Image 2025-12-14 at 14.44.48_832ab7f1.jpg', alt: 'Class Flyer 4' },
            ].map((flyer, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-slate-800 border border-slate-700/80 shadow-xl hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1.5"
              >
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img 
                    src={flyer.src} 
                    alt={flyer.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    style={{ objectPosition: 'center' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-xs font-semibold text-white bg-blue-600/90 px-3 py-1.5 rounded-lg shadow">
                      View Timetable
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
