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
    text: 'Build your pizza and review every choice before checkout.',
  },
  {
    icon: Truck,
    title: 'Order tracking',
    text: 'Follow your order with clear, real-time status updates.',
  },
  {
    icon: PackageCheck,
    title: 'Fresh inventory',
    text: 'Smart stock alerts help keep ingredients available.',
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
    <main className="min-h-screen overflow-hidden bg-background text-foreground">

      {/* Hero */}
      <section className="relative isolate min-h-[580px] overflow-hidden border-b border-border bg-[#17120f] text-white">

        {/* Background image */}
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://media02.stockfood.com/largepreviews/NDE0MzQ0MjMz/13365943-Pizza-im-Steinofen-backen.jpg")',
          }}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 -z-10 bg-black/65" />

        {/* Warm gradient */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/55 to-black/35" />

        <div className="mx-auto flex min-h-[580px] max-w-6xl flex-col justify-between gap-12 px-6 py-16 sm:px-10 lg:px-12 lg:py-24">

          <div className="max-w-3xl">
            <p className="mb-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-amber-400">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              About SliceHouse
            </p>

            <h1 className="max-w-3xl font-serif text-5xl leading-[1.02] tracking-tight sm:text-7xl">
              Better pizza,
              <br />
              made your way.
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
              SliceHouse is a modern pizza ordering platform designed to make
              customization, checkout, and order tracking simple from the
              first click to your doorstep.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur-sm">
                Custom pizzas
              </span>
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur-sm">
                Easy checkout
              </span>
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur-sm">
                Order tracking
              </span>
            </div>
          </div>

          <div className="flex w-fit items-center gap-4 border-l border-white/20 pl-5 text-sm text-white/70">
            <ChefHat className="size-7 text-amber-400" />
            <span>
              Built for a smoother
              <br />
              pizza experience.
            </span>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-12 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              What we do
            </p>

            <h2 className="mt-4 font-serif text-4xl tracking-tight sm:text-5xl">
              A clear path from craving to checkout.
            </h2>
          </div>

          <div className="space-y-6 text-base leading-7 text-muted-foreground sm:text-lg">
            <p>
              SliceHouse brings customer ordering and restaurant operations
              into one focused platform. Customers can customize a pizza,
              place an order, and follow its progress.
            </p>

            <p>
              Behind the scenes, administrators can manage orders, inventory,
              and stock alerts from a single dashboard.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid overflow-hidden rounded-2xl border border-border md:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="border-b border-border bg-card p-7 transition-colors hover:bg-muted/40 md:border-b-0 md:border-r last:md:border-r-0 sm:p-8"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="size-5 text-primary" />
              </div>

              <h3 className="mt-10 text-lg font-semibold">
                {title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {text}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Pizza Builder */}
      <section className="border-y border-border bg-[#F5EFE6]">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 sm:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24 lg:px-12 lg:py-24">

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Custom pizza builder
            </p>

            <h2 className="mt-4 font-serif text-4xl tracking-tight sm:text-5xl">
              Make it yours, one choice at a time.
            </h2>

            <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
              Choose exactly what you want and create a pizza that matches
              your taste.
            </p>
          </div>

          <ol className="divide-y divide-border border-y border-border">
            {builderSteps.map((step, index) => (
              <li
                key={step}
                className="flex items-center gap-5 py-5 text-base"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {index + 1}
                </span>

                <span className="font-medium">{step}</span>

                {index < builderSteps.length - 1 && (
                  <Check
                    className="ml-auto size-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Contact */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-12 lg:py-24">

        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Get in touch
            </p>

            <h2 className="mt-4 font-serif text-4xl tracking-tight sm:text-5xl">
              Have a question?
            </h2>

            <p className="mt-4 max-w-md text-muted-foreground">
              We are here to help with questions about orders, payments, or
              the SliceHouse experience.
            </p>
          </div>

          <div className="grid gap-5 text-sm text-muted-foreground">

            <a
              className="flex items-center gap-3 transition-colors hover:text-foreground"
              href="mailto:hello@slicehouse.com"
            >
              <CreditCard className="size-4 text-primary" />
              hello@slicehouse.com
            </a>

            <a
              className="flex items-center gap-3 transition-colors hover:text-foreground"
              href="tel:+9779700000000"
            >
              <Phone className="size-4 text-primary" />
              +977 97XXXXXXXX
            </a>

            <span className="flex items-center gap-3">
              <MapPin className="size-4 text-primary" />
              Kathmandu, Nepal
            </span>

          </div>
        </div>

        {/* Map */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-border shadow-sm">
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