import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiArrowUp, FiChevronRight, FiCheckCircle } from 'react-icons/fi';
import { FaFacebookF, FaWhatsapp, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gradient-to-b from-slate-900 via-slate-950 to-black text-slate-300 border-t border-slate-800 overflow-hidden">
      {/* Subtle Ambient Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Pre-Footer Action Banner */}
      <div className="relative border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900/60 border border-blue-500/20 p-6 sm:p-8 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Admissions Open for All Grades
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Ready to excel in Science & Chemistry?
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                Join physical or interactive online batches with Mr. Maleesha Wickramasinghe.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <a
                href="https://wa.me/94714390924?text=Hello%20Sir%2C%20I%20would%20like%20to%20inquire%20about%20joining%20classes."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow-lg shadow-emerald-600/25 transition-all hover:-translate-y-0.5"
              >
                <FaWhatsapp className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
              <Link
                to="/contact"
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-sm font-semibold transition-all hover:-translate-y-0.5"
              >
                <span>Contact Details</span>
                <FiChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links Grid */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12">
          
          {/* Brand & Bio (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" onClick={scrollToTop} className="inline-flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
                <span className="text-white font-black text-lg tracking-wider">MW</span>
              </div>
              <div>
                <span className="font-extrabold text-lg text-white block tracking-tight group-hover:text-blue-400 transition-colors">
                  Maleesha Wickramasinghe
                </span>
                <span className="block text-xs text-blue-400/90 font-medium">Science & Chemistry Education</span>
              </div>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed">
              Empowering students across Sri Lanka with deep conceptual clarity, structured paper practice, and top examination results in O/L Science and A/L Chemistry.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.facebook.com/maleesha.wickramasinghs"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#1877F2] hover:border-[#1877F2] shadow-sm transition-all hover:-translate-y-1"
              >
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/94714390924"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#25D366] hover:border-[#25D366] shadow-sm transition-all hover:-translate-y-1"
              >
                <FaWhatsapp className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#FF0000] hover:border-[#FF0000] shadow-sm transition-all hover:-translate-y-1"
              >
                <FaYoutube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4 border-l-2 border-blue-500 pl-2">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Home', to: '/' },
                { label: 'About Teacher', to: '/about' },
                { label: 'Features & Classes', to: '/features' },
                { label: 'Contact Inquiries', to: '/contact' },
              ].map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.to}
                    onClick={scrollToTop}
                    className="flex items-center gap-1.5 text-slate-400 hover:text-white hover:translate-x-1 transition-all"
                  >
                    <FiChevronRight className="w-3.5 h-3.5 text-blue-400" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs Covered (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4 border-l-2 border-indigo-500 pl-2">
              Academic Programs
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <FiCheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Grades 6–9 Junior Science</span>
              </li>
              <li className="flex items-center gap-2">
                <FiCheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Grades 10–11 O/L Science</span>
              </li>
              <li className="flex items-center gap-2">
                <FiCheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>A/L Chemistry (Theory & Revision)</span>
              </li>
              <li className="flex items-center gap-2">
                <FiCheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Physical Classes (Hettipola / Hadungamuwa)</span>
              </li>
              <li className="flex items-center gap-2">
                <FiCheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Online Live & Recording Access</span>
              </li>
            </ul>
          </div>

          {/* Contact Details & Locations (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2">
              Get in Touch
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <FiPhone className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
                <div>
                  <a href="tel:+94714390924" className="text-white hover:text-blue-400 font-semibold transition-colors">
                    +94 71 439 0924
                  </a>
                  <p className="text-xs text-slate-500">Call & WhatsApp Hotline</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FiMail className="w-4 h-4 text-blue-400 mt-1 shrink-0" />
                <div>
                  <a href="mailto:maleeshaw004@gmail.com" className="text-white hover:text-blue-400 transition-colors break-all">
                    maleeshaw004@gmail.com
                  </a>
                  <p className="text-xs text-slate-500">Official Correspondence</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FiMapPin className="w-4 h-4 text-amber-400 mt-1 shrink-0" />
                <div>
                  <p className="text-white font-medium">Prebhashi (Hettipola)</p>
                  <p className="text-white font-medium">Focus (Hadungamuwa)</p>
                  <p className="text-xs text-slate-500">Headquartered in Wellawaya</p>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Maleesha Wickramasinghe Tuition Classes. All rights reserved.</p>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-all cursor-pointer"
          >
            <span>Back to Top</span>
            <FiArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
