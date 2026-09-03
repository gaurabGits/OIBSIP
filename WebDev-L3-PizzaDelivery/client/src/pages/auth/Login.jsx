import { useState } from 'react';
import { Link } from 'react-router-dom';

function LoginPage() {
  const [ show, setShow ] = useState(false)
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login Submitted:', formData);
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
            <h1 className="text-[24px] font-extrabold leading-none tracking-tight text-[#1a1a1a] sm:text-[26px]">LOG IN</h1>
            <p className="text-[13px] font-bold text-[#4a4a4a] mt-1.5 tracking-wide whitespace-nowrap">WELCOME BACK!</p>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold tracking-widest text-[#9a9a9a] mb-2 uppercase">
              Email
            </label>
            <input
              name="emailOrPhone"
              type="text"
              required
              value={formData.emailOrPhone}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-full border-2 border-[#E8641F] bg-white text-[#1a1a1a] placeholder-[#b0b0b0] focus:outline-none focus:ring-2 focus:ring-[#E8641F]/30 transition"
              placeholder="splicehouse@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold tracking-widest text-[#9a9a9a] mb-2 uppercase">
              Password
            </label>
            <input
              name="password"
              type= {show ? "text" : "password"}
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-full border-2 border-[#E8641F] bg-white text-[#1a1a1a] placeholder-[#b0b0b0] focus:outline-none focus:ring-2 focus:ring-[#E8641F]/30 transition"
              placeholder="Password"
            />
            <div className="mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                checked={show}
                onChange={() => setShow(!show)}
                className="h-4 w-4 accent-[#E8641F] focus:ring-2 focus:ring-[#E8641F]/40 focus:outline-none rounded"
              />
              <span className="text-sm text-[#1a1a1a]">Show Password</span>
            </div>
          
          </div>

          <div className="text-right mt-2!">
            <Link
              to="/login/ForgotPassword"
              >
                Forgot Password?
              </Link>
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
              <div className="text-[15px] font-extrabold tracking-wide">LOG IN</div>
              <div className="text-[10px] font-semibold tracking-wider opacity-90 mt-0.5">
                ACCESS ACCOUNT
              </div>
            </div>
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-[#4a4a4a] mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-[#E8641F] hover:text-[#c94a1f]">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
