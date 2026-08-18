import { useState } from 'react'
import { Pizza, Search, Menu as MenuIcon, X, ShoppingCart } from 'lucide-react'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Menu', href: '#menu' },
  { label: 'About', href: '#about' },
  { label: 'Contact Us', href: '#contact' },
]

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [active, setActive] = useState('Home')
  const [query, setQuery] = useState('')

  return (
    <header className="sticky top-0 z-50 shadow-lg shadow-red-900/30">
      <div className="w-full border-t bg-gradient-to-r from-[#c1121f] to-[#e63946] px-5 md:px-10">
        <nav className="mx-auto flex h-[72px] max-w-7xl items-center gap-6 px-5 py-2.5">
          {/* Logo — left */}
          <div className="flex shrink-0 items-center">
            <a href="#" className="group flex items-center gap-2.5">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-amber-400 shadow-inner transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110">
                <Pizza className="h-6 w-6 text-[#2b2118]" strokeWidth={2.2} />
              </span>
              <span className="text-2xl font-extrabold tracking-wide text-[#fffaf2]">
                Slice<span className="text-amber-400">House</span>
              </span>
            </a>
          </div>

          {/* Search — centered */}
          <div className="flex flex-1 justify-center">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="hidden w-full max-w-md items-center rounded-full bg-[#fffaf2] py-1 pl-4 pr-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.25)] transition-all duration-200 focus-within:ring-[3px] focus-within:ring-amber-400 sm:flex"
            >
              <Search className="h-[18px] w-[18px] shrink-0 text-stone-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pizzas, sides, deals..."
                aria-label="Search menu"
                className="w-full bg-transparent px-3 py-2 text-[15px] text-stone-800 outline-none placeholder:text-stone-400"
              />
              <button
                type="submit"
                className="rounded-full bg-amber-400 px-5 py-2 text-sm font-bold text-stone-900 transition-all hover:bg-amber-500 active:scale-95"
              >
                Search
              </button>
            </form>
          </div>

          {/* Links & Order button — right */}
          <div className="flex shrink-0 items-center gap-4">
            <ul className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={() => setActive(link.label)}
                    className={`relative rounded-lg px-4 py-2.5 text-[15px] font-semibold tracking-wide transition-colors duration-200 after:absolute after:bottom-1 after:left-4 after:right-4 after:h-[3px] after:rounded-full after:bg-amber-400 after:transition-transform after:duration-300 after:[transform-origin:left] ${
                      active === link.label
                        ? 'text-amber-400 after:scale-x-100'
                        : 'text-[#fffaf2] after:scale-x-0 hover:text-amber-400'
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <button className="hidden shrink-0 items-center gap-2 rounded-full bg-amber-400 px-5 py-2.5 text-[15px] font-extrabold text-stone-900 shadow-[0_3px_0_#d89500] transition-all hover:-translate-y-0.5 hover:shadow-[0_5px_0_#d89500] active:translate-y-px active:shadow-[0_2px_0_#d89500] lg:flex">
              <ShoppingCart className="h-[18px] w-[18px]" />
              Order Now
            </button>

            {/* Hamburger — mobile */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-lg text-[#fffaf2] transition-colors hover:bg-white/10 lg:hidden"
            >
              {mobileOpen ? <X className="h-7 w-7" /> : <MenuIcon className="h-7 w-7" />}
            </button>
          </div>
        </nav>

        {/* Mobile dropdown with card style */}
        {mobileOpen && (
          <div className="mx-4 mb-4 rounded-2xl bg-white/10 backdrop-blur-sm shadow-xl lg:hidden">
            <div className="flex flex-col gap-1 px-6 pb-5 pt-3">
              {/* Mobile search */}
              <form
                onSubmit={(e) => e.preventDefault()}
                className="mb-2 flex items-center rounded-full bg-[#fffaf2] py-1 pl-4 pr-1.5 shadow-inner sm:hidden"
              >
                <Search className="h-[18px] w-[18px] shrink-0 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search pizzas..."
                  aria-label="Search menu"
                  className="w-full bg-transparent px-3 py-2 text-[15px] text-stone-800 outline-none placeholder:text-stone-400"
                />
              </form>
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => {
                    setActive(link.label)
                    setMobileOpen(false)
                  }}
                  className={`border-b border-white/10 py-3 font-semibold transition-colors ${
                    active === link.label ? 'text-amber-400' : 'text-[#fffaf2] hover:text-amber-400'
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <button className="mt-3 flex items-center justify-center gap-2 rounded-full bg-amber-400 px-5 py-3 font-extrabold text-stone-900 shadow-md transition hover:bg-amber-500">
                <ShoppingCart className="h-[18px] w-[18px]" />
                Order Now
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar