import { useState, useEffect, useRef } from 'react'
import Navbar from '../components/Layout/Navbar'
import Footer from '../components/Layout/Footer'
import HeroSection from '../components/Landing/HeroSection'
import StatsSection from '../components/Landing/StatsSection'
import AboutSection from '../components/Landing/AboutSection'
import ScrollingBanners from '../components/Landing/ScrollingBanners'
import FeaturesSection from '../components/Landing/FeaturesSection'
import ResultsSection from '../components/Landing/ResultsSection'

export default function Landing() {
  const [heroInView, setHeroInView] = useState(false)
  const [parallaxOffset, setParallaxOffset] = useState(0)
  const heroRef = useRef(null)
  const featuresRef = useRef(null)

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => setHeroInView(entry.isIntersecting),
      { threshold: 0.3 }
    )
    if (heroRef.current) observer.observe(heroRef.current)
    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current)
    }
  }, [])

  // Parallax effect for features text
  useEffect(() => {
    const handleScroll = () => {
      if (featuresRef.current) {
        const rect = featuresRef.current.getBoundingClientRect()
        const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
        const offset = scrollPercent * 50 - 25 // Range from -25 to 25
        setParallaxOffset(offset)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <HeroSection heroRef={heroRef} heroInView={heroInView} />
      <StatsSection />
      <AboutSection />
      <ScrollingBanners />
      <FeaturesSection featuresRef={featuresRef} parallaxOffset={parallaxOffset} />
      <ResultsSection />

      <Footer />
    </div>
  )
}

