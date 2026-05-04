import { FiCalendar, FiBook, FiUsers, FiClock, FiMapPin } from 'react-icons/fi'

const FeaturesSection = ({ featuresRef, parallaxOffset }) => {
  return (
    <section 
      ref={featuresRef}
      id="features" 
      className="relative pt-16 pb-20 md:pt-20 md:pb-28 overflow-hidden"
      style={{
        backgroundImage: 'url(/3626461.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      <div 
        className="relative z-10 max-w-7xl mx-auto px-4"
        style={{
          transform: `translateY(${parallaxOffset}px)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-white/50 mb-6">
          <FiCalendar className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-600">Class Details</span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
          Flexible Learning{' '}
          <span className="text-orange-400 font-extrabold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
            Options
          </span>
        </h2>
        
        <p className="text-white text-lg mb-8 font-medium" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
          Choose the learning format that works best for you. Physical and online 
          classes available with flexible scheduling.
        </p>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Class Info Cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: FiBook, title: 'All Grades', value: 'Grade 6-11 O/L & A/L' },
              { icon: FiUsers, title: 'Small Batches', value: '15-20 Students' },
              { icon: FiClock, title: 'Flexible Times', value: 'Weekend & Evening' },
              { icon: FiMapPin, title: 'Location', value: 'Physical & Online' },
            ].map((item, index) => (
              <div
                key={index}
                className="p-5 rounded-xl bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-3 rotate-icon">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-sm text-gray-700 mb-1 font-semibold">{item.title}</h4>
                <p className="text-lg font-bold text-gray-900">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Right Side - Class Institutes */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all overflow-hidden">
              <div className="h-40 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <img src="/3635048.jpg" alt="Prebhashi Hettipola" className="w-full h-full object-cover" onError={(e) => {e.target.style.display='none'; e.target.nextSibling.style.display='flex'}} />
                <div className="hidden w-full h-full items-center justify-center">
                  <FiMapPin className="w-16 h-16 text-white" />
                </div>
              </div>
              <div className="p-5 text-center">
                <h4 className="text-3xl font-extrabold text-gray-900 mb-1 uppercase">Prebhashi</h4>
                <p className="text-gray-700 text-base font-medium">Hettipola</p>
              </div>
            </div>

            <div className="rounded-xl bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all overflow-hidden">
              <div className="h-40 bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <img src="/3626461.jpg" alt="Focus Hadungamuwa" className="w-full h-full object-cover" onError={(e) => {e.target.style.display='none'; e.target.nextSibling.style.display='flex'}} />
                <div className="hidden w-full h-full items-center justify-center">
                  <FiMapPin className="w-16 h-16 text-white" />
                </div>
              </div>
              <div className="p-5 text-center">
                <h4 className="text-3xl font-extrabold text-gray-900 mb-1 uppercase">Focus</h4>
                <p className="text-gray-700 text-base font-medium">Hadungamuwa</p>
              </div>
            </div>
          </div>
        </div>

        {/* Flyers Gallery */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-white font-extrabold" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.8)' }}>
                Smart Learning, Flexible Timing
              </span>
            </h3>
            <p className="text-white text-xl font-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>Choose the class schedule that works best for you</p>
          </div>
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
      </div>
    </section>
  )
}

export default FeaturesSection
