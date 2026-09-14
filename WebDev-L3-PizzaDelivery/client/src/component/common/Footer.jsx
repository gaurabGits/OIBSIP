import { MapPin, Phone, Clock } from 'lucide-react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import SystemLogo from '../../assets/icons/SystemLogo'
import { Link } from 'react-router-dom'

const shopLinks = [
  { label: 'Menu', href: '/menu' },
  { label: 'About', href: '/about' },
]

const supportLinks = [
  { label: 'Contact', href: '/about#contact' },
  { label: 'FAQs', href: '/about#faq' },
]

function Footer() {
  return (
    <footer className="w-full border-t border-[#3a2a1e] bg-[#1c1410]">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:py-12 md:px-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          <div>
            <SystemLogo className="mb-3" showText={true} />
            <p className="mt-3 text-sm text-[#a89482]">
              Fresh, wood-fired pizza delivered hot to your door.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#d4a24c]">
              Shop
            </h3>
            <ul className="flex flex-col gap-2">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-[#c9b9a4] transition-colors hover:text-[#fdf8f0]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#d4a24c]">
              Support
            </h3>
            <ul className="flex flex-col gap-2">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-[#c9b9a4] transition-colors hover:text-[#fdf8f0]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>


          <div>
            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#d4a24c]">
              Contact
            </h3>
            <ul className="flex flex-col gap-2 text-sm text-[#c9b9a4]">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#d4a24c]" />
                Kathmandu, Nepal
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#d4a24c]" />
                +977 97XXXXXXXX
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#d4a24c]" />
                9 AM - 9 PM Daily
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-[#3a2a1e] pt-6 sm:flex-row">
          <p className="text-xs text-[#6b5c4d]">
            Made by <span className="text-[#d4a24c]">Gaurab Bishwakarma</span> · {new Date().getFullYear()}
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/gaurabGits"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-[#a89482] transition-colors hover:text-[#d4a24c]"
            >
              <FaGithub className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/gaurab-bishwakarma-a7a66a272/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-[#a89482] transition-colors hover:text-[#d4a24c]"
            >
              <FaLinkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer