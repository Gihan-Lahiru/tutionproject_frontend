import { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import Input from '../../components/UI/Input'
import Button from '../../components/UI/Button'
import Card from '../../components/UI/Card'
import { toast } from 'react-toastify'

export default function Login() {
  const navigate = useNavigate()
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
      // Error already handled by AuthContext
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Tuition Sir</h2>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} autoComplete="off">
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="student@example.com"
              autoComplete="off"
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              autoComplete="new-password"
            />

            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary font-medium hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
