import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiCheckCircle, FiXCircle } from 'react-icons/fi'

export default function PaymentStatus({ status }) {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/student/payments')
    }, 4000)
    return () => clearTimeout(timer)
  }, [navigate])

  const isSuccess = status === 'success'

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
      <div className={`w-24 h-24 rounded-full flex items-center justify-center ${isSuccess ? 'bg-green-100' : 'bg-red-100'}`}>
        {isSuccess
          ? <FiCheckCircle className="w-12 h-12 text-green-600" />
          : <FiXCircle className="w-12 h-12 text-red-500" />
        }
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          {isSuccess ? 'Payment Successful!' : 'Payment Cancelled'}
        </h2>
        <p className="text-gray-600 mt-2">
          {isSuccess
            ? 'Your payment has been processed successfully.'
            : 'Your payment was cancelled. No charges were made.'}
        </p>
        <p className="text-sm text-gray-400 mt-3">Redirecting you back to payments...</p>
      </div>
    </div>
  )
}
