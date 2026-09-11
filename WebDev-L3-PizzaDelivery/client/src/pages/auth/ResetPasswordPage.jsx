// ResetPasswordPage.jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { resetPassword } from '../../features/authService';

function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = new URLSearchParams(location.search).get('token');
    if (!token) {
      setError('This reset link is invalid or expired.');
      toast.error('This reset link is invalid or expired.');
      return;
    }
    if (formData.password.length < 8 || !/[A-Za-z]/.test(formData.password) || !/\d/.test(formData.password)) {
      setError('Use at least 8 characters with letters and numbers.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const data = await resetPassword(token, formData.password);
      setSubmitted(true);
      toast.success(data.message || 'Password reset successfully.');
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to reset password. Please request a new link.';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div
        className="relative mt-[68px] flex min-h-[calc(100svh-68px)] items-center justify-center overflow-x-hidden px-4 py-6 sm:mt-[72px] sm:min-h-[calc(100svh-72px)] sm:py-8"
        style={{
          background: `
            radial-gradient(ellipse 600px 400px at 70% 20%, rgba(227,162,59,0.06), transparent 50%),
            radial-gradient(ellipse 400px 300px at 20% 80%, rgba(193,68,45,0.04), transparent 50%),
            #FAF6EF
          `,
        }}
      >
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-[#F0E9DD] bg-white p-6 shadow-xl sm:p-10">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#E8641F]/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-[#E8641F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold text-[#1a1a1a]">Password Reset!</h2>
            <p className="text-sm text-[#4a4a4a] leading-relaxed">
              Your password has been successfully reset. You can now log in with your new credentials.
            </p>
            <Link
              to="/login"
              className="inline-block w-full py-4 text-center rounded-full text-white shadow-lg transition transform hover:scale-[1.02] active:scale-[0.99]"
              style={{
                background: 'linear-gradient(90deg, #F0631E 0%, #F7A11E 100%)',
                boxShadow: '0 10px 22px rgba(240, 99, 30, 0.4)',
              }}
            >
              <div className="leading-tight">
                <div className="text-[15px] font-extrabold tracking-wide">LOG IN</div>
                <div className="text-[10px] font-semibold tracking-wider opacity-90 mt-0.5">
                  ACCESS ACCOUNT
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative mt-[68px] flex min-h-[calc(100svh-68px)] items-center justify-center overflow-x-hidden px-4 py-6 sm:mt-[72px] sm:min-h-[calc(100svh-72px)] sm:py-8"
      style={{
        background: `
          radial-gradient(ellipse 600px 400px at 70% 20%, rgba(227,162,59,0.06), transparent 50%),
          radial-gradient(ellipse 400px 300px at 20% 80%, rgba(193,68,45,0.04), transparent 50%),
          #FAF6EF
        `,
      }}
    >
      {/* Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-[#F0E9DD] bg-white p-6 shadow-xl sm:p-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 gap-3">
          <div className="min-w-0">
            <h1 className="text-[24px] font-extrabold leading-none tracking-tight text-[#1a1a1a] sm:text-[26px]">RESET</h1>
            <p className="text-[13px] font-bold text-[#4a4a4a] mt-1.5 tracking-wide whitespace-nowrap">NEW PASSWORD</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-[#4a4a4a] mb-6 leading-relaxed">
          Create a new password for your account. Make sure it's at least 8 characters long.
        </p>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Password */}
          <div>
            <label className="block text-xs font-bold tracking-widest text-[#9a9a9a] mb-2 uppercase">
              New Password
            </label>
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-5 py-3 rounded-full border-2 border-[#E8641F] bg-white text-[#1a1a1a] placeholder-[#b0b0b0] focus:outline-none focus:ring-2 focus:ring-[#E8641F]/30 transition"
              placeholder="••••••••"
            />
            <div className="mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="h-4 w-4 accent-[#E8641F] focus:ring-2 focus:ring-[#E8641F]/40 focus:outline-none rounded"
              />
              <span className="text-sm text-[#1a1a1a]">Show Password</span>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold tracking-widest text-[#9a9a9a] mb-2 uppercase">
              Confirm Password
            </label>
            <input
              name="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              required
              minLength={8}
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-5 py-3 rounded-full border-2 border-[#E8641F] bg-white text-[#1a1a1a] placeholder-[#b0b0b0] focus:outline-none focus:ring-2 focus:ring-[#E8641F]/30 transition"
              placeholder="••••••••"
            />
            <div className="mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                checked={showConfirm}
                onChange={() => setShowConfirm(!showConfirm)}
                className="h-4 w-4 accent-[#E8641F] focus:ring-2 focus:ring-[#E8641F]/40 focus:outline-none rounded"
              />
              <span className="text-sm text-[#1a1a1a]">Show Password</span>
            </div>
          </div>

          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="mt-1">
              <div className="h-1 w-full bg-[#f0e9dd] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min((formData.password.length / 8) * 100, 100)}%`,
                    background: formData.password.length < 6
                      ? '#f87171'
                      : formData.password.length < 8
                      ? '#fbbf24'
                      : '#34d399',
                  }}
                />
              </div>
              <p className="text-xs text-[#9a9a9a] mt-1">
                {formData.password.length < 6
                  ? 'Weak — add more characters'
                  : formData.password.length < 8
                  ? 'Almost there — 8+ characters recommended'
                  : 'Strong password'}
              </p>
            </div>
          )}

          {error && <p className="text-center text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 cursor-pointer rounded-full text-white shadow-lg transition transform hover:scale-[1.02] active:scale-[0.99] disabled:opacity-70"
            style={{
              background: 'linear-gradient(90deg, #F0631E 0%, #F7A11E 100%)',
              boxShadow: '0 10px 22px rgba(240, 99, 30, 0.4)',
            }}
          >
            {isLoading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : <div className="leading-tight">
              <div className="text-[15px] font-extrabold tracking-wide">RESET</div>
              <div className="text-[10px] font-semibold tracking-wider opacity-90 mt-0.5">
                SET NEW PASSWORD
              </div>
            </div>}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-[#4a4a4a] mt-6">
          Remember your password?{' '}
          <Link to="/login" className="font-bold text-[#E8641F] hover:text-[#c94a1f]">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPasswordPage;