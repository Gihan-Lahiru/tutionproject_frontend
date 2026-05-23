import { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import Input from '../../components/UI/Input'
import Button from '../../components/UI/Button'
import Card from '../../components/UI/Card'
import { toast } from 'react-toastify'

import authBg from '../../assets/auth_bg.png'

export default function Login() {
  const { login } = useContext(AuthContext)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)

  // Clear form when component mounts (including when navigating back)
  useEffect(() => {
    setFormData({
      email: '',
      password: '',
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await login(formData.email, formData.password, { rememberMe })
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      if (message.toLowerCase().includes('verify')) {
        toast.error('Please wait until sir confirms your account.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={authBg} 
            alt="EduTeach Background" 
            className="w-full h-full object-cover opacity-90 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent"></div>
        </div>
        <div className="relative z-10 p-12 text-white max-w-xl text-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/30 shadow-2xl">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight leading-tight">
            Welcome back to EduTeach
          </h1>
          <p className="text-lg lg:text-xl text-blue-100/90 leading-relaxed font-light">
            Empowering your learning journey with premium educational tools and expert guidance.
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 xl:p-24 relative">
        <div className="absolute inset-0 lg:hidden z-0">
           <img src={authBg} alt="" className="w-full h-full object-cover opacity-10" />
           <div className="absolute inset-0 bg-white/90 backdrop-blur-sm"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Sign in</h2>
            <p className="mt-3 text-gray-500 text-sm sm:text-base">Enter your details to access your account</p>
          </div>

          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-6">
            <div className="space-y-1">
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="student@example.com"
                autoComplete="off"
                className="bg-gray-50/50"
              />
            </div>

            <div className="space-y-1">
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                autoComplete="new-password"
                className="bg-gray-50/50"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <div className="w-5 h-5 border-2 border-gray-300 rounded overflow-hidden peer-checked:bg-primary peer-checked:border-primary transition-all duration-200 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white scale-0 peer-checked:scale-100 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full py-3.5 text-base font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-200"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
