import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Pages
import Landing from './pages/Landing'
import About from './pages/About'
import Features from './pages/Features'
import Classes from './pages/Classes'
import Results from './pages/Results'
import Contact from './pages/Contact'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import EmailVerification from './pages/auth/EmailVerification'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import PaymentCardVerify from './pages/PaymentCardVerify'
import TeacherDashboard from './pages/teacher/TeacherDashboard'
import StudentDashboard from './pages/student/Dashboard'
import ClassPage from './pages/class/ClassPage'
import GradeDetailPage from './pages/class/GradeDetailPage'

// Layout
import ProtectedRoute from './components/Layout/ProtectedRoute'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          draggable={false}
          closeOnClick
          pauseOnHover
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/results" element={<Results />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/payment-card/verify" element={<PaymentCardVerify />} />
          
          {/* Grade Detail Pages */}
          <Route path="/classes/:grade" element={<GradeDetailPage />} />

          {/* Protected Routes - Teacher */}
          <Route
            path="/teacher/*"
            element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Student */}
          <Route
            path="/student/*"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          {/* Class Page - Both Teacher & Student */}
          <Route
            path="/class/:id"
            element={
              <ProtectedRoute allowedRoles={['teacher', 'student', 'admin']}>
                <ClassPage />
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
