import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

function CartPage() {
  const navigate = useNavigate()
  const { items, subtotal, deliveryFee, updateQuantity, removeFromCart } = useCart()
  const customItems = items.filter((item) => item.isCustom)
  const regularItems = items.filter((item) => !item.isCustom)
  const total = subtotal + deliveryFee

  const renderItem = (item) => (
    <article key={item.itemId} className="flex gap-4 rounded-xl border border-black/5 bg-[#FAF6EF] p-4 sm:items-center">
      {item.image ? (
        <img src={item.image} alt={item.name} className="h-20 w-20 shrink-0 rounded-lg object-cover" />
      ) : (
        <div className="grid h-20 w-20 shrink-0 place-items-center rounded-lg bg-[#C1442D]/10 text-center text-xs font-bold text-[#C1442D]">
          Custom<br />pizza
        </div>
      )}

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-bold">{item.name}</h3>
        <p className="mt-1 text-xs font-semibold text-black/45">{item.size} · {item.dough}</p>
        {item.ingredients && <p className="mt-1.5 line-clamp-1 text-xs text-black/40">{item.ingredients}</p>}
        <p className="mt-2 text-sm font-bold text-[#C1442D]">Rs. {item.price * item.quantity}</p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-3">
        <div className="flex h-9 items-center overflow-hidden rounded-lg border border-[#C1442D]/15 bg-white">
          <button
            type="button"
            aria-label={`Decrease quantity of ${item.name}`}
            onClick={() => updateQuantity(item.itemId, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="grid h-full w-8 place-items-center text-black/60 transition hover:bg-[#C1442D]/10 hover:text-[#C1442D] disabled:opacity-30"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-7 text-center text-sm font-bold tabular-nums">{item.quantity}</span>
          <button
            type="button"
            aria-label={`Increase quantity of ${item.name}`}
            onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
            disabled={item.quantity >= 10}
            className="grid h-full w-8 place-items-center text-black/60 transition hover:bg-[#C1442D]/10 hover:text-[#C1442D] disabled:opacity-30"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <button
          type="button"
          aria-label={`Remove ${item.name} from cart`}
          onClick={() => removeFromCart(item.itemId)}
          className="p-1 text-black/35 transition hover:text-[#C1442D]"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </article>
  )

  if (items.length === 0) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#EFEAE1] px-6 text-center text-[#171717]">
        <div>
          <ShoppingBag className="mx-auto h-12 w-12 text-[#C1442D]" />
          <h1 className="mt-5 font-serif text-4xl font-semibold">Your cart is empty</h1>
          <p className="mt-3 text-black/55">Choose something delicious from the menu.</p>
          <Link
            to="/menu"
            className="mt-7 inline-flex rounded-xl bg-gradient-to-r from-[#C1442D] to-[#E1673F] px-5 py-3 text-sm font-bold text-white transition hover:opacity-95"
          >
            Browse menu
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#EFEAE1] px-4 pb-16 pt-[104px] text-[#171717] sm:px-6 sm:pt-[120px]">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-4">
          <p className="text-sm font-semibold text-[#C1442D]">Your order</p>
          <h1 className="font-serif text-3xl font-semibold">Cart</h1>
        </div>

        <div className="grid grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-xl lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* Left: items */}
          <section className="max-h-[620px] overflow-y-auto px-8 py-8 sm:px-10 sm:py-9">
            {customItems.length > 0 && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#171717]">Custom pizzas</h2>
                <p className="mt-1 text-xs text-black/40">Your own combinations, made to order.</p>
                <div className="mt-4 space-y-3">{customItems.map(renderItem)}</div>
              </div>
            )}

            {regularItems.length > 0 && (
              <div className={customItems.length > 0 ? 'mt-9' : ''}>
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#171717]">Regular pizzas</h2>
                <p className="mt-1 text-xs text-black/40">Classic favorites from the SliceHouse menu.</p>
                <div className="mt-4 space-y-3">{regularItems.map(renderItem)}</div>
              </div>
            )}
          </section>

          {/* Right: summary */}
          <aside className="flex flex-col bg-[#FAF6EF] px-6 py-8 sm:px-7 sm:py-9">
            <h2 className="font-serif text-2xl font-semibold">Order summary</h2>

            <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-black/60">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal}</span>
                </div>
                <div className="flex justify-between text-black/60">
                  <span>Delivery</span>
                  <span>Rs. {deliveryFee}</span>
                </div>
                <div className="flex justify-between border-t border-black/10 pt-2.5 text-base font-bold">
                  <span>Total</span>
                  <span>Rs. {total}</span>
                </div>
              </div>
            </div>

            <p className="mt-4 mb-6 text-xs text-black/40">Delivery and taxes are confirmed at checkout.</p>

            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="mt-auto flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C1442D] to-[#E1673F] text-sm font-bold text-white transition hover:opacity-95"
            >
              <ShoppingBag className="h-4 w-4" />
              Checkout
            </button>

            <Link to="/menu" className="mt-4 text-center text-sm font-bold text-[#C1442D]">
              Continue shopping
            </Link>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default CartPage