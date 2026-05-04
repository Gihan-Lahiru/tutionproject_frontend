import { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { toast } from 'react-toastify'

export const AuthContext = createContext()

const TOKEN_KEY = 'token'
const AUTH_STORAGE_KEY = 'auth_storage'
const LEGACY_USER_KEY = 'user'

const clearStoredAuth = () => {
  localStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(AUTH_STORAGE_KEY)
  localStorage.removeItem(LEGACY_USER_KEY)
  sessionStorage.removeItem(LEGACY_USER_KEY)
}

const getStoredToken = () => {
  const preferredStorage = localStorage.getItem(AUTH_STORAGE_KEY)

  if (preferredStorage === 'session') {
    return sessionStorage.getItem(TOKEN_KEY)
  }

  if (preferredStorage === 'local') {
    return localStorage.getItem(TOKEN_KEY)
  }

  // Backward compatibility for old sessions where storage type was not saved.
  return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY)
}

const saveToken = (token, rememberMe) => {
  if (rememberMe) {
    localStorage.setItem(TOKEN_KEY, token)
    sessionStorage.removeItem(TOKEN_KEY)
    localStorage.setItem(AUTH_STORAGE_KEY, 'local')
    return
  }

  sessionStorage.setItem(TOKEN_KEY, token)
  localStorage.removeItem(TOKEN_KEY)
  localStorage.setItem(AUTH_STORAGE_KEY, 'session')
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Check for existing token on mount
  useEffect(() => {
    const token = getStoredToken()
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchCurrentUser()
    } else {
      clearStoredAuth()
      setLoading(false)
    }
  }, [])

  const setAuthSession = (token, userData, options = {}) => {
    const { rememberMe = false, redirect = true } = options

    saveToken(token, rememberMe)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(userData)

    if (redirect) {
      if (userData.role === 'teacher' || userData.role === 'admin') {
        navigate('/teacher/dashboard')
      } else {
        navigate('/student/dashboard')
      }
    }
  }

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get('/auth/me')
      setUser(response.data.user)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      // Clear invalid token
      clearStoredAuth()
      delete api.defaults.headers.common['Authorization']
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password, options = {}) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { token, user } = response.data

      setAuthSession(token, user, {
        rememberMe: options.rememberMe === true,
        redirect: true,
      })

      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      // Throw error so Login component can catch it and check for requiresVerification
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData)
      navigate('/login')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const logout = () => {
    clearStoredAuth()
    delete api.defaults.headers.common['Authorization']
    setUser(null)
    navigate('/', { replace: true })
  }

  const value = {
    user,
    setUser,
    setAuthSession,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
