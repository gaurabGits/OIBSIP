import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MoveLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';

const MIN_AUTH_LOADING_MS = 500;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function SignUpPage() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    acceptTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };
      delete nextErrors[e.target.name];
      return nextErrors;
    });
  };

  const handleBack = (e) => {
    e.preventDefault();
    setErrors({});
    setStep(1);
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Enter your full name';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^9\d{9}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Enter a valid 10-digit number';
    }
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = '*You must accept';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      newErrors.email = 'Enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Za-z]/.test(formData.password) || !/\d/.test(formData.password)) {
      newErrors.password = 'Use letters and numbers';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!validateStep1()) return;
    setErrors({});
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsLoading(true);
    try {
      await Promise.all([
        register({
          fname: formData.fullName.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
        wait(MIN_AUTH_LOADING_MS),
      ]);

      const email = formData.email.trim().toLowerCase();
      localStorage.setItem('pendingVerificationEmail', email);
      toast.success('Verification code sent. Check your email.');

      navigate('/verify-email', {
        replace: true,
        state: { email },
      });
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Sign up failed. Please try again.';

        setErrors({});
        toast.error(message, {
          duration: 5000,
          icon: '!',
        });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative flex min-h-svh w-full items-center justify-center overflow-x-hidden px-4 pt-23 pb-6 sm:pt-24 sm:pb-8"
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
        <div className="flex items-center justify-between mb-6 gap-3">
          <div className="min-w-0">
            <h1 className="text-[24px] font-extrabold leading-none tracking-tight text-[#1a1a1a] sm:text-[26px]">SIGN UP</h1>
            <p className="text-[13px] font-bold text-[#4a4a4a] mt-1.5 tracking-wide whitespace-nowrap">JOIN THE PARTY!</p>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-3" onSubmit={handleSubmit} noValidate>
          {step === 1 && (
            <>
              <div>
                <label className="block text-xs font-bold tracking-widest text-[#9a9a9a] mb-1.5 uppercase">
                  Full Name
                </label>
                <input
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full px-5 py-3 rounded-full border-2 bg-white text-[#1a1a1a] placeholder-[#b0b0b0] focus:outline-none focus:ring-2 transition ${
                    errors.fullName
                      ? 'border-red-500 focus:ring-red-500/30'
                      : 'border-[#E8641F] focus:ring-[#E8641F]/30'
                  }`}
                  placeholder="Gaurab Bishwarkarma"
                />
                <p className="text-xs text-red-500 h-4 mt-1 px-2 leading-4">
                  {errors.fullName}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest text-[#9a9a9a] mb-1.5 uppercase">
                  Phone Number
                </label>
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-5 py-3 rounded-full border-2 bg-white text-[#1a1a1a] placeholder-[#b0b0b0] focus:outline-none focus:ring-2 transition ${
                    errors.phone
                      ? 'border-red-500 focus:ring-red-500/30'
                      : 'border-[#E8641F] focus:ring-[#E8641F]/30'
                  }`}
                  placeholder="97XXXXXXXX"
                />
                <p className="text-xs text-red-500 h-4 mt-1 px-2 leading-4">
                  {errors.phone}
                </p>
              </div>

              <div className="flex -mt-1.5">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={(e) =>
                      setFormData({ ...formData, acceptTerms: e.target.checked })
                    }
                    disabled={isLoading}
                    className="mt-0.5 h-4 w-4 accent-[#E8641F] focus:ring-2 focus:ring-[#E8641F]/40 focus:outline-none rounded"
                  />
                  <span className="text-sm text-[#1a1a1a]">
                    I accept the{' '}
                    <Link to="/terms" className="font-bold text-[#E8641F] hover:text-[#c94a1f]">
                      Terms & Conditions
                    </Link>
                  </span>
                </label>
                <p className="text-xs text-red-500 h-4 mt-1 px-2 leading-4">
                  {errors.acceptTerms}
                </p>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="w-full mt-4 py-4 cursor-pointer rounded-full text-white shadow-lg transition transform hover:scale-[1.02] active:scale-[0.99]"
                style={{
                  background: 'linear-gradient(90deg, #F0631E 0%, #F7A11E 100%)',
                  boxShadow: '0 10px 22px rgba(240, 99, 30, 0.4)',
                }}
              >
                <div className="leading-tight">
                  <div className="text-[15px] font-extrabold tracking-wide">Click To Next</div>
                  <div className="text-[10px] font-semibold tracking-wider opacity-90 mt-0.5">
                    JOIN NOW
                  </div>
                </div>
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="block text-xs font-bold tracking-widest text-[#9a9a9a] mb-1.5 uppercase">
                  Email Address
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
              <div>
                <label className="block text-xs font-bold tracking-widest text-[#9a9a9a] mb-1.5 uppercase">
                  Password
                </label>
                <input
                  name="password"
                  type={show ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`w-full px-5 py-3 rounded-full border-2 bg-white text-[#1a1a1a] placeholder-[#b0b0b0] focus:outline-none focus:ring-2 transition disabled:opacity-60 disabled:cursor-not-allowed ${
                    errors.password
                      ? 'border-red-500 focus:ring-red-500/30'
                      : 'border-[#E8641F] focus:ring-[#E8641F]/30'
                  }`}
                  placeholder="Password"
                />
                <p className="text-xs text-red-500 h-4 mt-1 px-2 leading-4">
                  {errors.password}
                </p>

                <div className="mt-1.5 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={show}
                    onChange={() => setShow(!show)}
                    disabled={isLoading}
                    className="h-4 w-4 accent-[#E8641F] focus:ring-2 focus:ring-[#E8641F]/40 focus:outline-none rounded"
                  />
                  <span className="text-sm text-[#1a1a1a]">Show Password</span>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3 sm:gap-4">
                {/* Circle Back Button */}
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isLoading}
                  className="flex items-center justify-center py-4 px-4 rounded-full cursor-pointer bg-amber-300 shadow-md transition-transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{
                    background: 'linear-gradient(90deg, #F0631E 0%, #F7A11E 100%)',
                    boxShadow: '0 10px 22px rgba(240, 99, 30, 0.4)',
                  }}
                >
                  <MoveLeft className="text-[22px] font-extrabold text-white" />
                </button>

                {/* Create Account Button (85% width) */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-4 rounded-full cursor-pointer text-white shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(90deg, #F0631E 0%, #F7A11E 100%)',
                    boxShadow: '0 10px 22px rgba(240, 99, 30, 0.4)',
                    flexBasis: '85%',
                  }}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                  ) : (
                    <div className="leading-tight text-center">
                      <div className="text-[16px] font-extrabold tracking-wide">
                        CREATE ACCOUNT
                      </div>
                      <div className="text-[11px] font-semibold tracking-wider opacity-90 mt-0.5">
                        JOIN NOW
                      </div>
                    </div>
                  )}
                </button>
              </div>
            </>
          )}
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-[#4a4a4a] mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[#E8641F] hover:text-[#c94a1f]">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUpPage;
