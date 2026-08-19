import { Truck, Flame, Leaf, Pizza } from 'lucide-react';

const features = [
  {
    icon: Flame,
    title: 'Wood-Fired, Always',
    text: 'Every pizza is baked at 900°F for a crisp base and smoky edge.',
  },
  {
    icon: Pizza,
    title: 'Build Your Own',
    text: 'Pick your base, sauce, cheese, and toppings — review it all before you pay.',
  },
  {
    icon: Truck,
    title: 'Under 25 Minutes',
    text: 'Ordered, baked, and on your doorstep before the timer runs out.',
  },
  {
    icon: Leaf,
    title: 'Fresh Ingredients',
    text: 'Locally sourced vegetables and dough made fresh every morning.',
  },
];

function FeatureSection() {
  return (
    <section className="relative overflow-hidden bg-[#FAF6EF] px-5 py-24 md:px-10">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-24">
        {/* Left: copy + features */}
        <div>
          <span className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#C1442D]">
            Why SliceHouse
          </span>
          <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-[#1C1712] sm:text-4xl">
            Pizza done <span className="text-[#C1442D]">Properly</span>
          </h2>
          <p className="mt-4 max-w-md font-sans text-[15px] leading-relaxed text-[#1C1712]/60">
            No shortcuts, no reheats. Build a pizza that's actually yours,
            then watch a live fire and a fast kitchen do the rest.
          </p>

          <div className="mt-10 space-y-7">
            {features.map(({ icon: Icon, title, text }) => (
              <div key={title} className="group flex gap-5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#C1442D]/10 text-[#C1442D] transition-colors duration-300">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </span>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#1C1712]">
                    {title}
                  </h3>
                  <p className="mt-1 font-sans text-sm leading-relaxed text-[#1C1712]/60">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <a
            href="#builder"
            className="mt-10 inline-flex items-center gap-2 font-sans text-sm font-semibold text-[#C1442D] transition-colors hover:text-[#1C1712]"
          >
            Start building your pizza
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>

        {/* Right: image */}
        <div className="relative">
          <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-[#C1442D]/10 blur-2xl" />
          <div className="overflow-hidden rounded-[1.75rem] shadow-2xl shadow-[#1C1712]/20">
            <img
              src="../../../images/landingImg.png"
              alt="Wood-fired pizza fresh from the oven"
              className="h-[420px] w-full object-cover sm:h-[480px]"
            />
          </div>
          {/* Floating badge */}
          <div className="absolute -bottom-6 left-6 flex items-center gap-3 rounded-2xl bg-[#1C1712] px-5 py-4 shadow-xl sm:left-8">
            <Flame className="h-5 w-5 text-[#C1442D]" strokeWidth={2} />
            <div>
              <p className="font-serif text-sm font-semibold text-[#FAF6EF]">
                900°F Oven
              </p>
              <p className="text-xs text-[#FAF6EF]/60">Fired all day, every day</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeatureSection;