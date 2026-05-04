import { Link } from 'react-router-dom';
import { FiFacebook, FiMessageCircle, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">MW</span>
              </div>
              <div>
                <span className="font-bold text-lg">Maleesha Wickramasinghe</span>
                <span className="block text-xs text-gray-400 -mt-1">Tuition Classes</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Excellence in O/L Science & A/L Biology and Chemistry education. Building bright futures since years.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link to="/" onClick={scrollToTop} className="hover:text-blue-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" onClick={scrollToTop} className="hover:text-blue-400 transition-colors">About</Link>
              </li>
              <li>
                <Link to="/features" onClick={scrollToTop} className="hover:text-blue-400 transition-colors">Features & Classes</Link>
              </li>
              <li>
                <Link to="/contact" onClick={scrollToTop} className="hover:text-blue-400 transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Subjects */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Subjects</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>O/L Science</li>
              <li>A/L Chemistry</li>
              <li>Physical Classes</li>
              <li>Online Classes</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-start gap-2">
                <FiPhone className="w-4 h-4 mt-0.5 shrink-0" />
                <span>+94 71 439 0924</span>
              </li>
              <li className="flex items-start gap-2">
                <FiMail className="w-4 h-4 mt-0.5 shrink-0" />
                <a
                  href="mailto:maleeshaw004@gmail.com"
                  className="hover:text-blue-400 transition-colors"
                >
                  maleeshaw004@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <FiMapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Wellawaya Town</span>
              </li>
            </ul>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <FiFacebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <FiMessageCircle className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <FiYoutube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>© 2024 Maleesha Wickramasinghe Tuition Classes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
