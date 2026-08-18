import React, { use, useState } from 'react';
import { MoveLeft } from 'lucide-react';

function SignUpPage() {
  const [step, setStep] = useState(1);
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBack = (e) => {
    e.preventDefault();
    setStep(1);
  };

  const handleNext = (e) =>{
    e.preventDefault();
     if(!formData.fullName || !formData.phone) return;
    setStep(2);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sign Up Submitted:', formData);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse 600px 400px at 70% 20%, rgba(227,162,59,0.06), transparent 50%),
          radial-gradient(ellipse 400px 300px at 20% 80%, rgba(193,68,45,0.04), transparent 50%),
          #FAF6EF
        `,
      }}
    >
      {/* Card */}
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-[#F0E9DD] p-10 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 gap-3">
          <div className="min-w-0">
            <h1 className="text-[26px] font-extrabold text-[#1a1a1a] tracking-tight leading-none whitespace-nowrap">SIGN UP</h1>
            <p className="text-[13px] font-bold text-[#4a4a4a] mt-1.5 tracking-wide whitespace-nowrap">JOIN THE PARTY!</p>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
         {step === 1 && (
            <>
                <div>
                    <label className="block text-xs font-bold tracking-widest text-[#9a9a9a] mb-2 uppercase">
                        Full Name
                    </label>
                    <input name="fullName" type="text" required
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full px-5 py-3 rounded-full border-2 border-[#E8641F] bg-white text-[#1a1a1a] placeholder-[#b0b0b0] focus:outline-none focus:ring-2 focus:ring-[#E8641F]/30 transition"
                        placeholder="Gaurab Bishwarkarma"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold tracking-widest text-[#9a9a9a] mb-2 uppercase">
                        Phone Number
                    </label>
                    <input name="phone" type="tel" required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-5 py-3 rounded-full border-2 border-[#E8641F] bg-white text-[#1a1a1a] placeholder-[#b0b0b0] focus:outline-none focus:ring-2 focus:ring-[#E8641F]/30 transition"
                        placeholder="97XXXXXXXX"
                    />
                </div>
                 <button
                    type="button"
                    onClick={handleNext}
                    className="w-full  mt-4 py-4 cursor-pointer rounded-full text-white shadow-lg transition transform hover:scale-[1.02] active:scale-[0.99]"
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
                    <label className="block text-xs font-bold tracking-widest text-[#9a9a9a] mb-2 uppercase">
                        Email Address
                    </label>
                    <input name="email" type="email" required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-5 py-3 rounded-full border-2 border-[#E8641F] bg-white text-[#1a1a1a] placeholder-[#b0b0b0] focus:outline-none focus:ring-2 focus:ring-[#E8641F]/30 transition"
                        placeholder="splicehouse@example.com"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold tracking-widest text-[#9a9a9a] mb-2 uppercase">
                        Password
                    </label>
                    <input name="password" 
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

                <div className="flex mt-8 items-center gap-4">
                {/* Circle Back Button */}
                <button
                    onClick={handleBack}
                    className="flex items-center justify-center py-4  px-4 rounded-full cursor-pointer bg-amber-300 shadow-md transition-transform hover:scale-105 active:scale-95"
                    style={{
                        background: "linear-gradient(90deg, #F0631E 0%, #F7A11E 100%)",
                        boxShadow: "0 10px 22px rgba(240, 99, 30, 0.4)",
                    }}
                >
                    <MoveLeft className="text-[22px] font-extrabold text-white" />
                </button>

                {/* Create Account Button (85% width) */}
                <button
                    type="submit"
                    className="flex-1 py-4 rounded-full cursor-pointer text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                    style={{
                    background: "linear-gradient(90deg, #F0631E 0%, #F7A11E 100%)",
                    boxShadow: "0 10px 22px rgba(240, 99, 30, 0.4)",
                    flexBasis: "85%",
                    }}
                >
                    <div className="leading-tight text-center">
                    <div className="text-[16px] font-extrabold tracking-wide">
                        CREATE ACCOUNT
                    </div>
                    <div className="text-[11px] font-semibold tracking-wider opacity-90 mt-0.5">
                        JOIN NOW
                    </div>
                    </div>
                </button>
                </div>
            </>
        )}
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-[#4a4a4a] mt-6">
          Already have an account?{' '}
          <a href="/login" className="font-bold text-[#E8641F] hover:text-[#c94a1f]">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignUpPage;