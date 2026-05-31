import { useContext, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import { toast } from 'react-toastify'
import PaymentOverdue from '../Student/PaymentOverdue'

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useContext(AuthContext)
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    // Dispatch an event to show the login modal by triggering the event listener in AuthModalContext
    window.dispatchEvent(new Event('auth:unauthorized'));
    return <Navigate to="/" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  // Prevent pending students from accessing protected routes
  if (user.role === 'student' && user.approvalStatus === 'pending') {
    // We cannot call toast directly in render, so we'll dispatch the event to auth which clears out and we can just use a timeout or useEffect pattern.
    // Instead of complex hooks, just scheduling it macrotask works fine for React router Redirects
    setTimeout(() => {
      window.dispatchEvent(new Event('auth:unauthorized'));
      toast.info('Your account is pending approval.');
    }, 0);
    return <Navigate to="/" replace />
  }

  // Handle Payment Block for Students
  if (user.role === 'student' && user.dashboardAccess === false) {
    return <PaymentOverdue user={user} />
  }

  return children
}
