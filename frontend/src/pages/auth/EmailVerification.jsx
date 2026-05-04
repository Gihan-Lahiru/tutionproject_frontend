import { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../api/axios';
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';
import { toast } from 'react-toastify';

export default function EmailVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuthSession } = useContext(AuthContext);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Get email from navigation state or redirect to register
    const emailFromState = location.state?.email;
    if (!emailFromState) {
      toast.error('Please register first');
      navigate('/register');
      return;
    }
    setEmail(emailFromState);
  }, [location, navigate]);

  const handleInputChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    // Check if pasted data is 6 digits
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split('');
      setCode(newCode);
      
      // Focus last input
      const lastInput = document.getElementById('code-5');
      if (lastInput) lastInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    
    try {
      const response = await api.post('/auth/verify-email', {
        email,
        code: verificationCode,
      });

      toast.success(response.data.message);

      setAuthSession(response.data.token, response.data.user, {
        rememberMe: false,
        redirect: true,
      });
    } catch (error) {
      console.error('Verification error:', error);
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResending(true);
    
    try {
      const response = await api.post('/auth/resend-verification', { email });
      toast.success(response.data.message);
      setCode(['', '', '', '', '', '']); // Clear input
      const firstInput = document.getElementById('code-0');
      if (firstInput) firstInput.focus();
    } catch (error) {
      console.error('Resend error:', error);
      toast.error(error.response?.data?.message || 'Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Verify Your Email</h2>
          <p className="mt-2 text-gray-600">
            We've sent a 6-digit code to
          </p>
          <p className="font-semibold text-blue-600">{email}</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-center text-gray-700 font-medium mb-4">
                Enter Verification Code
              </label>
              <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    autoComplete="off"
                  />
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || code.some(d => !d)}
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">
              Didn't receive the code?
            </p>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resending}
              className="text-blue-600 font-medium hover:underline disabled:opacity-50"
            >
              {resending ? 'Sending...' : 'Resend Code'}
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700 text-center">
              <strong>Note:</strong> The code will expire in 10 minutes.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
