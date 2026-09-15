import { useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, UtensilsCrossed } from 'lucide-react'
import PizzaCard from '../../component/cart/PizzaCard'
import fireImage from '../../assets/images/Fireimage.png'
import { getPizzas } from "../../services/pizzaService";
import { Link } from 'react-router-dom'


function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [menu, setMenu] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadPizzas = async () => {
      try {
        const response = await getPizzas()
        if (isMounted) {
          setMenu(response.pizzas ?? [])
        }
      } catch {
        if (isMounted) {
          setError('Unable to load the menu right now.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadPizzas()

    return () => {
      isMounted = false
    }
  }, [])

  const categories = useMemo(
    () => ['All', ...new Set(menu.map((item) => item.category).filter(Boolean))],
    [menu],
  )

  const filteredMenu = useMemo(() => {
    return activeCategory === 'All'
      ? menu
      : menu.filter((item) => item.category === activeCategory)
  }, [activeCategory, menu])

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#FAF6EF] text-[#171717]">
      <section className="relative isolate flex min-h-[360px] items-center overflow-hidden text-white sm:min-h-[420px] lg:min-h-[470px]">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{ backgroundImage: `url(${fireImage})` }}
        />

        <div className="absolute inset-0 -z-10 bg-black/55" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/65 to-black/30" />

        <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <div className="mt-6 mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-black/20 px-3.5 py-2 backdrop-blur-sm sm:mb-6">
              <UtensilsCrossed className="h-3.5 w-3.5 text-amber-400" strokeWidth={2.5} />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400 sm:text-xs">
                Full Menu
              </span>
            </div>

            <h1 className="font-serif text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Every pizza,
              <br />
              one{' '}
              <span className="text-amber-400">
                wood fire.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-white/75 sm:mt-6 sm:text-base md:text-lg">
              From the classics to seasonal specials. Build your order below
              and we'll have it ready in under 25 minutes.
            </p>
          </div>
        </div>
      </section>

      <section
        id="menu-categories"
        className="sticky top-0 z-30 scroll-mt-[72px] border-b border-black/5 bg-[#FAF6EF]/95 shadow-sm backdrop-blur-lg"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-3 sm:py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((category) => {
              const isActive = activeCategory === category

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`shrink-0 rounded-full px-4 py-2.5 text-xs font-bold transition-all duration-200 sm:px-5 sm:text-sm ${
                    isActive
                      ? 'bg-[#C1442D] text-white shadow-md shadow-[#C1442D]/20'
                      : 'bg-black/[0.04] text-black/60 hover:bg-[#C1442D]/10 hover:text-[#C1442D]'
                  }`}
                >
                  {category}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <section className="w-full">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="mb-7 flex items-end justify-between gap-4 sm:mb-9">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-[#C1442D]">
                Our selection
              </p>

              <h2 className="font-serif text-2xl font-semibold text-[#171717] sm:text-3xl">
                {activeCategory === 'All' ? 'Our pizzas' : activeCategory}
              </h2>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden rounded-full bg-black/[0.04] px-3 py-1.5 text-xs font-medium text-black/50 sm:block">
                {filteredMenu.length} {filteredMenu.length === 1 ? 'pizza' : 'pizzas'}
              </span>

              <Link
                to="/custom-pizza"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#C1442D] px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#A93724] hover:shadow-md sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm"
              >
                Build your own
                <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="flex min-h-[260px] items-center justify-center text-sm font-medium text-black/50 sm:text-base">
              Loading pizzas...
            </div>
          ) : error ? (
            <div className="flex min-h-[260px] items-center justify-center rounded-3xl border border-dashed border-black/10 bg-white/40 px-6 text-center">
              <p className="text-sm font-medium text-[#C1442D] sm:text-base">{error}</p>
            </div>
          ) : filteredMenu.length === 0 ? (
            <div className="flex min-h-[260px] items-center justify-center rounded-3xl border border-dashed border-black/10 bg-white/40 px-6 text-center">
              <div>
                <UtensilsCrossed className="mx-auto mb-3 h-8 w-8 text-black/20" />
                <p className="text-sm font-medium text-black/50 sm:text-base">
                  No pizzas in this category yet.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
              {filteredMenu.map((pizza) => (
                <PizzaCard
                  key={pizza._id}
                  pizza={pizza}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default MenuPage;
