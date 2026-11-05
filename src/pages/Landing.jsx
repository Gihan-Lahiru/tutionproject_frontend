import Navbar from '../components/Layout/Navbar'
import Footer from '../components/Layout/Footer'
import HeroSection from '../components/Landing/HeroSection'
import StatsSection from '../components/Landing/StatsSection'
import AboutSection from '../components/Landing/AboutSection'
import ScrollingBanners from '../components/Landing/ScrollingBanners'
import FeaturesSection from '../components/Landing/FeaturesSection'
import ResultsSection from '../components/Landing/ResultsSection'

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1">
        <HeroSection />
        <ScrollingBanners />
        <StatsSection />
        <AboutSection />
        <FeaturesSection />
        <ResultsSection />
      </main>

      <Footer />
    </div>
  )
}
