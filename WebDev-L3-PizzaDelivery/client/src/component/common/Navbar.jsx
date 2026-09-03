import { useState, useRef, useEffect } from 'react'
import {
  Menu as MenuIcon,
  X,
  ShoppingCart,
  User,
  LogOut,
  ClipboardList,
  ChevronDown,
} from 'lucide-react'
import SystemLogo from '../../assets/icons/SystemLogo'
import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { label: 'Home', href: '/#hero' },
  { label: 'Menu', href: '/menu' },
  { label: 'About Us', href: '/about' },
]

const demoUser = {
  name: 'Alex Rivera',
  email: 'alex@example.com',
  avatarUrl: '',
}

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [cartCount] = useState(1)
  const [profileOpen, setProfileOpen] = useState(false)
  const [showNavbar, setShowNavbar] = useState(true)

  const profileRef = useRef(null)
  const lastScrollY = useRef(0)

  const location = useLocation()

  /* Show navbar when scrolling up */
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY <= 10) {
        setShowNavbar(true)
        lastScrollY.current = currentScrollY
        return
      }

      if (currentScrollY > lastScrollY.current) {
        setShowNavbar(false)
        setProfileOpen(false)
      } else if (currentScrollY < lastScrollY.current) {
        setShowNavbar(true)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  /* Close profile dropdown when clicking outside */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  /* Close mobile menu when route changes */
  useEffect(() => {
    setMobileOpen(false)
    setProfileOpen(false)
    setShowNavbar(true)
  }, [location.pathname])

  const initials = demoUser.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const isActive = (href) => location.pathname === href.split("#")[0]

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-transform duration-300 ease-in-out ${
        showNavbar ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* Main Navbar */}
      <div className="bg-gradient-to-r from-[#c1121f] via-[#d71920] to-[#e63946] shadow-lg shadow-red-900/30">
        <nav className="mx-auto flex min-h-[68px] max-w-7xl items-center gap-3 px-3 py-3 sm:min-h-[72px] sm:px-5 md:px-8 lg:px-10">
          <div className="shrink-0">
            <SystemLogo />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden min-w-0 flex-1 justify-center lg:flex">
            <div className="flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`relative rounded-lg px-4 py-2.5 text-[15px] font-semibold tracking-wide transition-colors duration-200
                    after:absolute after:bottom-1 after:left-4 after:right-4 after:h-[3px]
                    after:rounded-full after:bg-amber-400
                    after:transition-transform after:duration-300
                    after:[transform-origin:left]
                    ${
                      isActive(link.href)
                        ? 'text-amber-400 after:scale-x-100'
                        : 'text-[#fffaf2] after:scale-x-0 hover:text-amber-400'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side */}
          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">

            {/* Logged In Desktop */}
            {isVerified ? (
              <div className="hidden items-center gap-3 lg:flex">
                <div
                  className="relative"
                  ref={profileRef}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setProfileOpen((value) => !value)
                    }
                    className="flex items-center gap-2 rounded-full bg-white/10 py-1.5 pl-1.5 pr-3 transition-colors hover:bg-white/20"
                  >
                    {demoUser.avatarUrl ? (
                      <img
                        src={demoUser.avatarUrl}
                        alt={demoUser.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-amber-400 text-sm font-bold text-stone-900">
                        {initials}
                      </span>
                    )}

                    <span className="max-w-[110px] truncate text-sm font-semibold text-[#fffaf2]">
                      {demoUser.name.split(' ')[0]}
                    </span>

                    <ChevronDown
                      className={`h-4 w-4 text-[#fffaf2] transition-transform duration-200 ${
                        profileOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Profile Dropdown */}
                  {profileOpen && (
                    <div className="absolute right-0 top-[calc(100%+10px)] w-64 overflow-hidden rounded-2xl bg-[#fffaf2] shadow-2xl ring-1 ring-black/5">
                      <div className="flex items-center gap-3 border-b border-stone-200 bg-stone-50 px-4 py-4">
                        {demoUser.avatarUrl ? (
                          <img
                            src={demoUser.avatarUrl}
                            alt={demoUser.name}
                            className="h-11 w-11 rounded-full object-cover"
                          />
                        ) : (
                          <span className="grid h-11 w-11 place-items-center rounded-full bg-amber-400 text-base font-bold text-stone-900">
                            {initials}
                          </span>
                        )}

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-stone-800">
                            {demoUser.name}
                          </p>

                          <p className="truncate text-xs text-stone-500">
                            {demoUser.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col py-1.5">
                        <a
                          href="#profile"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100"
                        >
                          <User className="h-4 w-4" />
                          View Profile
                        </a>

                        <a
                          href="#orders"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100"
                        >
                          <ClipboardList className="h-4 w-4" />
                          My Orders
                        </a>

                        <button
                          type="button"
                          onClick={() => {
                            setIsVerified(false)
                            setProfileOpen(false)
                          }}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-[#c1121f] transition-colors hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4" />
                          Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Logged Out Desktop */
              <div className="hidden items-center gap-2 lg:flex">

                {/* Cart */}
                <Link
                  to="/menu"
                  aria-label="View cart"
                  className="relative grid h-11 w-11 place-items-center rounded-full text-[#fffaf2] transition-colors hover:bg-white/10"
                >
                  <ShoppingCart className="h-[22px] w-[22px] scale-x-[-1]" />

                  {cartCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-amber-400 px-1 text-[11px] font-bold text-stone-900 shadow">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* Login */}
                <Link
                  to="/login"
                  className="rounded-full px-4 py-2.5 text-[15px] font-semibold text-[#fffaf2] transition-colors hover:bg-white/10"
                >
                  Log In
                </Link>

                {/* Signup */}
                <Link
                  to="/signup"
                  className="flex shrink-0 items-center gap-2 rounded-full bg-amber-400 px-5 py-2.5 text-[15px] font-extrabold text-stone-900 shadow-[0_3px_0_#d89500] transition-all hover:-translate-y-0.5 hover:shadow-[0_5px_0_#d89500] active:translate-y-px active:shadow-[0_2px_0_#d89500]"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-[#fffaf2] transition-colors hover:bg-white/10 lg:hidden"
            >
              {mobileOpen ? (
                <X className="h-7 w-7" />
              ) : (
                <MenuIcon className="h-7 w-7" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="border-t border-white/10 bg-gradient-to-b from-[#c1121f] to-[#a90f1b] px-3 pb-4 sm:px-5 lg:hidden">
            <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-white/10 bg-black/10 shadow-xl backdrop-blur-sm">
              <div className="flex flex-col px-4 pb-5 pt-3 sm:px-6">

                {/* Mobile Links */}
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={`border-b border-white/10 py-3.5 font-semibold transition-colors ${
                      isActive(link.href)
                        ? 'text-amber-400'
                        : 'text-[#fffaf2] hover:text-amber-400'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Mobile Logged In */}
                {isVerified ? (
                  <>
                    <div className="mt-4 flex items-center gap-3 rounded-xl bg-white/10 px-3 py-3">
                      {demoUser.avatarUrl ? (
                        <img
                          src={demoUser.avatarUrl}
                          alt={demoUser.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="grid h-10 w-10 place-items-center rounded-full bg-amber-400 text-sm font-bold text-stone-900">
                          {initials}
                        </span>
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[#fffaf2]">
                          {demoUser.name}
                        </p>

                        <p className="truncate text-xs text-white/70">
                          {demoUser.email}
                        </p>
                      </div>
                    </div>

                    {/* Mobile Cart */}
                    <Link
                      to="/menu"
                      className="mt-3 flex items-center justify-center gap-2 rounded-full bg-amber-400 px-5 py-3 font-extrabold text-stone-900 shadow-md transition hover:bg-amber-500"
                    >
                      <ShoppingCart className="h-[18px] w-[18px]" />
                      Cart {cartCount > 0 && `(${cartCount})`}
                    </Link>

                    {/* Mobile Logout */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsVerified(false)
                        setMobileOpen(false)
                      }}
                      className="mt-2 flex items-center justify-center gap-2 rounded-full border border-white/30 px-5 py-3 font-bold text-[#fffaf2] transition hover:bg-white/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Log Out
                    </button>
                  </>
                ) : (
                  /* Mobile Logged Out */
                  <div className="mt-4 flex flex-col gap-2">
                    <Link
                      to="/login"
                      className="rounded-full border border-white/30 px-5 py-3 text-center font-bold text-[#fffaf2] transition hover:bg-white/10"
                    >
                      Log In
                    </Link>

                    <Link
                      to="/signup"
                      className="rounded-full bg-amber-400 px-5 py-3 text-center font-extrabold text-stone-900 shadow-md transition hover:bg-amber-500"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar