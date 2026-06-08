import { useState } from 'react'
import { FiMessageCircle, FiPhone, FiMail, FiMapPin, FiSend, FiFacebook, FiYoutube } from 'react-icons/fi'

const ContactSection = () => {
  const [contactForm, setContactForm] = useState({ name: '', phone: '', message: '' })

  const handleContactSubmit = (e) => {
    e.preventDefault()
    console.log(contactForm)
    alert('Message sent successfully!')
    setContactForm({ name: '', phone: '', message: '' })
  }

  const contactInfo = [
    { icon: FiPhone, title: 'Phone', value: '+94 77 123 4567', link: 'tel:+94771234567' },
    { icon: FiMail, title: 'Email', value: 'tuitionsir@email.com', link: 'mailto:tuitionsir@email.com' },
    { icon: FiMapPin, title: 'Location', value: 'Colombo, Sri Lanka', link: '#' },
  ]

  const socials = [
    { icon: FiFacebook, label: 'Facebook' },
    { icon: FiMessageCircle, label: 'WhatsApp' },
    { icon: FiYoutube, label: 'YouTube' },
  ]

  return (
    <section id="contact" className="py-20 md:py-28 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 border border-blue-200 mb-6">
            <FiMessageCircle className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Get in Touch</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Start{' '}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Learning?
            </span>
          </h2>
          <p className="text-gray-600 text-lg">
            Contact us today to join our classes or get more information
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <div className="space-y-6 mb-10">
              {contactInfo.map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  className="flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-200 shadow-md hover:shadow-lg transition-all hover:-translate-y-1 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shrink-0 group-hover:shadow-xl transition-shadow">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{item.title}</p>
                    <p className="text-lg font-medium text-gray-900">{item.value}</p>
                  </div>
                </a>
              ))}
            </div>

            <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-md">
              <h4 className="font-semibold text-gray-900 mb-4">Follow Us</h4>
              <div className="flex gap-3">
                {socials.map((social, index) => (
                  <a
                    key={index}
                    href="#"
                    className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gradient-to-br hover:from-blue-600 hover:to-cyan-500 hover:text-white transition-all"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-gray-200 shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Send a Message</h3>
            <form onSubmit={handleContactSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Message
                </label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all resize-none"
                  placeholder="Your message..."
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl hover:shadow-xl transition-all"
              >
                <FiSend className="w-5 h-5" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
