import axios from 'axios'

const TOKEN_KEY = 'token'
const AUTH_STORAGE_KEY = 'auth_storage'
const LEGACY_USER_KEY = 'user'

const getStoredToken = () => {
  try {
    const preferredStorage = localStorage.getItem(AUTH_STORAGE_KEY)

    if (preferredStorage === 'session') {
      return sessionStorage.getItem(TOKEN_KEY)
    }

    if (preferredStorage === 'local') {
      return localStorage.getItem(TOKEN_KEY)
    }

    return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY)
  } catch (e) {
    return null
  }
}

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
    const isPublicAuthRoute = String(config.url || '').startsWith('/auth/')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      if (import.meta.env.DEV) {
        console.log('[api] attaching Authorization header:', config.headers.Authorization)
      }
    } else {
      if (import.meta.env.DEV && !isPublicAuthRoute) {
        console.log('[api] no token found for request to', config.url)
      }
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
      // Log details for debugging instead of immediately redirecting.
      console.warn('[api] 401 response:', error.response && error.response.data)
      // During debugging do NOT clear stored auth here so we can inspect Authorization headers.
      // NOTE: We intentionally DO NOT redirect here during debugging; remove this change after fixing the root cause.
    }
    return Promise.reject(error)
  }
)

export default api
