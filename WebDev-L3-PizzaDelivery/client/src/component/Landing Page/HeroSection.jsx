import {
  Check,
  ChefHat,
  CreditCard,
  MapPin,
  PackageCheck,
  Phone,
  ShoppingBag,
  Truck,
} from 'lucide-react'

const features = [
  {
    icon: ShoppingBag,
    title: 'Simple ordering',
    text: 'Build your pizza and check your choices before placing the order.',
  },
  {
    icon: Truck,
    title: 'Order tracking',
    text: 'See your order status from the kitchen to your doorstep.',
  },
  {
    icon: PackageCheck,
    title: 'Fresh inventory',
    text: 'Stock alerts help keep ingredients available for your next pizza.',
  },
]

const builderSteps = [
  'Choose a base',
  'Pick a sauce',
  'Select cheese',
  'Add vegetables',
  'Review and pay',
]

function AboutPage() {
  return (
    <main
      className="min-h-screen bg-[#FAF6EF] text-[#1C1712]"
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      {/* Hero */}
      <section className="relative h-[450px] overflow-hidden border-b border-[#1C1712]/10">
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#E3A23B]/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[450px] w-[450px] rounded-full bg-[#C1442D]/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-12 lg:py-28">
          <div className="max-w-3xl">
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-[#C1442D]">
              <span className="h-2 w-2 rounded-full bg-[#C1442D]" />
              About SliceHouse
            </p>

            <h1 className="mt-5 font-['Fraunces'] text-5xl font-extrabold leading-tight tracking-tight sm:text-7xl">
              Better pizza,
              <br />
              <span className="text-[#C1442D]">made your way.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-[#1C1712]/55 sm:text-lg">
              SliceHouse is a pizza ordering platform that makes it easy to
              customize your pizza, place an order, and track it from the
              kitchen to your doorstep.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#C1442D]/10">
                <ChefHat className="h-5 w-5 text-[#C1442D]" />
              </div>

              <div>
                <p className="text-sm font-bold">Made for pizza lovers</p>
                <p className="text-xs text-[#1C1712]/45">
                  Simple, fresh, and easy to order.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-12 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#C1442D]">
              What we do
            </p>

            <h2 className="mt-4 font-['Fraunces'] text-4xl font-bold leading-tight sm:text-5xl">
              From choosing your pizza to getting it at your door.
            </h2>
          </div>

          <div className="space-y-5 text-base leading-7 text-[#1C1712]/55 sm:text-lg">
            <p>
              SliceHouse brings pizza ordering and restaurant management
              together in one simple platform.
            </p>

            <p>
              Customers can customize their pizza, place an order, and follow
              its progress. Admins can manage orders, ingredients, and stock
              from the dashboard.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-14 grid overflow-hidden rounded-2xl border border-[#1C1712]/10 bg-white md:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="border-b border-[#1C1712]/10 p-8 last:border-0 md:border-b-0 md:border-r md:last:border-r-0"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#C1442D]/10">
                <Icon className="h-5 w-5 text-[#C1442D]" />
              </div>

              <h3 className="mt-8 text-lg font-bold">{title}</h3>

              <p className="mt-2 text-sm leading-6 text-[#1C1712]/50">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Custom pizza */}
      <section className="border-y border-[#1C1712]/10 bg-[#F3ECE0]">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:px-10 lg:grid-cols-2 lg:gap-24 lg:px-12 lg:py-24">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#C1442D]">
              Custom pizza builder
            </p>

            <h2 className="mt-4 font-['Fraunces'] text-4xl font-bold leading-tight sm:text-5xl">
              Make it yours,
              <br />
              <span className="text-[#C1442D]">one choice at a time.</span>
            </h2>

            <p className="mt-5 max-w-md text-base leading-7 text-[#1C1712]/50">
              Choose your favorite ingredients and create a pizza that matches
              your taste.
            </p>
          </div>

          <ol className="divide-y divide-[#1C1712]/10 border-y border-[#1C1712]/10">
            {builderSteps.map((step, index) => (
              <li key={step} className="flex items-center gap-4 py-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#C1442D] text-sm font-bold text-white">
                  {index + 1}
                </span>

                <span className="text-sm font-semibold sm:text-base">
                  {step}
                </span>

                {index < builderSteps.length - 1 && (
                  <Check className="ml-auto h-4 w-4 text-[#1C1712]/30" />
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Contact */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-12 lg:py-24">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#C1442D]">
              Get in touch
            </p>

            <h2 className="mt-4 font-['Fraunces'] text-4xl font-bold sm:text-5xl">
              Have a question?
            </h2>

            <p className="mt-4 max-w-md text-[#1C1712]/50">
              Contact us if you have any questions about your order or the
              SliceHouse experience.
            </p>
          </div>

          <div className="space-y-4 text-sm text-[#1C1712]/55">
            <a
              href="mailto:hello@slicehouse.com"
              className="flex items-center gap-3 hover:text-[#C1442D]"
            >
              <CreditCard className="h-4 w-4 text-[#C1442D]" />
              hello@slicehouse.com
            </a>

            <a
              href="tel:+9779700000000"
              className="flex items-center gap-3 hover:text-[#C1442D]"
            >
              <Phone className="h-4 w-4 text-[#C1442D]" />
              +977 97XXXXXXXX
            </a>

            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-[#C1442D]" />
              Kathmandu, Nepal
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-[#1C1712]/10">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d61023.30145460372!2d85.33710617697987!3d27.687688668222634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2snp!4v1787077630904!5m2!1sen!2snp"
            className="h-[300px] w-full"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            title="SliceHouse location"
          />
        </div>
      </section>
    </main>
  )
}

export default AboutPage