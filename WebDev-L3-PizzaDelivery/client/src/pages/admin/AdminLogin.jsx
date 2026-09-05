import { useState } from 'react';
import { Loader2 } from 'lucide-react';

function LoginPage() {

    const [formData, setFormData] = useState({
        emailOrPhone: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

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
            // Replace this with your real admin login call
            await new Promise((resolve) => setTimeout(resolve, 1500));
            console.log('Login Submitted:', formData);
        } catch (err) {
            setErrors({ form: 'Invalid credentials. Please try again.' });
        } finally {
            setIsLoading(false);
        }
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
                <h1 className="text-[22px] font-extrabold leading-tight tracking-tight text-red-950  sm:text-[24px]">
                    ADMIN CONSOLE
                </h1>
                <p className="mt-1 text-sm text-[#7a7a7a]">
                    Create, view, update, & delete in one place.
                </p>
            </div>

            {/* Card */}
            <div className="relative z-10 w-full max-w-md rounded-3xl border border-[#F0E9DD] bg-white p-6 shadow-xl sm:p-8 md:p-10">
                <form className="space-y-3" onSubmit={handleSubmit} noValidate>
                    <div>
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-red-950/40">
                            Email
                        </label>
                        <input
                            name="emailOrPhone"
                            type="text"
                            value={formData.emailOrPhone}
                            onChange={handleChange}
                            disabled={isLoading}
                            className={`w-full rounded-full border-2 bg-white px-5 py-3 text-[#1a1a1a] placeholder-[#b0b0b0] transition focus:outline-none focus:ring-2 disabled:opacity-60 disabled:cursor-not-allowed ${
                                errors.emailOrPhone
                                    ? 'border-red-500 focus:ring-red-500/30'
                                    : 'border-red-950 focus:ring-red-950/40'
                            }`}
                            placeholder="slicehouse@example.com"
                        />
                        <p className="text-xs text-red-500 h-4 mt-1 px-2 leading-4">
                            {errors.emailOrPhone}
                        </p>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-red-950/40">
                            Password
                        </label>
                        <input
                            name="password"
                            type= "password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={isLoading}
                            className={`w-full rounded-full border-2  bg-white px-5 py-3 text-[#1a1a1a] placeholder-[#b0b0b0] transition focus:outline-none focus:ring-2 disabled:opacity-60 disabled:cursor-not-allowed ${
                                errors.password
                                    ? 'border-red-500 focus:ring-red-500/30'
                                    : 'border-red-950 focus:ring-red-950/40'
                            }`}
                            placeholder="Password"
                        />
                        <p className="text-xs text-red-500 h-4 mt-1 px-2 leading-4">
                            {errors.password}
                        </p>
                    </div>

                    {errors.form && (
                        <p className="text-xs text-red-500 text-center">{errors.form}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-1 cursor-pointer rounded-full bg-red-950 py-4 text-white shadow-lg transform hover:text-amber-300 hover:scale-[1.02] transition duration-300 ease-in-out active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
                    >
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin text-white" />
                        ) : (
                            <div className="leading-tight">
                                <div className="text-[15px] font-extrabold tracking-wide">LOG IN</div>
                                <div className="mt-0.5 text-[10px] font-semibold tracking-wider opacity-90">
                                    ACCESS DASHBOARD
                                </div>
                            </div>
                        )}
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