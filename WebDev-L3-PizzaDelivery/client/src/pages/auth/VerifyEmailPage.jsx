// VerifyPage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

function VerifyPage() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isResending, setIsResending] = useState(false);

  const handleCodeChange = (index, value) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const next = document.getElementById(`code-${index + 1}`);
      if (next) next.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prev = document.getElementById(`code-${index - 1}`);
      if (prev) prev.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullCode = code.join('');
    console.log('Verification Code Submitted:', fullCode);
  };

  const handleResend = () => {
    setIsResending(true);
    console.log('Resending verification code...');
    setTimeout(() => setIsResending(false), 2000);
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
            <h1 className="text-[24px] font-extrabold leading-none tracking-tight text-[#1a1a1a] sm:text-[26px]">VERIFY</h1>
            <p className="text-[13px] font-bold text-[#4a4a4a] mt-1.5 tracking-wide whitespace-nowrap">CHECK YOUR EMAIL</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-[#4a4a4a] mb-6 leading-relaxed">
          We've sent a 6-digit verification code to{' '}
          <span className="font-semibold text-[#1a1a1a]">jovusid@mailinator.com</span>.
          Please enter it below.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Code Inputs */}
          <div className="flex justify-between gap-2 mb-6">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-2xl border-2 border-[#E8641F] bg-white text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#E8641F]/30 transition"
              />
            ))}
          </div>

          {/* Resend Link */}
          <div className="text-center mb-6">
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="text-sm font-semibold text-[#3a3a3a] hover:text-[#E8641F] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? 'Resending...' : 'Resend Code'}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 cursor-pointer rounded-full text-white shadow-lg transition transform hover:scale-[1.02] active:scale-[0.99]"
            style={{
              background: 'linear-gradient(90deg, #F0631E 0%, #F7A11E 100%)',
              boxShadow: '0 10px 22px rgba(240, 99, 30, 0.4)',
            }}
          >
            <div className="leading-tight">
              <div className="text-[15px] font-extrabold tracking-wide">VERIFY</div>
              <div className="text-[10px] font-semibold tracking-wider opacity-90 mt-0.5">
                CONFIRM ACCOUNT
              </div>
            </div>
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-[#4a4a4a] mt-6">
          Wrong email?{' '}
          <Link to="/login" className="font-bold text-[#E8641F] hover:text-[#c94a1f]">
            Go Back
          </Link>
        </p>
      </div>
    </div>
  );
}

export default VerifyPage;