import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ClipboardList,
  LogOut,
  Mail,
  Minus,
  Plus,
  RefreshCw,
  Shield,
  ShoppingCart,
  Trash2,
  UserCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getMyOrders } from "../../services/orderService";
import useAuth from "../../hooks/useAuth";
import { useCart } from "../../context/CartContext";

const MAX_ITEM_QUANTITY = 10;
const NAV_ITEMS = [
  { id: "account", label: "Account", icon: UserCircle },
  { id: "orders", label: "Orders", icon: ClipboardList },
  { id: "cart", label: "Cart", icon: ShoppingCart },
];

const dateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });
const priceFormatter = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date);
};

const formatPrice = (value) => `Rs. ${priceFormatter.format(Number(value) || 0)}`;

const formatRole = (role) => {
  const value = String(role || "user").trim();
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const STATUS_STYLES = {
  "order received": "bg-[#fff0df] text-[#C1442D]",
  "in kitchen": "bg-[#fdf3dd] text-[#9a6a35]",
  "sent to delivery": "bg-[#e8f0fb] text-[#2f5aa8]",
  delivered: "bg-[#e8f3e8] text-[#27663a]",
  cancelled: "bg-[#fdeceb] text-[#a13024]",
};

const getStatusStyle = (status) =>
  STATUS_STYLES[String(status || "").toLowerCase()] ?? "bg-[#f0ece6] text-[#5c4f42]";

function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
    items,
    itemCount,
    subtotal,
    deliveryFee,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const [activeSection, setActiveSection] = useState("account");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [ordersLoaded, setOrdersLoaded] = useState(false);

  const bodyRef = useRef(null);
  const skipFirstScroll = useRef(true);

  const displayName = useMemo(
    () => (user?.fname || user?.name || "User").trim() || "User",
    [user?.fname, user?.name]
  );

  const initials = useMemo(() => {
    const letters = displayName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("");
    return letters.toUpperCase() || "U";
  }, [displayName]);

  /* orders */

  const loadOrders = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setOrdersLoading(true);
      setOrdersError("");
    }
    try {
      const data = await getMyOrders();
      setOrders(Array.isArray(data?.orders) ? data.orders : []);
    } catch (error) {
      if (!silent) {
        setOrdersError(
          error?.response?.data?.message || "We could not load your orders."
        );
      }
    } finally {
      if (!silent) {
        setOrdersLoading(false);
      }
      setOrdersLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!ordersLoaded) {
      loadOrders();
    }
  }, [ordersLoaded, loadOrders]);

  useEffect(() => {
    if (!ordersLoaded) {
      return undefined;
    }

    const refreshInterval = window.setInterval(() => {
      loadOrders({ silent: true });
    }, 15000);

    return () => window.clearInterval(refreshInterval);
  }, [activeSection, ordersLoaded, loadOrders]);

  // Reset the panel's own scroll position whenever the tab changes.
  useEffect(() => {
    if (skipFirstScroll.current) {
      skipFirstScroll.current = false;
      return;
    }
    bodyRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [activeSection]);

  /* logout */

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  /* headings */

  const heading = useMemo(() => {
    if (activeSection === "orders") {
      return {
        title: "Order history",
        description:
          ordersLoaded && orders.length > 0
            ? `${orders.length} ${orders.length === 1 ? "order" : "orders"} placed so far.`
            : "Track your latest SliceHouse orders.",
      };
    }
    if (activeSection === "cart") {
      return {
        title: "My cart",
        description:
          itemCount > 0
            ? `${itemCount} ${itemCount === 1 ? "item" : "items"} ready for checkout.`
            : "Nothing in your cart yet.",
      };
    }
    return {
      title: "Account details",
      description: "Your personal information and account settings.",
    };
  }, [activeSection, ordersLoaded, orders.length, itemCount]);

  /* bodies */

  const renderAccountBody = () => (
    <>
      <div className="flex items-center gap-4 border-b border-[#eee5d9] pb-6">
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt=""
            className="h-14 w-14 shrink-0 rounded-full object-cover sm:h-16 sm:w-16"
          />
        ) : (
          <div
            aria-hidden="true"
            className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#C1442D] text-lg font-black text-white sm:h-16 sm:w-16 sm:text-xl"
          >
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <h2 className="truncate text-lg font-extrabold text-[#1a1a1a] sm:text-xl">
            {displayName}
          </h2>
          <p className="mt-1 truncate text-sm text-[#806f60]">
            {user?.email || "SliceHouse customer"}
          </p>
        </div>
      </div>

      <dl className="mt-6 grid gap-3 sm:grid-cols-2">
        <Detail label="Full name" value={displayName} />
        <Detail label="Email" value={user?.email || "—"} icon={Mail} />
        <Detail label="Phone" value={user?.phone || "—"} />
        <Detail label="Account type" value={formatRole(user?.role)} icon={Shield} />
      </dl>
    </>
  );

  const renderCartBody = () => {
    if (items.length === 0) {
      return (
        <EmptyState
          icon={ShoppingCart}
          text="Your cart is empty."
          actionLabel="Browse the menu"
          onAction={() => navigate("/menu")}
        />
      );
    }

    return (
      <div className="flex flex-col">
        <ul className="space-y-3">
          {items.map((item) => {
            const lineTotal = Number(item.price || 0) * item.quantity;
            const atMin = item.quantity <= 1;
            const atMax = item.quantity >= MAX_ITEM_QUANTITY;

            return (
              <li
                key={item.itemId}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-[#eee5d9] p-3"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt=""
                    className="h-14 w-14 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-[#fff0df] text-[11px] font-bold text-[#C1442D]"
                  >
                    Pizza
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-[#1a1a1a]">
                    {item.name}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-[#806f60]">
                    {[item.size, item.dough].filter(Boolean).join(" · ")}
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#C1442D]">
                    {formatPrice(lineTotal)}
                  </p>
                </div>

                <div className="flex w-full items-center justify-between gap-2 sm:w-auto">
                  <div className="flex items-center gap-0.5 rounded-full border border-[#eee5d9] p-0.5">
                    <button
                      type="button"
                      aria-label={`Decrease quantity of ${item.name}`}
                      onClick={() => updateQuantity(item.itemId, item.quantity - 1)}
                      disabled={atMin}
                      className="grid h-8 w-8 place-items-center rounded-full text-[#C1442D] transition hover:bg-[#FAF6EF] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>

                    <span
                      aria-live="polite"
                      className="w-6 text-center text-sm font-bold tabular-nums"
                    >
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      aria-label={`Increase quantity of ${item.name}`}
                      onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                      disabled={atMax}
                      className="grid h-8 w-8 place-items-center rounded-full text-[#C1442D] transition hover:bg-[#FAF6EF] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    aria-label={`Remove ${item.name} from cart`}
                    onClick={() => removeFromCart(item.itemId)}
                    className="grid h-9 w-9 place-items-center rounded-full text-[#806f60] transition hover:bg-[#fff4f1] hover:text-[#C1442D] sm:ml-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-5 border-t border-[#eee5d9] pt-4">
          <div className="w-full text-sm sm:ml-auto sm:max-w-xs">
            <div className="flex justify-between text-[#806f60]">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatPrice(subtotal)}</span>
            </div>
            <div className="mt-2 flex justify-between text-[#806f60]">
              <span>Delivery</span>
              <span className="tabular-nums">{formatPrice(deliveryFee)}</span>
            </div>
            <div className="mt-3 flex justify-between border-t border-dashed border-[#eee5d9] pt-3 text-base font-extrabold">
              <span>Total</span>
              <span className="tabular-nums">
                {formatPrice(subtotal + deliveryFee)}
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigate("/checkout")}
              className="mt-4 flex h-11 w-full items-center justify-center rounded-xl bg-[#C1442D] text-sm font-bold text-white transition hover:bg-[#9c3320] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C1442D]"
            >
              Go to checkout
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderOrdersBody = () => {
    if (ordersLoading) {
      return (
        <div className="space-y-3" aria-hidden="true">
          {[0, 1, 2].map((row) => (
            <div key={row} className="h-[76px] animate-pulse rounded-xl bg-[#FAF6EF]" />
          ))}
        </div>
      );
    }

    if (ordersError) {
      return (
        <div
          role="alert"
          className="rounded-xl border border-[#efb6a8] bg-[#fff4f1] p-6 text-center"
        >
          <p className="text-sm font-bold text-[#8f2f20]">{ordersError}</p>
          <button
            type="button"
            onClick={loadOrders}
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#C1442D] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#a93724]"
          >
            <RefreshCw className="h-4 w-4" /> Try again
          </button>
        </div>
      );
    }

    if (orders.length === 0) {
      return (
        <EmptyState
          icon={ClipboardList}
          text="Your orders will appear here."
          actionLabel="Browse the menu"
          onAction={() => navigate("/menu")}
        />
      );
    }

    return (
      <ul className="divide-y divide-[#eee5d9] rounded-xl border border-[#eee5d9]">
        {orders.map((order) => (
          <li
            key={order._id}
            className="border-b border-[#eee5d9] last:border-b-0"
          >
            <Link
              to={`/orders?order=${encodeURIComponent(order._id)}`}
              className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 p-4 transition hover:bg-[#fffaf2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#C1442D]"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-[#1a1a1a]">
                  Order #{String(order._id || "").slice(-7).toUpperCase()}
                </p>
                <p className="mt-1 text-xs text-[#806f60]">
                  {formatDate(order.createdAt)}
                  {order.items?.length
                    ? ` · ${order.items.length} ${order.items.length === 1 ? "item" : "items"}`
                    : ""}
                </p>
                <StatusPill status={order.status} className="mt-2" />
              </div>
              <p className="shrink-0 text-sm font-extrabold tabular-nums text-[#1a1a1a]">
                {formatPrice(order.totalPrice)}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  const renderBody = () => {
    switch (activeSection) {
      case "orders":
        return renderOrdersBody();
      case "cart":
        return renderCartBody();
      case "account":
      default:
        return renderAccountBody();
    }
  };

  return (
    <section className="bg-[#FAF6EF] px-4 pt-[104px] sm:px-6 sm:pt-[120px]">
      <div className="mx-auto w-full max-w-6xl pb-4 sm:pb-6">

        <div
          className="flex min-h-[calc(100dvh-120px)] flex-col gap-3
            sm:min-h-[calc(100dvh-140px)] sm:gap-4
            lg:grid lg:h-[calc(100dvh-160px)] lg:min-h-[460px]
            lg:grid-cols-[230px_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)] lg:gap-5"
        >
          {/*  Sidebar (lg) / tab strip (mobile)  */}
<aside
  className="flex shrink-0 items-center gap-2 rounded-2xl border border-[#eee5d9] bg-white p-2 shadow-sm
    lg:min-h-0 lg:flex-col lg:items-stretch lg:gap-0 lg:overflow-hidden lg:p-3"
>
  <div className="hidden shrink-0 border-b border-[#eee5d9] px-3 pb-4 pt-2 lg:block">
    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C1442D]">
      My account
    </p>
    <p className="mt-2 truncate text-sm font-bold text-[#1a1a1a]">
      {displayName}
    </p>
  </div>

  <nav
    aria-label="Dashboard sections"
    className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto py-1 px-1
      touch-pan-x overscroll-x-contain scroll-smooth snap-x snap-mandatory
      lg:min-h-0 lg:flex-col lg:items-stretch lg:gap-1 lg:overflow-x-visible lg:overflow-y-auto lg:py-3 lg:px-0 lg:snap-none
      [-ms-overflow-style:none] [scrollbar-width:none]
      [&::-webkit-scrollbar]:hidden"
  >
    {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
      const isActive = activeSection === id;
      return (
        <button
          key={id}
          type="button"
          onClick={() => setActiveSection(id)}
          aria-current={isActive ? "true" : undefined}
          className={`flex shrink-0 snap-start items-center gap-2 rounded-full px-3.5 py-2.5 text-sm transition
            lg:w-full lg:gap-3 lg:rounded-xl lg:px-3 lg:py-3 ${
              isActive
                ? "bg-[#C1442D] font-bold text-white"
                : "font-medium text-[#4f4034] hover:bg-amber-100 hover:text-[#C1442D]"
            }`}
        >
          <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{label}</span>
          {id === "cart" && itemCount > 0 && (
            <span className="text-xs lg:ml-auto">({itemCount})</span>
          )}
        </button>
      );
    })}
  </nav>

  <button
    type="button"
    onClick={handleLogout}
    aria-label="Log out"
    className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[#C1442D] transition hover:bg-[#fff4f1] hover:text-[#9c3320]
      lg:flex lg:h-auto lg:w-full lg:items-center lg:justify-start lg:gap-3 lg:rounded-none lg:border-t lg:border-[#eee5d9] lg:px-3 lg:pt-4 lg:text-sm lg:font-bold lg:hover:bg-transparent"
  >
    <LogOut className="h-4 w-4" aria-hidden="true" />
    <span className="hidden lg:inline">Log out</span>
  </button>
</aside>

          {/* Main panel */}
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#eee5d9] bg-white shadow-sm lg:min-h-0">
            <header className="shrink-0 border-b border-[#eee5d9] p-5 sm:p-6 lg:p-8 lg:pb-5">
              <h1 className="text-xl font-extrabold text-[#1a1a1a] sm:text-2xl lg:text-3xl">
                {heading.title}
              </h1>
              <p className="mt-1.5 text-sm text-[#806f60]">{heading.description}</p>
            </header>

            <main
              ref={bodyRef}
              className="min-h-0 flex-1 overflow-y-auto overscroll-auto p-5 sm:p-6 lg:p-8 lg:pt-6
                [&::-webkit-scrollbar]:w-2
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-thumb]:bg-[#dfd2c3]
                hover:[&::-webkit-scrollbar-thumb]:bg-[#c9b7a2]"
            >
              {renderBody()}
            </main>
          </div>
        </div>
      </div>
    </section>
  );
}

/*  Presentational bits */
function Detail({ label, value, icon: Icon, wide = false }) {
  return (
    <div className={`rounded-xl bg-[#FAF6EF] p-4 ${wide ? "sm:col-span-2" : ""}`}>
      <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#9a6a35]">
        {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
        {label}
      </dt>
      <dd className="mt-2 break-words text-sm font-semibold text-[#1a1a1a]">{value}</dd>
    </div>
  );
}

function StatusPill({ status, className = "" }) {
  const label = status || "Order Received";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${getStatusStyle(
        label
      )} ${className}`}
    >
      {label}
    </span>
  );
}

function EmptyState({ icon: Icon, text, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-[#dfd2c3] bg-[#FAF6EF] px-5 py-12 text-center">
      {Icon && (
        <div className="grid h-12 w-12 place-items-center rounded-full bg-white text-[#C1442D]">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      )}
      <p className="text-sm font-semibold text-[#806f60]">{text}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-1 rounded-full bg-[#C1442D] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#9c3320]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default DashboardPage;