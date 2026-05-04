import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { AuthContext } from '../../contexts/AuthContext'
import Input from '../../components/UI/Input'
import Button from '../../components/UI/Button'
import Card from '../../components/UI/Card'
import { toast } from 'react-toastify'

export default function Register() {
  const navigate = useNavigate()
  const { setAuthSession } = useContext(AuthContext)
  const [step, setStep] = useState(1) // 1: Email, 2: Verify Code, 3: Complete Registration
  const [email, setEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', ''])
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    grade: '',
    phone: '',
    institute: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // Step 1: Send verification code to email
  const handleSendCode = async (e) => {
    e.preventDefault()
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/auth/send-verification', { email })
      toast.success(response.data.message)
      
      // Show code in development
      if (response.data.verificationCode) {
        toast.info(`Code: ${response.data.verificationCode}`, { autoClose: false })
      }
      
      setStep(2)
    } catch (error) {
      console.error('Send code error:', error)
      const apiMessage = error.response?.data?.message || 'Failed to send verification code'

      if (
        error.response?.status === 500 &&
        String(apiMessage).toLowerCase().includes('not configured')
      ) {
        toast.error('Email service is not configured. Please ask admin to set backend EMAIL_USER and EMAIL_PASSWORD.')
      } else {
        toast.error(apiMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Verify the code
  const handleVerifyCode = async (e) => {
    e.preventDefault()
    
    const code = verificationCode.join('')
    if (code.length !== 6) {
      toast.error('Please enter the complete 6-digit code')
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/auth/verify-code', { email, code })
      toast.success(response.data.message)
      setStep(3)
    } catch (error) {
      console.error('Verification error:', error)
      toast.error(error.response?.data?.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  // Step 3: Complete registration
  const handleRegister = async (e) => {
    e.preventDefault()
    
    // Validation
    const newErrors = {}
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      const userData = {
        ...formData,
        email
      }
      delete userData.confirmPassword
      
      const response = await api.post('/auth/register', userData)
      
      toast.success(response.data.message)

      setAuthSession(response.data.token, response.data.user, {
        rememberMe: false,
        redirect: true,
      })
    } catch (error) {
      console.error('Registration error:', error)
      toast.error(error.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleCodeInput = (index, value) => {
    if (value && !/^\d$/.test(value)) return

    const newCode = [...verificationCode]
    newCode[index] = value
    setVerificationCode(newCode)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  const handleCodeKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  const handleCodePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim()
    
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split('')
      setVerificationCode(newCode)
      const lastInput = document.getElementById('code-5')
      if (lastInput) lastInput.focus()
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Join Our Classes</h2>
          <p className="mt-2 text-gray-600">
            {step === 1 && 'Enter your email to get started'}
            {step === 2 && 'Verify your email address'}
            {step === 3 && 'Complete your registration'}
          </p>
        </div>

        <Card>
          {/* Step 1: Email Input */}
          {step === 1 && (
            <form onSubmit={handleSendCode}>
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="student@example.com"
              />

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Sending Code...' : 'Send Verification Code'}
              </Button>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary font-medium hover:underline">
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          )}

          {/* Step 2: Verification Code */}
          {step === 2 && (
            <form onSubmit={handleVerifyCode}>
              <div className="mb-6">
                <label className="block text-center text-gray-700 font-medium mb-4">
                  Enter 6-Digit Code sent to<br />
                  <span className="text-blue-600">{email}</span>
                </label>
                <div className="flex gap-2 justify-center" onPaste={handleCodePaste}>
                  {verificationCode.map((digit, index) => (
                    <input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleCodeInput(index, e.target.value)}
                      onKeyDown={(e) => handleCodeKeyDown(index, e)}
                      className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      autoComplete="off"
                    />
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading || verificationCode.some(d => !d)}
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </Button>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={handleSendCode}
                  className="text-sm text-blue-600 hover:underline"
                  disabled={loading}
                >
                  Resend Code
                </button>
              </div>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm text-gray-600 hover:underline"
                >
                  Change Email
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Complete Registration */}
          {step === 3 && (
            <form onSubmit={handleRegister}>
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700 text-center">
                  ✓ Email verified: {email}
                </p>
              </div>

              <Input
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
              />

              <Input
                label="Contact Number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="07XXXXXXXX"
              />

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Institute <span className="text-red-500">*</span>
                </label>
                <select
                  name="institute"
                  value={formData.institute}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select your institute</option>
                  <option value="Prebhashi">Prebhashi</option>
                  <option value="Focus">Focus</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Grade <span className="text-red-500">*</span>
                </label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select your grade</option>
                  <option value="Grade 6">Grade 6</option>
                  <option value="Grade 7">Grade 7</option>
                  <option value="Grade 8">Grade 8</option>
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 11">Grade 11</option>
                  <option value="A/L">A/L Class</option>
                </select>
              </div>

              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
                placeholder="At least 6 characters"
              />

              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                required
                placeholder="Re-enter password"
              />

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Complete Registration'}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  )
}
