import { useState, useRef, useEffect } from 'react'
import { Menu as MenuIcon, X, ShoppingCart, User, LogOut, ClipboardList, ChevronDown, Loader2 } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import SystemLogo from '../../assets/icons/SystemLogo'
import { getHashTarget, scrollToSection } from '../../utils/scrollToSection'
import useAuth from '../../hooks/useAuth'
import toast from 'react-hot-toast'

const MIN_AUTH_LOADING_MS = 500
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const navLinks = [
  { label: 'Home', href: '/#hero' },
  { label: 'Menu', href: '/menu' },
  { label: 'About Us', href: '/about' },
]

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cartCount] = useState(1)
  const [profileOpen, setProfileOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const profileRef = useRef(null)
  const lastScrollY = useRef(0)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()

  const currentUser = {
    name: user?.fname || user?.name || 'User',
    email: user?.email || '',
    avatarUrl: user?.avatarUrl || '',
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setProfileOpen(false)
        setMobileOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setProfileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  // Hide navbar on scroll-down, reveal on scroll-up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY <= 80) {
        setHidden(false)
      } else if (currentScrollY > lastScrollY.current) {
        setHidden(true)
      } else {
        setHidden(false)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const initials = currentUser.name
    .split(' ')
    .map((name) => name[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const isActive = (href) => {
    const path = href.split('#')[0]
    return path === '/' ? location.pathname === '/' : location.pathname === path
  }

  const closeMobileMenu = () => setMobileOpen(false)

  const handleHashNavigation = (event, href) => {
    const target = getHashTarget(href)

    if (!target) {
      return
    }

    setMobileOpen(false)

    if (target.path === location.pathname) {
      event.preventDefault()
      scrollToSection(target.id)
      window.history.pushState(null, '', `${target.path}${target.hash}`)
    }
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await wait(MIN_AUTH_LOADING_MS)
    logout()
    toast.success('Logged out successfully')
    setProfileOpen(false)
    setMobileOpen(false)
    setIsLoggingOut(false)
    navigate('/login', { replace: true })
  }

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-transform duration-300 ease-in-out ${
        hidden && !mobileOpen ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="bg-gradient-to-r from-[#9c3320] via-[#C1442D] to-[#d9573b] shadow-lg shadow-red-900/30">
        <nav data-scroll-header className="mx-auto flex min-h-[68px] w-full max-w-7xl items-center gap-3 px-3 py-3 sm:min-h-[72px] sm:px-5 md:px-8 lg:px-10">
          <div className="shrink-0">
            <SystemLogo />
          </div>

          <div className="hidden min-w-0 flex-1 justify-center lg:flex">
            <div className="flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={(event) => handleHashNavigation(event, link.href)}
                  className={`relative rounded-lg px-4 py-2.5 text-[15px] font-semibold tracking-wide transition-colors duration-200 after:absolute after:bottom-1 after:left-4 after:right-4 after:h-[3px] after:rounded-full after:bg-amber-400 after:origin-left after:transition-transform after:duration-300 ${
                    isActive(link.href) ? 'text-amber-400 after:scale-x-100' : 'text-[#fffaf2] after:scale-x-0 hover:text-amber-400'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            {isAuthenticated ? (
              <div ref={profileRef} className="relative hidden lg:block">
                <button
                  type="button"
                  onClick={() => setProfileOpen((prev) => !prev)}
                  aria-haspopup="true"
                  aria-expanded={profileOpen}
                  className="flex items-center gap-2 rounded-full bg-white/10 py-1.5 pl-1.5 pr-3 transition-colors hover:bg-white/20"
                >
                  {currentUser.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt={currentUser.name} className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-amber-400 text-sm font-bold text-stone-900">{initials}</span>
                  )}

                  <span className="max-w-[110px] truncate text-sm font-semibold text-[#fffaf2]">{currentUser.name.split(' ')[0]}</span>

                  <ChevronDown className={`h-4 w-4 text-[#fffaf2] transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileOpen && (
                  <div role="menu" className="absolute right-0 top-[calc(100%+10px)] w-64 overflow-hidden rounded-2xl bg-[#fffaf2] shadow-2xl ring-1 ring-black/5">
                    <div className="flex items-center gap-3 border-b border-stone-200 bg-stone-50 px-4 py-4">
                      {currentUser.avatarUrl ? (
                        <img src={currentUser.avatarUrl} alt={currentUser.name} className="h-11 w-11 rounded-full object-cover" />
                      ) : (
                        <span className="grid h-11 w-11 place-items-center rounded-full bg-amber-400 text-base font-bold text-stone-900">{initials}</span>
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-stone-800">{currentUser.name}</p>
                        <p className="truncate text-xs text-stone-500">{currentUser.email}</p>
                      </div>
                    </div>

                    <div className="flex flex-col py-1.5">
                      <Link role="menuitem" to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100">
                        <User className="h-4 w-4" />
                        View Profile
                      </Link>

                      <Link role="menuitem" to="/orders" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100">
                        <ClipboardList className="h-4 w-4" />
                        My Orders
                      </Link>

                      <button role="menuitem" type="button" onClick={handleLogout} disabled={isLoggingOut} className="flex items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-[#C1442D] transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70">
                        {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                        {isLoggingOut ? 'Logging out...' : 'Log Out'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden items-center gap-2 lg:flex">
                <Link to="/cart" aria-label="View cart" className="relative grid h-11 w-11 place-items-center rounded-full text-[#fffaf2] transition-colors hover:bg-white/10">
                  <ShoppingCart className="h-[22px] w-[22px]" />
                  {cartCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-amber-400 px-1 text-[11px] font-bold text-stone-900 shadow">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <Link to="/login" className="rounded-full px-4 py-2.5 text-[15px] font-semibold text-[#fffaf2] transition-colors hover:bg-white/10">
                  Log In
                </Link>

                <Link
                  to="/signup"
                  className="flex shrink-0 items-center gap-2 rounded-full bg-amber-400 px-5 py-2.5 text-[15px] font-extrabold text-stone-900 shadow-[0_3px_0_#d89500] transition-all hover:-translate-y-0.5 hover:shadow-[0_5px_0_#d89500] active:translate-y-px active:shadow-[0_2px_0_#d89500]"
                >
                  Sign Up
                </Link>
              </div>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-[#fffaf2] transition-colors hover:bg-white/10 lg:hidden"
            >
              {mobileOpen ? <X className="h-7 w-7" /> : <MenuIcon className="h-7 w-7" />}
            </button>
          </div>
        </nav>

        {mobileOpen && (
          <div className="border-t border-white/10 bg-gradient-to-b from-[#C1442D] to-[#8a2c1c] px-3 pb-4 sm:px-5 lg:hidden">
            <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-white/10 bg-black/10 shadow-xl backdrop-blur-sm">
              <div className="flex flex-col px-4 pb-5 pt-3 sm:px-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={(event) => handleHashNavigation(event, link.href)}
                    className={`border-b border-white/10 py-3.5 font-semibold transition-colors ${
                      isActive(link.href) ? 'text-amber-400' : 'text-[#fffaf2] hover:text-amber-400'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                {isAuthenticated ? (
                  <>
                    <div className="mt-4 flex items-center gap-3 rounded-xl bg-white/10 px-3 py-3">
                      {currentUser.avatarUrl ? (
                        <img src={currentUser.avatarUrl} alt={currentUser.name} className="h-10 w-10 rounded-full object-cover" />
                      ) : (
                        <span className="grid h-10 w-10 place-items-center rounded-full bg-amber-400 text-sm font-bold text-stone-900">{initials}</span>
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[#fffaf2]">{currentUser.name}</p>
                        <p className="truncate text-xs text-white/70">{currentUser.email}</p>
                      </div>
                    </div>

                    <Link to="/cart" onClick={closeMobileMenu} className="mt-3 flex items-center justify-center gap-2 rounded-full bg-amber-400 px-5 py-3 font-extrabold text-stone-900 shadow-md transition hover:bg-amber-500">
                      <ShoppingCart className="h-[18px] w-[18px]" />
                      Cart {cartCount > 0 && `(${cartCount})`}
                    </Link>

                    <button type="button" onClick={handleLogout} disabled={isLoggingOut} className="mt-2 flex items-center justify-center gap-2 rounded-full border border-white/30 px-5 py-3 font-bold text-[#fffaf2] transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70">
                      {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                      {isLoggingOut ? 'Logging out...' : 'Log Out'}
                    </button>
                  </>
                ) : (
                  <div className="mt-4 flex flex-col gap-2">
                    <Link to="/login" onClick={closeMobileMenu} className="rounded-full border border-white/30 px-5 py-3 text-center font-bold text-[#fffaf2] transition hover:bg-white/10">
                      Log In
                    </Link>

                    <Link to="/signup" onClick={closeMobileMenu} className="rounded-full bg-amber-400 px-5 py-3 text-center font-extrabold text-stone-900 shadow-md transition hover:bg-amber-500">
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
