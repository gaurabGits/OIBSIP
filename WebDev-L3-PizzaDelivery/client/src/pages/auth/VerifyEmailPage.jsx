import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { resendVerificationEmail, verifyEmail } from '../../features/authService';
import useAuth from '../../hooks/useAuth';

const CODE_LENGTH = 6;

function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { completeVerification } = useAuth();
  const [email, setEmail] = useState(
    location.state?.email || localStorage.getItem('pendingVerificationEmail') || ''
  );
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (location.state?.email) {
      localStorage.setItem('pendingVerificationEmail', location.state.email);
    }
  }, [location.state?.email]);

  const handleCodeChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const nextCode = [...code];
    nextCode[index] = digit;
    setCode(nextCode);
    setError('');

    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pastedCode = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH);
    if (!pastedCode) return;

    setCode([...pastedCode.split(''), ...Array(CODE_LENGTH - pastedCode.length).fill('')]);
    inputRefs.current[Math.min(pastedCode.length, CODE_LENGTH) - 1]?.focus();
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const verificationCode = code.join('');

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Enter the email address used during registration.');
      return;
    }
    if (!/^\d{6}$/.test(verificationCode)) {
      setError('Enter the complete six-digit verification code.');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const data = await verifyEmail(email.trim().toLowerCase(), verificationCode);
      completeVerification(data);
      localStorage.removeItem('pendingVerificationEmail');
      toast.success('Email verified. Welcome to SliceHouse!');
      navigate('/dashboard', { replace: true });
    } catch (requestError) {
      const message = requestError.response?.data?.message || 'Unable to verify your email.';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Enter the email address used during registration.');
      return;
    }

    setIsResending(true);
    try {
      const data = await resendVerificationEmail(email.trim().toLowerCase());
      setCode(Array(CODE_LENGTH).fill(''));
      setError('');
      toast.success(data.message || 'A new verification code was sent.');
      inputRefs.current[0]?.focus();
    } catch (requestError) {
      const message = requestError.response?.data?.message || 'Unable to resend the verification code.';
      setError(message);
      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div
      className="relative mt-17 flex min-h-[calc(100svh-68px)] items-center justify-center overflow-x-hidden px-4 py-6 sm:mt-18 sm:min-h-[calc(100svh-72px)] sm:py-8"
      style={{
        background: `radial-gradient(ellipse 600px 400px at 70% 20%, rgba(227,162,59,0.06), transparent 50%), radial-gradient(ellipse 400px 300px at 20% 80%, rgba(193,68,45,0.04), transparent 50%), #FAF6EF`,
      }}
    >
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-[#F0E9DD] bg-white p-6 shadow-xl sm:p-10">
        <div className="mb-6">
          <h1 className="text-[24px] font-extrabold leading-none tracking-tight text-[#1a1a1a] sm:text-[26px]">VERIFY EMAIL</h1>
          <p className="mt-1.5 text-[13px] font-bold tracking-wide text-[#4a4a4a]">ENTER YOUR CODE</p>
        </div>

        <p className="mb-6 text-sm leading-relaxed text-[#4a4a4a]">
          Enter the six-digit code sent to your email. The code expires in 15 minutes.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-[#9a9a9a]">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(event) => { setEmail(event.target.value); setError(''); }}
              disabled={isLoading || isResending}
              className="w-full rounded-full border-2 border-[#E8641F] bg-white px-5 py-3 text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#E8641F]/30 disabled:opacity-60"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-[#9a9a9a]">Verification code</label>
            <div className="flex justify-between gap-2" onPaste={handlePaste}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => { inputRefs.current[index] = element; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(event) => handleCodeChange(index, event.target.value)}
                  onKeyDown={(event) => handleKeyDown(index, event)}
                  disabled={isLoading}
                  aria-label={`Verification digit ${index + 1}`}
                  className={`h-14 w-11 rounded-2xl border-2 bg-white text-center text-2xl font-bold text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#E8641F]/30 sm:w-14 ${error ? 'border-red-500' : 'border-[#E8641F]'}`}
                />
              ))}
            </div>
          </div>

          {error && <p className="text-center text-sm font-semibold text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isLoading || isResending}
            className="flex w-full items-center justify-center rounded-full py-4 font-extrabold text-white shadow-lg transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
            style={{ background: 'linear-gradient(90deg, #F0631E 0%, #F7A11E 100%)', boxShadow: '0 10px 22px rgba(240, 99, 30, 0.4)' }}
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'VERIFY & CONTINUE'}
          </button>
        </form>

        <button
          type="button"
          onClick={handleResend}
          disabled={isLoading || isResending}
          className="mt-5 w-full text-center text-sm font-bold text-[#E8641F] transition hover:text-[#c94a1f] disabled:opacity-50"
        >
          {isResending ? 'SENDING NEW CODE...' : 'RESEND CODE'}
        </button>
      </div>
    </div>
  );
}

export default VerifyEmailPage;