import { useNavigate } from 'react-router-dom'
import { FiArrowRight, FiPhone, FiCheckCircle } from 'react-icons/fi'
import { useAuthModal } from '../../contexts/AuthModalContext'

const HeroSection = ({ heroRef }) => {
  const { openRegister } = useAuthModal();
  const navigate = useNavigate();

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-[92vh] flex items-center pt-24 pb-16 overflow-hidden bg-slate-950"
    >
      {/* Background Image with Dark Vignette Overlay */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-40 mix-blend-luminosity scale-105 transition-transform duration-1000"
        style={{ backgroundImage: 'url(/3635048.jpg)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/60" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Content (7 cols) */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs sm:text-sm font-medium mb-5 backdrop-blur-sm shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              Expert Science & Chemistry Guidance
            </div>

            {/* Teacher Name */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-sky-200 to-amber-300 bg-clip-text text-transparent">
                Maleesha Wickramasinghe
              </span>
            </h1>

            {/* Main Headline */}
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-medium text-slate-200 leading-snug mb-5 max-w-2xl">
              Targeted education for <span className="text-white font-semibold underline decoration-blue-400 decoration-2 underline-offset-4">Grades 6–11 Science</span> and <span className="text-white font-semibold underline decoration-amber-400 decoration-2 underline-offset-4">A/L Chemistry</span>, built on deep conceptual clarity.
            </h2>

            {/* Sinhala Quote */}
            <p
              className="text-base sm:text-lg md:text-xl text-amber-300/95 max-w-xl mx-auto lg:mx-0 mb-8 font-medium leading-relaxed drop-shadow"
              style={{ fontFamily: "'Gemunu Libre', sans-serif" }}
            >
              නින්දෙදී දකින සිහින නුදුරේම සැබෑ වන්නට<br />මං මාවත් සොයා සැරි සරන වර්තමානයක...
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
              <button
                onClick={() => openRegister()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                Join Now
                <FiArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-slate-200 bg-slate-900/80 border border-slate-700/80 rounded-xl hover:bg-slate-800 hover:text-white hover:border-slate-600 transition-all cursor-pointer backdrop-blur-sm"
              >
                <FiPhone className="w-4 h-4 text-blue-400" />
                Contact Sir
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-400 pt-2 border-t border-slate-800/80">
              <span className="flex items-center gap-1.5">
                <FiCheckCircle className="w-4 h-4 text-emerald-400" /> 95%+ Pass Rate
              </span>
              <span className="flex items-center gap-1.5">
                <FiCheckCircle className="w-4 h-4 text-emerald-400" /> Physical & Online Classes
              </span>
              <span className="flex items-center gap-1.5">
                <FiCheckCircle className="w-4 h-4 text-emerald-400" /> Proven Track Record
              </span>
            </div>
          </div>

          {/* Right Image (5 cols) */}
          <div className="lg:col-span-5 hidden lg:flex items-center justify-center relative">
            <div className="relative w-full max-w-md">
              {/* Back ambient card */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 via-indigo-500/20 to-transparent rounded-3xl blur-2xl transform -rotate-3 scale-95" />
              <img
                src="/sirnew.png"
                alt="Maleesha Wickramasinghe"
                className="relative z-10 w-full drop-shadow-2xl transform hover:scale-102 transition-transform duration-500"
                style={{
                  filter: 'contrast(1.05) brightness(1.02)'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
