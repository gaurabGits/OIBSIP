// ForgotPasswordPage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

function ForgotPasswordPage() {
  const [formData, setFormData] = useState({
    email: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Forgot Password Submitted:', formData);
    setSubmitted(true);
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:py-12"
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
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold tracking-widest text-[#9a9a9a] mb-2 uppercase">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-full border-2 border-[#E8641F] bg-white text-[#1a1a1a] placeholder-[#b0b0b0] focus:outline-none focus:ring-2 focus:ring-[#E8641F]/30 transition"
                placeholder="splicehouse@example.com"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 cursor-pointer rounded-full text-white shadow-lg transition transform hover:scale-[1.02] active:scale-[0.99]"
              style={{
                background: 'linear-gradient(90deg, #F0631E 0%, #F7A11E 100%)',
                boxShadow: '0 10px 22px rgba(240, 99, 30, 0.4)',
              }}
            >
              <div className="leading-tight">
                <div className="text-[15px] font-extrabold tracking-wide">SEND</div>
                <div className="text-[10px] font-semibold tracking-wider opacity-90 mt-0.5">
                  RESET LINK
                </div>
              </div>
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
              onClick={() => setSubmitted(false)}
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