import { Link } from 'react-router-dom'
import { FiArrowRight, FiPhone } from 'react-icons/fi'
import { useEffect, useRef } from 'react'
import TypingText from './TypingText'

const HeroSection = ({ heroRef, heroInView }) => {
  const parallaxBgRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!parallaxBgRef.current) return;
      
      const scrolled = window.pageYOffset;
      const offset = scrolled * 0.5;
      
      parallaxBgRef.current.style.transform = `translateY(${offset}px)`;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      id="home" 
      ref={heroRef} 
      className="relative min-h-screen flex items-center pt-20 overflow-hidden"
    >
      {/* Parallax Background */}
      <div 
        ref={parallaxBgRef}
        className="absolute inset-0 w-full h-[120%] -top-[10%] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/3635048.jpg)'
        }}
      ></div>
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div className="text-center lg:text-left lg:pt-12">
            {/* Teacher Name with Animation */}
            <div className="py-4 mb-2" style={{ overflow: 'visible' }}>
              <h1 className="font-bold tracking-wide bg-gradient-to-r from-blue-500 via-white to-orange-500 bg-clip-text text-transparent" style={{ fontFamily: "'UN-Gurulugomi', sans-serif", fontSize: 'clamp(2.5rem, 8vw, 6rem)', lineHeight: '1.5', overflow: 'visible', display: 'block', paddingTop: '0.5rem', paddingBottom: '0.5rem', whiteSpace: 'nowrap' }}>
                <TypingText 
                  text="මලීෂ වික්‍රමසිංහ"
                  speed={80} 
                  highlightWords={[]}
                  start={heroInView}
                />
              </h1>
            </div>

            {/* Headline with Typing Animation */}
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white leading-tight mb-8" style={{ maxWidth: '700px' }}>
              <TypingText 
                text="Expert guidance for Grades 6–11 Science and A/L Chemistry, ensuring deep concept clarity and outstanding results." 
                speed={80} 
                highlightWords={['concept clarity', 'outstanding results']}
                start={heroInView}
              />
            </h2>

            {/* Subheadline */}
            <p className="text-2xl md:text-3xl lg:text-4xl text-orange-400 max-w-2xl mx-auto lg:mx-0 mt-8 mb-10 font-bold" style={{ fontFamily: "'Gemunu Libre', sans-serif" }}>
              නින්දෙදී දකින සිහන නුදුරේම සැබෑ වන්නට<br/>මං මාවත් සොයා සැරි සරන වර්තමානයක...
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 hover:shadow-xl transition-all"
              >
                Join Now
                <FiArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-white border-2 border-white rounded-xl hover:bg-white hover:text-blue-600 transition-all"
              >
                <FiPhone className="w-5 h-5" />
                Contact Sir
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="hidden lg:flex items-start justify-center lg:-mt-8">
            <img 
              src="/sirnew.png" 
              alt="Mr. Maleesha Wickramasinghe" 
              className="w-full max-w-xl transform hover:scale-105 transition-transform duration-500"
              style={{ 
                mixBlendMode: 'darken',
                filter: 'contrast(1.1) brightness(1.05)',
                backgroundColor: 'transparent'
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
