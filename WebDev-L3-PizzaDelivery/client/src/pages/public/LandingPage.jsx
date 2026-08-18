import HeroSection from '../../component/Landing Page/HeroSection';
import FeatureSection from '../../component/Landing Page/FeatureSection';
import MenuSection from '../../component/Landing Page/MenuSection';
import { Star} from 'lucide-react';



function LandingPage() {
  return (
        <div className="bg-white font-sans antialiased">
          {/* HERO  */}
          <HeroSection />

          {/* FEATURES  */}
          <FeatureSection />

          {/* MENU */}
          <MenuSection />

          {/* TESTIMONIALS */}
          <section className="border-y border-gray-100 bg-gray-50/60 py-16">
            <div className="mx-auto max-w-7xl px-5 md:px-10">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {[
                  {
                    name: 'Sophia M.',
                    text: 'The crust is perfectly charred, and the toppings are always top‑notch.',
                  },
                  {
                    name: 'Marcus J.',
                    text: 'Ordered for a family dinner – everyone raved about the flavour!',
                  },
                ].map(({ name, text }) => (
                  <div
                    key={name}
                    className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex items-center gap-1 text-yellow-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="mt-3 text-gray-700">"{text}"</p>
                    <p className="mt-3 text-sm font-semibold text-gray-900">— {name}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
    );
}

export default LandingPage;