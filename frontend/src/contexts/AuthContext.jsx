import { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { toast } from 'react-toastify'

export const AuthContext = createContext()

const TOKEN_KEY = 'token'
const AUTH_STORAGE_KEY = 'auth_storage'
const LEGACY_USER_KEY = 'user'
const BACKEND_ORIGIN = import.meta.env.VITE_BACKEND_ORIGIN || 'http://localhost:5000'

const clearStoredAuth = () => {
  try {
    localStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(AUTH_STORAGE_KEY)
    localStorage.removeItem(LEGACY_USER_KEY)
    sessionStorage.removeItem(LEGACY_USER_KEY)
  } catch (e) {
    // ignore storage access errors in restricted browser contexts
  }
}

const getStoredToken = () => {
  try {
    const preferredStorage = localStorage.getItem(AUTH_STORAGE_KEY)

    if (preferredStorage === 'session') {
      return sessionStorage.getItem(TOKEN_KEY)
    }

    if (preferredStorage === 'local') {
      return localStorage.getItem(TOKEN_KEY)
    }

    // Backward compatibility for old sessions where storage type was not saved.
    return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY)
  } catch (e) {
    return null
  }
}

const saveToken = (token, rememberMe) => {
  try {
    if (rememberMe) {
      localStorage.setItem(TOKEN_KEY, token)
      sessionStorage.removeItem(TOKEN_KEY)
      localStorage.setItem(AUTH_STORAGE_KEY, 'local')
      return
    }

    sessionStorage.setItem(TOKEN_KEY, token)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.setItem(AUTH_STORAGE_KEY, 'session')
  } catch (e) {
    // Proceed without throwing so login flow can continue in restrictive environments
  }
}

const normalizeUser = (userData) => {
  if (!userData) return null

  const rawPicture = userData.profile_picture || userData.profilePicture || null
  let profilePicture = rawPicture ? String(rawPicture).trim().replace(/\\/g, '/') : null

  if (profilePicture && !profilePicture.startsWith('http://') && !profilePicture.startsWith('https://') && !profilePicture.startsWith('data:')) {
    profilePicture = profilePicture.startsWith('/')
      ? `${BACKEND_ORIGIN}${profilePicture}`
      : `${BACKEND_ORIGIN}/${profilePicture}`
  }

  return {
    ...userData,
    profile_picture: profilePicture,
    profilePicture: profilePicture,
  }
}

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const setUser = (nextUser) => {
    if (typeof nextUser === 'function') {
      setUserState((prevUser) => normalizeUser(nextUser(prevUser)))
      return
    }
    setUserState(normalizeUser(nextUser))
  }

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
    console.log('[Auth] setAuthSession token:', token)
    console.log('[Auth] setAuthSession user:', userData)
    setUser(normalizeUser(userData))

    if (redirect) {
      const destination = (userData.role === 'teacher' || userData.role === 'admin') ? '/teacher/dashboard' : '/student/dashboard'
      console.log('[Auth] redirecting to', destination)
      // Ensure loading is false so ProtectedRoute doesn't show spinner
      setLoading(false)
      try {
        navigate(destination, { replace: true })
      } catch (e) {
        console.warn('SPA navigate failed, falling back to full reload:', e)
        try {
          window.location.replace(destination)
        } catch (err) {
          console.error('Failed to force navigation:', err)
        }
      }
    }
  }

  const fetchCurrentUser = async () => {
    try {
      console.log('[Auth] fetchCurrentUser - Authorization header:', api.defaults.headers.common['Authorization'])
      const response = await api.get('/users/profile')
      console.log('[Auth] fetchCurrentUser response:', response.data)
      const nextUser = normalizeUser(response.data?.user || response.data)
      setUser(nextUser)
      return nextUser
    } catch (profileError) {
      console.warn('Failed to fetch /users/profile, trying /auth/me fallback:', profileError)
      // Backward compatibility fallback for older backend versions.
      try {
        const response = await api.get('/auth/me')
        console.log('[Auth] fetchCurrentUser fallback response:', response.data)
        const nextUser = normalizeUser(response.data?.user || response.data)
        setUser(nextUser)
        return nextUser
      } catch (error) {
        console.error('Failed to fetch user:', error)
        // Clear invalid token
        clearStoredAuth()
        delete api.defaults.headers.common['Authorization']
        setUser(null)
        return null
      }
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password, options = {}) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      console.log('[Auth] login response:', response.data)
      const { token, user } = response.data

      setAuthSession(token, user, {
        rememberMe: options.rememberMe === true,
        redirect: false,
      })

      const hydratedUser = await fetchCurrentUser()
      const activeUser = hydratedUser || normalizeUser(user)
      setUser(activeUser)

      const destination = (activeUser?.role === 'teacher' || activeUser?.role === 'admin') ? '/teacher/dashboard' : '/student/dashboard'
      console.log('[Auth] redirecting to', destination)
      navigate(destination, { replace: true })

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
