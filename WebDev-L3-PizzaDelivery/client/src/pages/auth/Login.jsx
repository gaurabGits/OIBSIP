import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';

const MIN_AUTH_LOADING_MS = 500;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const successMessage = location.state?.message;

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage, { id: 'auth-success-message' });
    }
  }, [successMessage]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.emailOrPhone)) {
      newErrors.emailOrPhone = 'Enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await Promise.all([
        login({
          email: formData.emailOrPhone.trim().toLowerCase(),
          password: formData.password,
        }),
        wait(MIN_AUTH_LOADING_MS),
      ]);

      toast.success('Logged in successfully');

      const redirectTo = location.state?.from?.pathname || '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed. Please try again.';

      if (err.response?.status === 403 && message === 'Please verify your email before logging in') {
        const email = formData.emailOrPhone.trim().toLowerCase();
        localStorage.setItem('pendingVerificationEmail', email);
        toast(message, { icon: '✉️' });
        navigate('/verify-email', { replace: true, state: { email } });
        return;
      }

      setErrors({
        form: message,
      });
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative flex min-h-svh w-full items-center justify-center overflow-x-hidden px-4 pt-[92px] pb-6 sm:pt-[96px] sm:pb-8"
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
            <h1 className="text-[24px] font-extrabold leading-none tracking-tight text-[#1a1a1a] sm:text-[26px]">LOG IN</h1>
            <p className="text-[13px] font-bold text-[#4a4a4a] mt-1.5 tracking-wide whitespace-nowrap">WELCOME BACK!</p>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-3" onSubmit={handleSubmit} noValidate>
          <div>
            <label className="block text-xs font-bold tracking-widest text-[#9a9a9a] mb-1.5 uppercase">
              Email
            </label>
            <input
              name="emailOrPhone"
              type="text"
              value={formData.emailOrPhone}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full px-5 py-3 rounded-full border-2 bg-white text-[#1a1a1a] placeholder-[#b0b0b0] focus:outline-none focus:ring-2 transition disabled:opacity-60 disabled:cursor-not-allowed ${
                errors.emailOrPhone
                  ? 'border-red-500 focus:ring-red-500/30'
                  : 'border-[#E8641F] focus:ring-[#E8641F]/30'
              }`}
              placeholder="splicehouse@example.com"
            />
            <p className="text-xs text-red-500 h-4 mt-1 px-2 leading-4">
              {errors.emailOrPhone}
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
            <div className="mt-1 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={show}
                  onChange={() => setShow(!show)}
                  disabled={isLoading}
                  className="h-4 w-4 accent-[#E8641F] focus:ring-2 focus:ring-[#E8641F]/40 focus:outline-none rounded"
                />
                <span className="text-sm text-[#1a1a1a]">Show Password</span>
              </label>
              <Link to="/login/forgot-password" className="text-sm font-bold text-[#E8641F] hover:text-[#c94a1f]">
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-8 py-4 cursor-pointer rounded-full text-white shadow-lg transition transform hover:scale-[1.02] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
            style={{
              background: 'linear-gradient(90deg, #F0631E 0%, #F7A11E 100%)',
              boxShadow: '0 10px 22px rgba(240, 99, 30, 0.4)',
            }}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            ) : (
              <div className="leading-tight">
                <div className="text-[15px] font-extrabold tracking-wide">LOG IN</div>
                <div className="text-[10px] font-semibold tracking-wider opacity-90 mt-0.5">
                  ACCESS ACCOUNT
                </div>
              </div>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-[#4a4a4a] mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-[#E8641F] hover:text-[#c94a1f]">
            Sign Up
          </Link>
        </p>
        <Link
          to="/verify-email"
          className="mt-3 block text-center text-sm font-bold text-[#E8641F] hover:text-[#c94a1f]"
        >
          Need to verify your email?
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;
