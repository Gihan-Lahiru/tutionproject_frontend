import { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend, FiMessageSquare, FiClock } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';

export default function Contact() {
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
    const message = `Hello Sir! I'm ${formData.name}.\n\nGrade: ${formData.grade || 'Not specified'}\n\nMessage: ${formData.message}\n\nContact Details:\nEmail: ${formData.email || 'N/A'}\nPhone: ${formData.phone}`;
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
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <Navbar />

      {/* Header - Dark Theme matching Home & About */}
      <section className="relative pt-32 pb-20 md:pb-24 bg-slate-950 border-b border-slate-800/80 overflow-hidden text-white">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[320px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[320px] h-[220px] bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[280px] h-[200px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/25 text-blue-300 text-xs sm:text-sm font-semibold mb-5 backdrop-blur-md">
            <FiMessageSquare className="w-4 h-4 text-blue-400" />
            <span>Support & Inquiries</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-5 leading-tight">
            Get in <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">Touch</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Have questions about class schedules, syllabus coverage, or registration? Reach out directly and we will assist you promptly.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 md:py-20 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Column: Contact Cards (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Direct Contact Channels</h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Connect via WhatsApp for the fastest reply, or visit during class hours at our physical institute branches.
                </p>
              </div>

              {/* Phone & WhatsApp Card */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <FaWhatsapp className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-base mb-1">Phone & WhatsApp</h3>
                  <a
                    href="https://wa.me/94714390924"
                    target="_blank"
                    rel="noreferrer"
                    className="text-base sm:text-lg font-semibold text-emerald-600 hover:underline inline-block"
                  >
                    +94 71 439 0924
                  </a>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <FiClock className="w-3.5 h-3.5" /> Mon – Sat: 9:00 AM – 6:00 PM
                  </p>
                </div>
              </div>

              {/* Institute Locations */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                  <FiMapPin className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-base mb-2">Physical Institutes</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="font-semibold text-slate-800">Prebhashi</span>
                      <span className="text-xs px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 font-medium border border-amber-200">
                        Hettipola
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="font-semibold text-slate-800">Focus</span>
                      <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
                        Hadungamuwa
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                  <FiMail className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-base mb-1">Email Inquiries</h3>
                  <a
                    href="mailto:maleeshaw004@gmail.com"
                    className="text-sm sm:text-base font-semibold text-blue-600 hover:underline break-all"
                  >
                    maleeshaw004@gmail.com
                  </a>
                  <p className="text-xs text-slate-500 mt-1">Typical response within 24 hours</p>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 md:p-10 shadow-sm">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Send an Inquiry</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Fill in your details and click send — your inquiry will be prepared directly for WhatsApp.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Your Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                      placeholder="e.g. Kasun Perera"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                      placeholder="07X XXX XXXX"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Email Address <span className="text-slate-400 font-normal lowercase">(optional)</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                      placeholder="name@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="grade" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Grade / Subject <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="grade"
                      name="grade"
                      required
                      value={formData.grade}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                    >
                      <option value="" disabled>Select Grade</option>
                      <option value="Grade 6 Science">Grade 6 Science</option>
                      <option value="Grade 7 Science">Grade 7 Science</option>
                      <option value="Grade 8 Science">Grade 8 Science</option>
                      <option value="Grade 9 Science">Grade 9 Science</option>
                      <option value="Grade 10 O/L Science">Grade 10 O/L Science</option>
                      <option value="Grade 11 O/L Science">Grade 11 O/L Science</option>
                      <option value="A/L Chemistry">A/L Chemistry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Your Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all resize-none"
                    placeholder="Tell us what you'd like to ask or inquire about..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all cursor-pointer"
                >
                  <FiSend className="w-4 h-4" />
                  <span>Send Message via WhatsApp</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
