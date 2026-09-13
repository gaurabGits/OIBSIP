import { ArrowLeft, Check, ChevronDown, ChevronUp, Minus, Plus, ShoppingBag } from 'lucide-react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getPizzaById } from '../../services/pizzaService'
import useAuth from '../../hooks/useAuth'
import { useCart } from '../../context/CartContext'
import { formatNpr, getPizzaPrice, SIZE_SURCHARGES } from '../../utils/pricing'

const SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL']
const MAX_QUANTITY = 10
const DESCRIPTION_LINE_CLAMP = 3

function PizzaDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  const [pizza, setPizza] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('M')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [imageFailed, setImageFailed] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)
    setError('')

    const loadPizza = async () => {
      try {
        const response = await getPizzaById(id)
        if (isMounted) {
          setPizza(response.pizza)
        }
      } catch {
        if (isMounted) {
          setError('Pizza details could not be loaded.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadPizza()

    return () => {
      isMounted = false
    }
  }, [id])

  useEffect(() => {
    setIsDescriptionExpanded(false)
  }, [id])

  const handleOrder = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } })
      return
    }

    if (isAdded) return

    const added = addToCart(pizza, quantity, selectedSize)

    if (!added) return

    setIsAdded(true)
    window.setTimeout(() => setIsAdded(false), 1800)
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#FAF6EF] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="mt-10 mb-4 h-10 w-36 rounded-lg bg-black/5" />
          <div className="grid overflow-hidden rounded-2xl bg-white shadow-lg lg:grid-cols-2">
            <div className="h-56 w-full bg-black/5 sm:h-72 lg:h-full lg:min-h-[420px]" />
            <div className="flex flex-col justify-center gap-4 p-5 sm:p-8 lg:p-10">
              <div className="h-3 w-20 rounded bg-black/10" />
              <div className="h-10 w-3/4 rounded bg-black/10" />
              <div className="h-4 w-full rounded bg-black/5" />
              <div className="h-4 w-2/3 rounded bg-black/5" />
              <div className="mt-4 h-16 w-full rounded-lg bg-black/5" />
              <div className="h-12 w-full rounded-lg bg-black/5" />
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (error || !pizza) {
    return (
      <main
        role="status"
        aria-live="polite"
        className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#FAF6EF] px-6 text-center"
      >
        <p className="text-base font-medium text-[#C1442D]">{error || 'Pizza not found.'}</p>
        <Link
          to="/menu#menu-categories"
          className="inline-flex items-center gap-2 rounded-lg bg-[#C1442D] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#A93724]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to menu
        </Link>
      </main>
    )
  }

  const selectedPrice = getPizzaPrice(pizza.price, selectedSize)
  const sizeSurcharge = SIZE_SURCHARGES[selectedSize] || 0
  const totalPrice = selectedPrice * quantity
  const hasLongDescription = (pizza.description || '').length > 140

  return (
    <main className="min-h-screen bg-[#FAF6EF] px-4 py-10 text-[#171717] sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/menu#menu-categories"
          className="mt-10 mb-4 inline-flex items-center gap-2 rounded-lg border border-[#C1442D]/20 bg-white px-4 py-2.5 text-sm font-bold text-[#C1442D] shadow-sm transition hover:border-[#C1442D]/40 hover:bg-[#C1442D]/5 hover:text-[#A93724]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to menu
        </Link>

        <div className="grid overflow-hidden rounded-2xl bg-white shadow-lg lg:grid-cols-2">
          {imageFailed ? (
            <div className="grid h-56 w-full place-items-center bg-[#C1442D]/5 text-sm font-medium text-black/40 sm:h-72 lg:h-full lg:min-h-[420px]">
              Image unavailable
            </div>
          ) : (
            <img
              src={pizza.image}
              alt={pizza.name}
              onError={() => setImageFailed(true)}
              className="h-56 w-full object-cover sm:h-72 lg:h-full lg:min-h-[420px]"
            />
          )}

          <div className="flex flex-col justify-center p-5 sm:p-8 lg:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C1442D]">
              {pizza.category || 'Pizza'}
            </p>
            <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight sm:text-5xl">
              {pizza.name}
            </h1>

            <div className="mt-5">
              <p
                className={`text-base leading-7 text-black/60 ${
                  isDescriptionExpanded ? '' : 'line-clamp-3'
                }`}
                style={
                  !isDescriptionExpanded
                    ? { WebkitLineClamp: DESCRIPTION_LINE_CLAMP }
                    : undefined
                }
              >
                {pizza.description}
              </p>
              {hasLongDescription && (
                <button
                  type="button"
                  onClick={() => setIsDescriptionExpanded((current) => !current)}
                  className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-[#C1442D] hover:text-[#A93724]"
                >
                  {isDescriptionExpanded ? (
                    <>
                      See less
                      <ChevronUp className="h-3.5 w-3.5" />
                    </>
                  ) : (
                    <>
                      See more
                      <ChevronDown className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-[#FAF6EF] p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-black/45">Pizza type</p>
                <p className="mt-1 font-bold">{pizza.category || 'Classic'}</p>
              </div>
              <div className="rounded-lg bg-[#FAF6EF] p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-black/45">Crust</p>
                <p className="mt-1 font-bold">{pizza.dough || 'Classic crust'}</p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <div>
                <p className="min-w-32 whitespace-nowrap text-2xl font-bold tabular-nums">{formatNpr(totalPrice)}</p>
                <p className="min-h-4 whitespace-nowrap text-xs font-medium text-black/40">
                  {sizeSurcharge !== 0 && `${sizeSurcharge > 0 ? 'added' : 'save'} ${formatNpr(sizeSurcharge)}`}
                </p>
              </div>
              <div className="flex h-9 items-center overflow-hidden rounded-lg border border-[#C1442D]/15 bg-[#C1442D]/5">
                <button
                  type="button"
                  aria-label={`Decrease quantity of ${pizza.name}`}
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  className="grid h-full w-9 place-items-center text-black/70 transition hover:bg-[#C1442D]/10 hover:text-[#C1442D] disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-sm font-bold tabular-nums">{quantity}</span>
                <button
                  type="button"
                  aria-label={`Increase quantity of ${pizza.name}`}
                  disabled={quantity >= MAX_QUANTITY}
                  onClick={() => setQuantity((current) => Math.min(MAX_QUANTITY, current + 1))}
                  className="grid h-full w-9 place-items-center text-black/70 transition hover:bg-[#C1442D]/10 hover:text-[#C1442D] disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-black/45">Choose size</p>
              <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    aria-pressed={selectedSize === size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-9 rounded-lg text-[10px] font-semibold transition active:scale-95 ${
                      selectedSize === size
                        ? 'bg-[#C1442D] text-white'
                        : 'bg-[#C1442D]/10 text-black/70 hover:bg-[#C1442D]/15 hover:text-[#C1442D]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={handleOrder}
              disabled={isAdded}
              className={`mt-8 flex h-12 items-center justify-center gap-2 rounded-lg text-sm font-bold text-white shadow-sm transition active:scale-[0.98] ${
                isAdded ? 'bg-emerald-600' : 'bg-[#C1442D] hover:bg-[#A93724] hover:shadow-md'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="h-4 w-4" />
                  Added to order
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  Order Now
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default PizzaDetailsPage