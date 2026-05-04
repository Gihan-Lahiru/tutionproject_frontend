import axios from 'axios'

const TOKEN_KEY = 'token'
const AUTH_STORAGE_KEY = 'auth_storage'
const LEGACY_USER_KEY = 'user'

const getStoredToken = () => {
  const preferredStorage = localStorage.getItem(AUTH_STORAGE_KEY)

  if (preferredStorage === 'session') {
    return sessionStorage.getItem(TOKEN_KEY)
  }

  if (preferredStorage === 'local') {
    return localStorage.getItem(TOKEN_KEY)
  }

  return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY)
}

const clearStoredAuth = () => {
  localStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(AUTH_STORAGE_KEY)
  localStorage.removeItem(LEGACY_USER_KEY)
  sessionStorage.removeItem(LEGACY_USER_KEY)
}

const resolveBaseUrl = () => {
  // In dev, always use Vite proxy to avoid mismatched/stale env values
  if (import.meta.env.DEV) return '/api'
  return import.meta.env.VITE_API_URL || '/api'
}

const api = axios.create({
  baseURL: resolveBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
})

if (import.meta.env.DEV) {
  // Helpful when debugging proxy/baseURL issues
  console.log('[api] baseURL:', api.defaults.baseURL)
}

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearStoredAuth()
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
