import { useMemo, useState, useEffect } from 'react'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Leaf,
  LoaderCircle,
  ShoppingBag,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { getInventory } from '../../services/pizzaService'
import { useCart } from '../../context/CartContext'



const STEPS = [
  {
    key: 'base',
    label: 'Base',
    helper: 'Choose your crust',
    required: true,
  },
  {
    key: 'sauce',
    label: 'Sauce',
    helper: 'Set the foundation',
    required: true,
  },
  {
    key: 'cheese',
    label: 'Cheese',
    helper: 'Make it melt',
    required: true,
  },
  {
    key: 'vegetables',
    label: 'Vegetables',
    helper: 'Finish it off. Add as many as you like',
    required: false,
  },
]

const CRUST_FILL = '#E4C592'
const SAUCE_FILL = '#C1442D'
const CHEESE_FILL = '#F2B441'
const VEG_FILL = '#5B7343'

const ACCENTS = {
  base: '#C1442D',
  sauce: '#C1442D',
  cheese: '#C1442D',
  vegetables: '#5B7343',
}

const formatPrice = (price) =>
  `Rs. ${Number(price || 0).toLocaleString()}`


function StepRail({ currentIndex, isStepDone, onJump }) {
  return (
    <ol className="flex w-full items-center">
      {STEPS.map((step, idx) => {
        const done = isStepDone(step.key)
        const active = idx === currentIndex

        const reachable =
          idx === 0 ||
          isStepDone(STEPS[idx - 1].key) ||
          done

        return (
          <li
            key={step.key}
            className="flex min-w-0 flex-1 items-center last:flex-none"
          >
            <button
              type="button"
              disabled={!reachable}
              onClick={() => reachable && onJump(idx)}
              className="flex shrink-0 items-center gap-2 disabled:cursor-not-allowed"
            >
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border text-xs font-bold transition-colors ${
                  active
                    ? 'border-[#C1442D] bg-[#C1442D] text-white'
                    : done
                      ? 'border-[#C1442D]/40 bg-[#C1442D]/10 text-[#C1442D]'
                      : 'border-black/15 bg-white text-black/35'
                }`}
              >
                {done && !active ? (
                  <Check className="h-4 w-4" />
                ) : (
                  idx + 1
                )}
              </span>

              <span
                className={`hidden text-sm font-semibold sm:block ${
                  active
                    ? 'text-[#171717]'
                    : done
                      ? 'text-black/60'
                      : 'text-black/35'
                }`}
              >
                {step.label}
              </span>
            </button>

            {idx < STEPS.length - 1 && (
              <span
                className={`mx-2 h-px flex-1 sm:mx-3 ${
                  isStepDone(STEPS[idx + 1].key) || done
                    ? 'bg-[#C1442D]/40'
                    : 'bg-black/10'
                }`}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}


function IngredientOption({
  item,
  selected,
  onSelect,
  accent = '#C1442D',
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      aria-pressed={selected}
      style={
        selected
          ? {
              borderColor: accent,
              boxShadow: `0 0 0 3px ${accent}1A`,
            }
          : undefined
      }
      className={`group relative flex min-h-[4.5rem] items-center justify-between gap-3 overflow-hidden rounded-xl border p-3.5 text-left transition-all ${
        selected
          ? 'bg-black/[0.015]'
          : 'border-black/10 bg-white hover:border-black/20'
      }`}
    >
      {/* Active indicator */}
      <span
        style={{ backgroundColor: accent }}
        className={`absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 transition-transform duration-200 ${
          selected ? 'scale-x-100' : ''
        }`}
      />

      {/* Content */}
      <span className="min-w-0">
        <span className="flex min-w-0 items-center gap-2">
          <span className="block truncate text-sm font-semibold text-[#171717]">
            {item.name}
          </span>

          {selected && (
            <span
              style={{
                color: accent,
                backgroundColor: `${accent}14`,
              }}
              className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
            >
              Added
            </span>
          )}
        </span>

        <span className="mt-1 block text-xs text-black/45">
          {formatPrice(item.price)}
        </span>
      </span>

      {/* Check */}
      <span
        style={
          selected
            ? {
                borderColor: accent,
                backgroundColor: accent,
              }
            : undefined
        }
        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-transform ${
          selected
            ? 'scale-100 text-white'
            : 'scale-90 border-black/15 text-transparent'
        }`}
      >
        <Check className="h-3.5 w-3.5" />
      </span>
    </button>
  )
}


function PizzaCrossSection({ selection }) {
  const vegCount = selection.vegetables.length

  const visibleDots = Math.min(vegCount, 10)

  const overflow = vegCount - visibleDots

  const dots = Array.from({ length: visibleDots }).map((_, i) => {
    const angle =
      (i / Math.max(visibleDots, 1)) * Math.PI * 2 -
      Math.PI / 2

    const r = 40

    return {
      cx: 100 + r * Math.cos(angle),
      cy: 100 + r * Math.sin(angle),
    }
  })

  return (
    <div className="relative mx-auto grid h-36 w-36 place-items-center sm:h-40 sm:w-40">
      {/* Pizza layers */}
      <svg
        viewBox="0 0 200 200"
        className="h-full w-full -rotate-90"
      >
        {/* Crust */}
        <circle
          cx="100"
          cy="100"
          r="88"
          fill="none"
          stroke={
            selection.base
              ? CRUST_FILL
              : 'rgba(250,246,239,0.15)'
          }
          strokeWidth="22"
          strokeDasharray={
            selection.base ? undefined : '3 7'
          }
          className="transition-all duration-500"
        />

        {/* Sauce */}
        <circle
          cx="100"
          cy="100"
          r="64"
          fill="none"
          stroke={
            selection.sauce
              ? SAUCE_FILL
              : 'rgba(250,246,239,0.12)'
          }
          strokeWidth="18"
          strokeDasharray={
            selection.sauce ? undefined : '3 7'
          }
          className="transition-all duration-500"
        />

        {/* Cheese */}
        <circle
          cx="100"
          cy="100"
          r="42"
          fill={
            selection.cheese
              ? CHEESE_FILL
              : 'rgba(250,246,239,0.08)'
          }
          className="transition-all duration-500"
        />
      </svg>

      {/* Vegetables */}
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 h-full w-full"
      >
        {dots.map((dot, i) => (
          <circle
            key={i}
            cx={dot.cx}
            cy={dot.cy}
            r="6"
            fill={VEG_FILL}
            stroke="#1C1712"
            strokeWidth="1"
          />
        ))}
      </svg>

      {/* Overflow */}
      {overflow > 0 && (
        <span className="absolute bottom-0 right-0 grid h-7 w-7 place-items-center rounded-full bg-[#5B7343] text-[11px] font-bold text-white">
          +{overflow}
        </span>
      )}
    </div>
  )
}


function CustomPizzaPage() {
  const navigate = useNavigate()
  const { addCustomPizza } = useCart()
  const [inventory, setInventory] = useState({
    bases: [],
    sauces: [],
    cheeses: [],
    vegetables: [],
  })

  const [selection, setSelection] = useState({
    base: null,
    sauce: null,
    cheese: null,
    vegetables: [],
  })

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)


  useEffect(() => {
    let isMounted = true

    const loadInventory = async () => {
      try {
        const response = await getInventory()

        if (isMounted) {
          setInventory({
            bases: response.bases ?? [],
            sauces: response.sauces ?? [],
            cheeses: response.cheeses ?? [],
            vegetables: response.vegetables ?? [],
          })
        }
      } catch {
        if (isMounted) {
          setError(
            'Ingredients could not be loaded right now.'
          )
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadInventory()

    return () => {
      isMounted = false
    }
  }, [])


  const selectSingle = (key, item) => {
    setSelection((current) => ({
      ...current,
      [key]:
        current[key]?._id === item._id
          ? null
          : item,
    }))
  }

  const toggleVegetable = (item) => {
    setSelection((current) => {
      const exists = current.vegetables.some(
        (vegetable) => vegetable._id === item._id
      )

      return {
        ...current,
        vegetables: exists
          ? current.vegetables.filter(
              (vegetable) => vegetable._id !== item._id
            )
          : [...current.vegetables, item],
      }
    })
  }


  const isStepDone = (key) => {
    if (key === 'vegetables') {
      return true
    }

    return Boolean(selection[key])
  }


  const total = useMemo(() => {
    const requiredTotal = [
      'base',
      'sauce',
      'cheese',
    ].reduce(
      (sum, key) =>
        sum + Number(selection[key]?.price || 0),
      0
    )

    const vegetableTotal =
      selection.vegetables.reduce(
        (sum, item) =>
          sum + Number(item.price || 0),
        0
      )

    return requiredTotal + vegetableTotal
  }, [selection])


  const isComplete =
    selection.base &&
    selection.sauce &&
    selection.cheese

  const step = STEPS[currentIndex]

  const isLastStep =
    currentIndex === STEPS.length - 1

  const canAdvance = step.required
    ? Boolean(selection[step.key])
    : true

  const goNext = () => {
    if (!canAdvance) return

    if (!isLastStep) {
      setCurrentIndex((index) => index + 1)
    }
  }

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((index) => index - 1)
    }
  }

  const addToCart = () => {
    if (!isComplete) return

    addCustomPizza({
      price: total,
      base: selection.base.name,
      ingredients: [selection.base, selection.sauce, selection.cheese, ...selection.vegetables],
    })
    navigate('/cart')
  }


  if (isLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#FAF6EF] px-4 text-[#171717]">
        <div className="flex items-center gap-3 text-sm font-semibold text-black/60">
          <LoaderCircle className="h-5 w-5 animate-spin text-[#C1442D]" />
          Loading fresh ingredients...
        </div>
      </main>
    )
  }


  if (error) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#FAF6EF] px-4 text-center text-[#171717]">
        <div>
          <p className="font-serif text-3xl font-semibold">
            The kitchen is regrouping.
          </p>

          <p className="mt-3 text-sm text-[#C1442D]">
            {error}
          </p>

          <Link
            to="/menu"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#C1442D] px-4 py-3 text-sm font-bold text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to menu
          </Link>
        </div>
      </main>
    )
  }

  /* PAGE */

  return (
    <main className="min-h-screen bg-[#FAF6EF] px-4 pb-10 pt-[96px] text-[#171717] sm:px-6 sm:pb-14 sm:pt-[112px] lg:px-8 lg:pb-16">
      <div className="mx-auto w-full max-w-7xl">
        
        <header className="mt-4">
          <p className="text-sm font-semibold text-[#C1442D]">
            Custom pizza
          </p>

          <h1 className="mt-1 font-serif text-3xl font-semibold leading-tight sm:text-4xl">
            Make it yours.
          </h1>
        </header>


        <div className="mt-6 grid min-w-0 gap-6 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-8">

          <div className="min-w-0">
            {/* Steps */}
            <div className="mb-6">
              <StepRail
                currentIndex={currentIndex}
                isStepDone={isStepDone}
                onJump={setCurrentIndex}
              />
            </div>

          {/* LEFT: INGREDIENTS */}
          <section className="min-w-0 rounded-2xl border border-black/5 bg-white/40 p-4 sm:p-6 lg:p-7">

            {/* Section Header */}
            <div className="mb-5 flex items-center justify-between gap-4 border-b border-black/10 pb-4">
              <div className="min-w-0">
                <h2 className="font-serif text-xl font-semibold sm:text-2xl">
                  {step.label}
                </h2>

                <p className="mt-1 text-sm text-black/45">
                  {step.helper}
                </p>
              </div>

              <span className="shrink-0 text-xs font-medium text-black/35">
                {step.required
                  ? 'Pick one'
                  : 'Optional'}
              </span>
            </div>

            {/* Ingredient Grid */}
            <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {(step.key === 'vegetables'
                ? inventory.vegetables
                : inventory[`${step.key}s`]
              ).map((item) => (
                <IngredientOption
                  key={item._id}
                  item={item}
                  accent={ACCENTS[step.key]}
                  selected={
                    step.key === 'vegetables'
                      ? selection.vegetables.some(
                          (vegetable) =>
                            vegetable._id === item._id
                        )
                      : selection[step.key]?._id ===
                        item._id
                  }
                  onSelect={
                    step.key === 'vegetables'
                      ? toggleVegetable
                      : (chosen) =>
                          selectSingle(
                            step.key,
                            chosen
                          )
                  }
                />
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 flex items-center justify-between gap-3 border-t border-black/10 pt-5">

              {/* Back */}
              <button
                type="button"
                onClick={goBack}
                disabled={currentIndex === 0}
                className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold transition-colors hover:border-black/20 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>

              {/* Next / Checkout */}
              {isLastStep ? (
                <button
                  type="button"
                  onClick={addToCart}
                  disabled={!isComplete}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#F2B441] px-5 py-2.5 text-sm font-bold text-[#1C1712] transition-colors hover:bg-[#F2B441]/90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Add custom pizza
                </button>
              ) : (
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!canAdvance}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#C1442D] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#A93724] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </section>
          </div>

          {/* RIGHT: SUMMARY */}
          <aside className="min-w-0 rounded-2xl bg-[#1C1712] p-4 text-[#FAF6EF] shadow-lg shadow-black/10 sm:p-6 lg:sticky lg:top-28">

            {/* Pizza Preview */}
            <PizzaCrossSection selection={selection} />

            {/* Selected Ingredients */}
            <div className="mt-4 space-y-3 border-y border-white/10 py-4 text-sm">

              {STEPS.slice(0, 3).map(
                ({ key, label }) => (
                  <div
                    key={key}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="text-white/55">
                      {label}
                    </span>

                    <span className="max-w-[130px] truncate text-right font-medium">
                      {selection[key]?.name || '—'}
                    </span>
                  </div>
                )
              )}

              {/* Vegetables */}
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-white/55">
                  <Leaf className="h-3.5 w-3.5" />
                  Vegetables
                </span>

                <span className="font-medium">
                  {selection.vegetables.length
                    ? `${selection.vegetables.length} added`
                    : 'None'}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="mt-5 flex items-center justify-between gap-3">
              <span className="text-sm text-white/55">
                Estimated total
              </span>

              <span className="font-serif text-xl font-semibold">
                {formatPrice(total)}
              </span>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default CustomPizzaPage