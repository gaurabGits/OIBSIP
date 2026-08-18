import { Pizza, MapPin, Phone, Clock,} from 'lucide-react'
import { FaFacebookSquare, FaInstagramSquare, FaTwitterSquare} from "react-icons/fa";
import SystemLogo from '../../assets/icons/SystemLogo';

const shopLinks = [
  { label: 'Menu', href: '#menu' },
  { label: 'About', href: '#about' },
]

const supportLinks = [
  { label: 'Contact', href: '#contact' },
  { label: 'FAQs', href: '#faq' },
]

function Footer() {
  return (
    <footer className="w-full border-t border-[#3a2a1e] bg-[#1c1410]">
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <SystemLogo className="mb-3" showText={true} />
            <p className="mt-3 text-sm text-[#a89482]">
              Fresh, wood-fired pizza delivered hot to your door.
            </p>
          </div>

          {/* Shop links */}
          <div>
            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#d4a24c]">
              Shop
            </h3>
            <ul className="flex flex-col gap-2">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[#c9b9a4] transition-colors hover:text-[#fdf8f0]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#d4a24c]">
              Support
            </h3>
            <ul className="flex flex-col gap-2">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[#c9b9a4] transition-colors hover:text-[#fdf8f0]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
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

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-[#3a2a1e] pt-6 sm:flex-row">
          <p className="text-xs text-[#6b5c4d]">
            © {new Date().getFullYear()} SliceHouse. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" aria-label="Instagram" className="text-[#a89482] hover:text-[#d4a24c]">
              <FaInstagramSquare className="h-6 w-6" />
            </a>
            <a href="#" aria-label="Facebook" className="text-[#a89482] hover:text-[#d4a24c]">
              <FaFacebookSquare className="h-6 w-6" />
            </a>
            <a href="#" aria-label="Twitter" className="text-[#a89482] hover:text-[#d4a24c]">
              <FaTwitterSquare className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer