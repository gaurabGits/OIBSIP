// ForgotPasswordPage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { forgotPassword } from '../../features/authService';

function ForgotPasswordPage() {
  const [formData, setFormData] = useState({
    email: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const data = await forgotPassword(formData.email.trim().toLowerCase());
      setSubmitted(true);
      toast.success(data.message || 'Reset link sent. Check your inbox.');
    } catch (err) {
      const message = err.response?.data?.message || 'Something went wrong. Please try again.';
      setErrors({ form: message });
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

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
            <h1 className="text-[24px] font-extrabold leading-none tracking-tight text-[#1a1a1a] sm:text-[26px]">FORGOT</h1>
            <p className="text-[13px] font-bold text-[#4a4a4a] mt-1.5 tracking-wide whitespace-nowrap">RESET PASSWORD</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-[#4a4a4a] mb-6 leading-relaxed">
          Enter the email address associated with your account and we'll send you a link to reset your password.
        </p>

        {!submitted ? (
          /* Form */
          <form className="space-y-3" onSubmit={handleSubmit} noValidate>
            <div>
              <label className="block text-xs font-bold tracking-widest text-[#9a9a9a] mb-1.5 uppercase">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full px-5 py-3 rounded-full border-2 bg-white text-[#1a1a1a] placeholder-[#b0b0b0] focus:outline-none focus:ring-2 transition disabled:opacity-60 disabled:cursor-not-allowed ${
                  errors.email
                    ? 'border-red-500 focus:ring-red-500/30'
                    : 'border-[#E8641F] focus:ring-[#E8641F]/30'
                }`}
                placeholder="splicehouse@example.com"
              />
              <p className="text-xs text-red-500 h-4 mt-1 px-2 leading-4">
                {errors.email}
              </p>
            </div>

            {errors.form && (
              <p className="text-xs text-red-500 text-center">{errors.form}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-1 py-4 cursor-pointer rounded-full text-white shadow-lg transition transform hover:scale-[1.02] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
              style={{
                background: 'linear-gradient(90deg, #F0631E 0%, #F7A11E 100%)',
                boxShadow: '0 10px 22px rgba(240, 99, 30, 0.4)',
              }}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-white" />
              ) : (
                <div className="leading-tight">
                  <div className="text-[15px] font-extrabold tracking-wide">SEND</div>
                  <div className="text-[10px] font-semibold tracking-wider opacity-90 mt-0.5">
                    RESET LINK
                  </div>
                </div>
              )}
            </button>
          </form>
        ) : (
          /* Success Message */
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#E8641F]/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-[#E8641F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm text-[#4a4a4a] leading-relaxed">
              If an account exists for{' '}
              <span className="font-semibold text-[#1a1a1a]">{formData.email}</span>,
              you'll receive a password reset link shortly.
            </p>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setErrors({});
              }}
              className="text-sm font-semibold text-[#E8641F] hover:text-[#c94a1f] transition"
            >
              Try another email
            </button>
          </div>
        )}

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

export default ForgotPasswordPage;