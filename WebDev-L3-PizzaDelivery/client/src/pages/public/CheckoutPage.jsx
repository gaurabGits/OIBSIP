import { useEffect, useState } from 'react'
import { ArrowLeft, Banknote, Lock, MapPin } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../services/api'
import { useCart } from '../../context/CartContext'
import useAuth from '../../hooks/useAuth'
import { DELIVERY_FEE } from '../../utils/pricing'
import { getStoreStatus } from '../../services/adminService'

const ADDRESS_FIELDS = [
  {
    name: 'fullName',
    label: 'Full name',
    type: 'text',
    placeholder: 'John Smith',
  },
  {
    name: 'phone',
    label: 'Phone number',
    type: 'tel',
    placeholder: '98XXXXXXXX',
  },
  {
    name: 'line',
    label: 'Street address',
    type: 'text',
    placeholder: 'House no., street, area',
  },
  {
    name: 'city',
    label: 'City',
    type: 'text',
    placeholder: 'Lalitpur',
  },
]

const PAYMENT_METHODS = [
  {
    value: 'cash',
    label: 'Cash on delivery',
    description: 'Pay when your order arrives',
  },
  {
    value: 'esewa',
    label: 'Pay with eSewa',
    description: 'Secure eSewa test payment',
  },
]

function EsewaLogo() {
  return (
    <svg
      viewBox="0 0 32 32"
      className="h-full w-full"
      role="img"
      aria-label="eSewa"
    >
      <circle cx="16" cy="16" r="16" fill="#60BB46" />

      <path
        d="M9 16.6c0-4.2 3-7.2 7-7.2 3.6 0 6.3 2.4 6.7 6.1.1.6-.4 1.1-1 1.1H11.4c.3 2 1.9 3.3 4 3.3 1.3 0 2.4-.4 3.3-1.3.3-.3.8-.4 1.2-.1l.9.7c.4.3.4.9.1 1.3-1.3 1.4-3.1 2.2-5.5 2.2-4.1 0-7.4-3-7.4-6.1Zm3-1.4h7.9c-.4-1.9-1.9-3.1-3.9-3.1-2 0-3.6 1.2-4 3.1Z"
        fill="#fff"
      />
    </svg>
  )
}

function CheckoutPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { items, subtotal, deliveryFee, clearCart } = useCart()

  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    line: '',
    city: '',
  })

  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isStoreOpen, setIsStoreOpen] = useState(true)

  const total = subtotal + deliveryFee

  // Pre-fill name and phone from logged-in user
  useEffect(() => {
    if (!user) return

    setAddress((current) => ({
      ...current,
      fullName: current.fullName || user.fname || user.name || '',
      phone: current.phone || user.phone || '',
    }))
  }, [user])

  // Handle redirect back from eSewa
  useEffect(() => {
    const paymentState = searchParams.get('payment')

    if (paymentState === 'success') {
      clearCart()
      navigate('/orders?payment=success', { replace: true })
    } else if (paymentState === 'failure') {
      navigate('/orders?payment=failure', { replace: true })
    }
  }, [searchParams, clearCart, navigate])

  useEffect(() => {
    const syncStoreStatus = async () => {
      try {
        const data = await getStoreStatus()
        setIsStoreOpen(data.isOpen !== false)
      } catch {
        setIsStoreOpen(true)
      }
    }

    syncStoreStatus()
    const statusInterval = window.setInterval(syncStoreStatus, 5000)

    window.addEventListener('slicehouse-store-status', syncStoreStatus)

    return () => {
      window.clearInterval(statusInterval)
      window.removeEventListener('slicehouse-store-status', syncStoreStatus)
    }
  }, [])

  function updateAddress(event) {
    const { name, value } = event.target

    setAddress((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function redirectToEsewa(payment) {
    const form = document.createElement('form')

    form.method = 'POST'
    form.action = payment.paymentUrl

    Object.entries(payment.formData).forEach(([name, value]) => {
      const input = document.createElement('input')

      input.type = 'hidden'
      input.name = name
      input.value = value

      form.appendChild(input)
    })

    document.body.appendChild(form)
    form.submit()
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!items.length) return

    if (!isStoreOpen) {
      toast.error('We are busy right now. Please try again in a few hours.')
      return
    }

    setIsSubmitting(true)

    try {
      const { data } = await api.post('/order', {
        items,
        address,
        paymentMethod,
      })

      if (paymentMethod === 'esewa') {
        const { data: payment } = await api.post(
          '/payment/esewa/create',
          {
            orderId: data.order._id,
          }
        )

        redirectToEsewa(payment)
        return
      }

      clearCart()
      navigate('/orders?payment=success')
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Unable to place your order'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // Empty cart
  if (!items.length) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#FAF6EF] px-6 py-20 text-center text-[#171717]">
        <div>
          <h1 className="font-serif text-4xl font-semibold">
            Your cart is empty
          </h1>

          <Link
            to="/menu"
            className="mt-6 inline-flex rounded-lg bg-[#C1442D] px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
          >
            Browse menu
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#EFEAE1] px-4 pb-10 pt-20 text-[#171717] sm:px-6 lg:px-10 xl:px-14">
      <div className="mx-auto w-full mt-10 mb-10  max-w-7xl">

        <div className="mb-6 flex items-end justify-between px-1 sm:px-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#C1442D]">
              Almost there
            </p>

            <h1 className="font-serif text-3xl font-semibold">
              Checkout
            </h1>
          </div>

          <Link
            to="/cart"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#C1442D] transition hover:opacity-80"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to cart
          </Link>
        </div>

        {!isStoreOpen && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-xl border border-[#e8c27a] bg-[#fff7e8] px-4 py-4 text-[#8a571b]"
          >
            <span className="mt-0.5 text-lg" aria-hidden="true">!</span>
            <div>
              <p className="font-bold">We are busy right now</p>
              <p className="mt-1 text-sm">Please try again in a few hours. New orders are temporarily paused.</p>
            </div>
          </div>
        )}

        {/* Checkout Card */}
        <form
          onSubmit={handleSubmit}
          className="grid w-full overflow-hidden rounded-2xl bg-white shadow-xl lg:grid-cols-[minmax(0,1.30fr)_minmax(320px,0.8fr)]"
        >

          {/* LEFT SIDE */}
          <section className="px-5 py-7 sm:px-8 sm:py-8 lg:px-10 lg:py-9">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#C1442D]" />

              <h2 className="text-sm font-bold uppercase tracking-widest">
                Delivery address
              </h2>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {ADDRESS_FIELDS.map((field) => (
                <label key={field.name}>
                  <span className="text-xs font-semibold text-black/50">
                    {field.label}{' '}
                    <span className="text-[#C1442D]">*</span>
                  </span>

                  <input
                    required
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={address[field.name]}
                    onChange={updateAddress}
                    className="mt-1.5 h-11 w-full rounded-lg border border-black/10 bg-[#FAF6EF] px-3.5 text-sm outline-none transition placeholder:text-black/30 focus:border-[#C1442D] focus:ring-1 focus:ring-[#C1442D]/20"
                  />
                </label>
              ))}
            </div>

            {/* Payment Method */}
            <div className="mt-7">
              <h2 className="text-sm font-bold uppercase tracking-widest">
                Payment method{' '}
                <span className="text-[#C1442D]">*</span>
              </h2>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {PAYMENT_METHODS.map((method) => {
                  const isSelected =
                    paymentMethod === method.value

                  const isCash = method.value === 'cash'

                  return (
                    <label
                      key={method.value}
                      className={`flex min-h-[72px] cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-all ${
                        isSelected
                          ? isCash
                            ? 'border-[#D98B2B] bg-[#FFF7E8] text-[#8A571B] shadow-sm ring-1 ring-[#D98B2B]/20'
                            : 'border-[#60BB46] bg-[#60BB46]/10 text-[#2E7D20] shadow-sm ring-1 ring-[#60BB46]/20'
                          : 'border-black/10 bg-white hover:border-black/20 hover:bg-black/[0.01]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={isSelected}
                        onChange={(event) =>
                          setPaymentMethod(event.target.value)
                        }
                        className="shrink-0 accent-[#C1442D]"
                      />

                      {/* Payment Icon */}
                      {isCash ? (
                        <Banknote className="h-5 w-5 shrink-0" />
                      ) : (
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white p-0.5 shadow-sm ring-1 ring-[#60BB46]/20">
                          <EsewaLogo />
                        </span>
                      )}

                      <span className="min-w-0">
                        <span className="block text-sm font-bold">
                          {method.label}
                        </span>

                        <span className="mt-0.5 block text-xs opacity-70">
                          {method.description}
                        </span>
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Submit Button */}
            <button
              disabled={isSubmitting || !isStoreOpen}
              type="submit"
              className={`mt-7 flex h-12 w-full items-center justify-center rounded-xl text-sm font-bold text-white transition hover:opacity-95 disabled:cursor-wait disabled:opacity-60 ${
                paymentMethod === 'esewa'
                  ? 'bg-[#60BB46]'
                  : 'bg-gradient-to-r from-[#C1442D] to-[#E1673F]'
              }`}
            >
              {!isStoreOpen
                ? 'Ordering paused'
                : isSubmitting
                ? 'Processing...'
                : paymentMethod === 'cash'
                  ? 'Place order'
                  : 'Continue to eSewa'}
            </button>


            <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-black/40">
              <Lock className="h-3.5 w-3.5" />

              Your order and payment details are handled securely
            </p>
          </section>

          {/* RIGHT SIDE: ORDER SUMMARY */}
          <aside className="flex flex-col border-t border-black/5 bg-[#FAF6EF] px-5 py-7 sm:px-7 sm:py-8 lg:border-l lg:border-t-0 lg:px-8 lg:py-9">

            {/* Summary Header */}
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-semibold">
                Order summary
              </h2>

              <span className="rounded-full bg-[#C1442D]/10 px-2.5 py-1 text-[11px] font-bold text-[#C1442D]">
                {items.length}{' '}
                {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            {/* Items */}
            <div className="mt-4 max-h-[280px] min-h-0 space-y-2.5 overflow-y-auto rounded-xl bg-white p-4 shadow-sm">
              {items.map((item) => (
                <div
                  key={item.itemId}
                  className="flex items-start justify-between gap-4 text-sm"
                >
                  <span className="min-w-0 truncate text-black/60">
                    {item.name} × {item.quantity}
                  </span>

                  <span className="shrink-0 font-medium text-black/70">
                    Rs. {item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Details */}
            <div className="mt-3 rounded-xl bg-white p-4 shadow-sm">
              <div className="space-y-2.5 text-sm">

                <div className="flex justify-between text-black/60">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal}</span>
                </div>

                <div className="flex justify-between text-black/60">
                  <span>Delivery</span>
                  <span>Rs. {deliveryFee}</span>
                </div>

                <div className="flex justify-between border-t border-black/10 pt-3 text-base font-bold text-[#171717]">
                  <span>Total</span>
                  <span>Rs. {total}</span>
                </div>

              </div>
            </div>

            {/* Delivery Note */}
            <p className="mt-auto pt-5 text-center text-xs leading-relaxed text-black/40">
              Delivery fee is a flat Rs. {DELIVERY_FEE}.
            </p>
          </aside>
        </form>
      </div>
    </main>
  )
}

export default CheckoutPage

