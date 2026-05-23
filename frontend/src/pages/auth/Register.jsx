import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import Input from '../../components/UI/Input'
import Button from '../../components/UI/Button'
import Card from '../../components/UI/Card'
import { toast } from 'react-toastify'

import authBg from '../../assets/auth_bg.png'

export default function Register() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    grade: '',
    institute: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    const newErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    if (!formData.grade) {
      newErrors.grade = 'Please select a grade'
    }
    if (!formData.institute) {
      newErrors.institute = 'Please select an institute'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    const pendingToastId = toast.loading('Creating account...')
    await new Promise((resolve) => window.requestAnimationFrame(resolve))

    try {
      const { confirmPassword, ...registrationData } = formData
      const userData = {
        ...registrationData,
        email,
      }
      
      await api.post('/auth/register', userData)

      toast.dismiss(pendingToastId)
      setSubmitted(true)
      toast.info('Registration submitted. Please wait until sir confirms your account.')
    } catch (error) {
      toast.dismiss(pendingToastId)
      console.error('Registration error:', error)
      toast.error(error.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
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
            Start Your Journey
          </h1>
          <p className="text-lg lg:text-xl text-blue-100/90 leading-relaxed font-light">
            Join thousands of students and get access to premium resources and personalized tuition.
          </p>
        </div>
      </div>

      {/* Right side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 relative">
        <div className="absolute inset-0 lg:hidden z-0">
           <img src={authBg} alt="" className="w-full h-full object-cover opacity-10" />
           <div className="absolute inset-0 bg-white/90 backdrop-blur-sm"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Create Account</h2>
            <p className="mt-3 text-gray-500 text-sm sm:text-base">
              {submitted ? 'Waiting for approval' : 'Join our classes today'}
            </p>
          </div>

          {submitted ? (
            <div className="py-8 text-center space-y-6">
              <div className="mx-auto w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center border-4 border-amber-100 shadow-inner">
                <svg className="w-10 h-10 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M4.93 19h14.14a2 2 0 001.73-3L14.73 5a2 2 0 00-3.46 0L3.2 16a2 2 0 001.73 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Request submitted</h3>
                <p className="mt-3 text-gray-600 leading-relaxed">
                  Please wait until sir confirms your account.
                </p>
                <p className="mt-2 text-sm text-gray-500 font-medium">
                  Once approved, you can sign in.
                </p>
              </div>
              <Button
                type="button"
                className="w-full py-3.5 text-base font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-200 mt-4"
                onClick={() => navigate('/login', { replace: true })}
              >
                Go to Login
              </Button>
            </div>
          ) : (
          <form onSubmit={handleRegister} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="student@example.com"
              className="bg-gray-50/50"
            />

            <Input
              label="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
              placeholder="John Doe"
              className="bg-gray-50/50"
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Grade <span className="text-red-500">*</span>
                </label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                  required
                >
                  <option value="">Select</option>
                  <option value="6">Grade 6</option>
                  <option value="7">Grade 7</option>
                  <option value="8">Grade 8</option>
                  <option value="9">Grade 9</option>
                  <option value="10">Grade 10</option>
                  <option value="11">Grade 11</option>
                  <option value="A/L">A/L Class</option>
                </select>
                {errors.grade && <p className="text-red-500 text-xs mt-1 font-medium">{errors.grade}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Institute <span className="text-red-500">*</span>
                </label>
                <select
                  name="institute"
                  value={formData.institute}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-sm"
                  required
                >
                  <option value="">Select</option>
                  <option value="Prebhashi Hettipola">Prebhashi</option>
                  <option value="Focus Hadungamuwa">Focus</option>
                </select>
                {errors.institute && <p className="text-red-500 text-xs mt-1 font-medium">{errors.institute}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
                placeholder="6+ chars"
                className="bg-gray-50/50"
              />

              <Input
                label="Confirm"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                required
                placeholder="Re-enter"
                className="bg-gray-50/50"
              />
            </div>

            <Button
              type="submit"
              className="w-full py-3.5 mt-2 text-base font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-200"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
          )}
        </div>
      </div>
    </div>
  )
}
