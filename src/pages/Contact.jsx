import { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    grade: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Create WhatsApp message with form data
    const message = `Hello! I'm ${formData.name}.\n\nGrade: ${formData.grade}\n\nMessage: ${formData.message}\n\nContact Details:\nEmail: ${formData.email}\nPhone: ${formData.phone}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/94714390924?text=${encodedMessage}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Hero Section */}
      <section className="pt-32 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              <span className="hollow-to-color">Get in Touch</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-2">
              Have questions? We're here to help. Reach out to us and we'll get back to you as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="pt-8 pb-20 md:pt-12 md:pb-28">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Contact{' '}
                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Information
                </span>
              </h2>
              
              <p className="text-gray-600 text-lg mb-4 leading-relaxed">
                Feel free to reach out through any of the following methods. We're always happy to discuss how we can help you achieve your academic goals.
              </p>

              <div className="space-y-6">
                <div className="group flex items-start gap-4 p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-200 hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 group-hover:rotate-360 transition-all duration-700">
                    <FiPhone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Phone & WhatsApp</h4>
                    <p className="text-gray-800">+94 71 439 0924</p>
                    <p className="text-sm text-gray-600 mt-1">Available Mon-Sat, 9AM-6PM</p>
                  </div>
                </div>

                <div className="group flex items-start gap-4 p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-200 hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 group-hover:rotate-360 transition-all duration-700">
                    <FiMapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-3">Institute Locations</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-gray-900 font-medium">Prebhashi - Hettipola</p>
                        
                      </div>
                      <div className="pt-2">
                        <p className="text-gray-900 font-medium">Focus - Hadungamuwa</p>
                       
                      </div>
                    </div>
                  </div>
                </div>

                <div className="group flex items-start gap-4 p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-200 hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 group-hover:rotate-360 transition-all duration-700">
                    <FiMail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                    <p className="text-gray-800">maleeshaw004@gmail.com</p>
                    <p className="text-sm text-gray-600 mt-1">We'll respond within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl shadow-2xl p-8 border-2 border-white hover:scale-105 transition-all duration-300">
              <h3 className="text-2xl font-bold text-white mb-6 drop-shadow-lg">Send us a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white/90 mb-2 drop-shadow-sm">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-white/50 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/60 focus:ring-2 focus:ring-white focus:border-white transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2 drop-shadow-sm">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-white/50 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/60 focus:ring-2 focus:ring-white focus:border-white transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-white/90 mb-2 drop-shadow-sm">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-white/50 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/60 focus:ring-2 focus:ring-white focus:border-white transition-all"
                    placeholder="+94 XX XXX XXXX"
                  />
                </div>

                <div>
                  <label htmlFor="grade" className="block text-sm font-medium text-white/90 mb-2 drop-shadow-sm">
                    Grade *
                  </label>
                  <select
                    id="grade"
                    name="grade"
                    required
                    value={formData.grade}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-white/50 rounded-lg bg-white/20 backdrop-blur-sm text-white focus:ring-2 focus:ring-white focus:border-white transition-all"
                  >
                    <option value="" disabled className="bg-gray-800">Select Grade</option>
                    <option value="Grade 6" className="bg-gray-800">Grade 6</option>
                    <option value="Grade 7" className="bg-gray-800">Grade 7</option>
                    <option value="Grade 8" className="bg-gray-800">Grade 8</option>
                    <option value="Grade 9" className="bg-gray-800">Grade 9</option>
                    <option value="Grade 10" className="bg-gray-800">Grade 10</option>
                    <option value="Grade 11" className="bg-gray-800">Grade 11</option>
                    <option value="A/L" className="bg-gray-800">A/L</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-white/90 mb-2 drop-shadow-sm">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-white/50 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/60 focus:ring-2 focus:ring-white focus:border-white transition-all resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white text-blue-600 font-bold rounded-lg hover:shadow-2xl transition-all transform hover:scale-105 hover:bg-cyan-50 hover:text-blue-700"
                >
                  <FiSend className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
