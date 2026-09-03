import { useState } from 'react';
import { Link } from 'react-router-dom';

function LoginPage() {
    const [show, setShow] = useState(false);
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
            className="relative flex min-h-[calc(100svh-68px)] flex-col items-center justify-center overflow-x-hidden px-4 py-6 sm:min-h-[calc(100svh-72px)] sm:px-6 sm:py-8"
            style={{
                background: `
              radial-gradient(ellipse 600px 400px at 70% 20%, rgba(227,162,59,0.06), transparent 50%),
              radial-gradient(ellipse 400px 300px at 20% 80%, rgba(193,68,45,0.04), transparent 50%),
              #FAF6EF
            `,
            }}
        >

            {/* Eyebrow badge + heading */}
            <div className="mb-6 w-full max-w-md flex flex-col items-center text-center sm:mb-8">
                <h1 className="text-[22px] font-extrabold leading-tight tracking-tight text-[#1a1a1a] sm:text-[24px]">
                    ADMIN CONSOLE
                </h1>
                <p className="mt-1 text-sm text-[#7a7a7a]">
                    Create, view, update, & delete in one place.
                </p>
            </div>

            {/* Card */}
            <div className="relative z-10 w-full max-w-md rounded-3xl border border-[#F0E9DD] bg-white p-6 shadow-xl sm:p-8 md:p-10">
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-[#9a9a9a]">
                            Email
                        </label>
                        <input
                            name="emailOrPhone"
                            type="text"
                            required
                            value={formData.emailOrPhone}
                            onChange={handleChange}
                            className="w-full rounded-full border-2 border-[#1a1a1a] bg-white px-5 py-3 text-[#1a1a1a] placeholder-[#b0b0b0] transition focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/30"
                            placeholder="slicehouse@example.com"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-[#9a9a9a]">
                            Password
                        </label>
                        <input
                            name="password"
                            type={show ? "text" : "password"}
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full rounded-full border-2 border-[#1a1a1a] bg-white px-5 py-3 text-[#1a1a1a] placeholder-[#b0b0b0] transition focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/30"
                            placeholder="Password"
                        />
                        <div className="mt-2 flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={show}
                                onChange={() => setShow(!show)}
                                className="h-4 w-4 rounded accent-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/40"
                            />
                            <span className="text-sm text-[#1a1a1a]">Show Password</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full cursor-pointer rounded-full bg-[#1a1a1a] py-4 text-white shadow-lg transform hover:scale-[1.02] transition duration-300 ease-in-out active:scale-[0.99]"
                    >
                        <div className="leading-tight">
                            <div className="text-[15px] font-extrabold tracking-wide">LOG IN</div>
                            <div className="mt-0.5 text-[10px] font-semibold tracking-wider opacity-90">
                                ACCESS DASHBOARD
                            </div>
                        </div>
                    </button>
                </form>

                <p className="mt-6 text-center text-xs text-[#9a9a9a]">
                    Restricted access — SliceHouse Administration only.
                </p>
            </div>
        </div>
    );
}

export default LoginPage;