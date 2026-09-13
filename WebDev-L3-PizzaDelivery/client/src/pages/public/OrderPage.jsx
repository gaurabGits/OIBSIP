import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownUp,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChefHat,
  ChevronDown,
  Clock3,
  CreditCard,
  MapPin,
  Package,
  PackageCheck,
  RefreshCw,
  Search,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import { cancelMyOrder, getMyOrders } from "../../services/orderService";
import { formatNpr } from "../../utils/pricing";

/* CONSTANTS */

const STATUS_META = {
  "Order Received": {
    label: "Order received",
    color: "text-orange-600",
    bg: "bg-orange-50",
    icon: Clock3,
  },
  "In Kitchen": {
    label: "In kitchen",
    color: "text-amber-600",
    bg: "bg-amber-50",
    icon: ChefHat,
  },
  "Sent to Delivery": {
    label: "Out for delivery",
    color: "text-blue-600",
    bg: "bg-blue-50",
    icon: Truck,
  },
  Delivered: {
    label: "Delivered",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    icon: CheckCircle2,
  },
  Cancelled: {
    label: "Cancelled",
    color: "text-red-600",
    bg: "bg-red-50",
    icon: XCircle,
  },
};

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "highest", label: "Highest total" },
  { value: "lowest", label: "Lowest total" },
];

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

/* HELPERS */

const formatDate = (date) =>
  new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
    new Date(date)
  );

const formatPrice = (price) => formatNpr(price);

const getOrderNumber = (order) =>
  order._id?.slice(-7).toUpperCase() || "-------";

const getStatus = (order) => order.status || "Order Received";

const isActive = (order) => {
  const status = getStatus(order);
  return status !== "Delivered" && status !== "Cancelled";
};

const getPaymentStatusLabel = (order) => {
  if (order.status === "Cancelled" && order.paymentMethod === "cash") {
    return "Payment not collected";
  }
  return order.paymentStatus || "Pending";
};

const getCancellationLabel = (order) => {
  if (order.cancelledBy === "user") return "Cancelled by you";
  if (order.cancelledBy === "system" || order.paymentStatus === "Failed") {
    return "Cancelled automatically after payment failure";
  }
  return "Cancelled";
};

const getItems = (order) => {
  if (order.items?.length) {
    return order.items.map((item) => ({
      key: item.itemId,
      name: item.name,
      detail: [item.size, item.dough].filter(Boolean).join(" · "),
      quantity: item.quantity,
      price: item.price,
      image: item.image,
    }));
  }

  const ingredients = [
    order.pizza?.base,
    order.pizza?.sauce,
    order.pizza?.cheese,
    ...(order.pizza?.vegetables || []),
  ].filter(Boolean);

  if (ingredients.length) {
    return [
      {
        key: order._id,
        name: "Custom pizza",
        detail: ingredients.map((i) => i.name).join(" · "),
        quantity: 1,
        price: order.totalPrice,
      },
    ];
  }

  return [
    {
      key: order._id,
      name: "Pizza order",
      detail: "Order details unavailable",
      quantity: 1,
      price: order.totalPrice,
    },
  ];
};


/* SMALL PIECES */
function ItemImage({ item }) {
  if (item.image) {
    return (
      <img
        src={item.image}
        alt=""
        className="h-11 w-11 shrink-0 rounded-xl object-cover"
      />
    );
  }

  return (
    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-orange-100 text-orange-600">
      <ShoppingBag className="h-5 w-5" />
    </div>
  );
}

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META["Order Received"];
  const Icon = meta.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${meta.bg} ${meta.color}`}
    >
      <Icon className="h-3 w-3" />
      {meta.label}
    </span>
  );
}

function OrderTimeline({ status }) {
  if (status === "Cancelled") {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-xs font-bold text-red-600">
        <XCircle className="h-4 w-4 shrink-0" />
        Order cancelled — it will not be prepared or delivered.
      </div>
    );
  }

  const steps = [
    { key: "Order Received", label: "Received", icon: Package },
    { key: "In Kitchen", label: "Kitchen", icon: ChefHat },
    { key: "Sent to Delivery", label: "Delivery", icon: Truck },
    { key: "Delivered", label: "Delivered", icon: Check },
  ];

  const currentIndex = steps.findIndex((s) => s.key === status);

  return (
    <div className="flex items-start">
      {steps.map((step, i) => {
        const done = i <= currentIndex;
        const Icon = step.icon;

        return (
          <div key={step.key} className="flex flex-1 items-start last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`grid h-8 w-8 place-items-center rounded-full transition ${
                  done
                    ? "bg-[#C1442D] text-white"
                    : "bg-stone-100 text-stone-400"
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span
                className={`text-[10px] font-bold ${
                  done ? "text-stone-700" : "text-stone-400"
                }`}
              >
                {step.label}
              </span>
            </div>

            {i < steps.length - 1 && (
              <div
                className={`mx-1 mt-4 h-0.5 flex-1 rounded-full ${
                  i < currentIndex ? "bg-[#C1442D]" : "bg-stone-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* FILTER BAR */

function FilterBar({ query, setQuery, sortBy, setSortBy, filter, setFilter, counts }) {
  return (
    <div className="space-y-3">
      {/* STATUS PILLS */}

      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {STATUS_FILTERS.map((item) => {
          const active = filter === item.value;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition sm:text-sm ${
                active
                  ? "bg-stone-900 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {item.label}
              <span
                className={`rounded-full px-1.5 text-[10px] ${
                  active ? "bg-white/20 text-white" : "bg-white text-stone-500"
                }`}
              >
                {counts[item.value]}
              </span>
            </button>
          );
        })}
      </div>

      {/* SEARCH + SORT */}

      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search order number..."
            className="h-11 w-full rounded-xl border border-stone-200 bg-white pl-10 pr-3 text-sm font-medium text-stone-800 outline-none placeholder:text-stone-400 focus:border-[#C1442D] focus:ring-2 focus:ring-[#C1442D]/10"
          />
        </label>

        <div className="relative sm:w-48">
          <ArrowDownUp className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-11 w-full appearance-none rounded-xl border border-stone-200 bg-white pl-10 pr-8 text-sm font-bold text-stone-700 outline-none focus:border-[#C1442D] focus:ring-2 focus:ring-[#C1442D]/10"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        </div>
      </div>
    </div>
  );
}

/* ORDER DETAILS */

function OrderDetails({ order, items, onCancel, cancelling }) {
  const paymentStatus = order.paymentStatus || "Pending";
  const paymentStatusLabel = getPaymentStatusLabel(order);
  const paymentIsFailed = paymentStatus === "Failed";
  const paymentIsPaid = paymentStatus === "Paid";
  const paymentIsCancelled =
    order.status === "Cancelled" && order.paymentMethod === "cash";

  const canCancel =
    order.status === "Order Received" &&
    Date.now() - new Date(order.createdAt).getTime() <= 20 * 60 * 1000;

  return (
    <div className="border-t border-stone-100 px-4 pb-5 pt-4 sm:px-5">
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        {/* LEFT */}

        <div className="space-y-5">
          <OrderTimeline status={getStatus(order)} />

          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Items
            </p>

            <ul className="divide-y divide-stone-100">
              {items.map((item) => (
                <li key={item.key} className="flex items-center gap-3 py-2.5">
                  <ItemImage item={item} />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-stone-900">
                      {item.name}
                    </p>
                    <p className="truncate text-xs text-stone-500">
                      {item.detail || "Classic pizza"}
                    </p>
                    <p className="mt-0.5 text-[11px] font-bold text-stone-400">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="text-sm font-black text-stone-900">
                    {formatPrice((item.price || 0) * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-3 flex items-center justify-between border-t border-stone-100 pt-3">
              <span className="text-sm font-bold text-stone-500">Total</span>
              <span className="text-lg font-black text-stone-900">
                {formatPrice(order.totalPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT */}

        <div className="space-y-5">
          {/* PAYMENT */}

          <div>
            <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-400">
              <CreditCard className="h-3.5 w-3.5" /> Payment
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Method</span>
                <span className="font-bold text-stone-900">
                  {order.paymentMethod === "esewa" ? "eSewa" : "Cash on delivery"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-stone-500">Status</span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    paymentIsPaid
                      ? "bg-emerald-50 text-emerald-600"
                      : paymentIsFailed || paymentIsCancelled
                      ? "bg-red-50 text-red-600"
                      : "bg-orange-50 text-orange-600"
                  }`}
                >
                  {paymentIsPaid ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : paymentIsFailed || paymentIsCancelled ? (
                    <XCircle className="h-3 w-3" />
                  ) : (
                    <Clock3 className="h-3 w-3" />
                  )}
                  {paymentStatusLabel}
                </span>
              </div>

              {paymentIsFailed && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium leading-relaxed text-red-600">
                  Reason:{" "}
                  {order.paymentFailureReason ||
                    "eSewa did not complete the payment."}
                </p>
              )}

              {order.status === "Cancelled" && paymentStatus !== "Failed" && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium leading-relaxed text-red-600">
                  {getCancellationLabel(order)}
                  {order.cancellationReason
                    ? `: ${order.cancellationReason}`
                    : "."}
                </p>
              )}
            </div>
          </div>

          {/* DELIVERY */}

          <div>
            <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-400">
              <MapPin className="h-3.5 w-3.5" /> Delivery
            </p>
            <p className="text-sm font-bold text-stone-900">
              {order.address?.fullName || "—"}
            </p>
            {order.address && (
              <p className="mt-0.5 text-sm leading-relaxed text-stone-500">
                {order.address.line}, {order.address.city}
              </p>
            )}
          </div>

          {/* CANCEL ACTIONS */}

          {order.status === "Order Received" && (
            <div className="flex flex-col gap-3 border-t border-stone-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-relaxed text-stone-500">
                {canCancel
                  ? "You can cancel within 20 minutes, before it enters the kitchen."
                  : "Cancellation window has closed."}
              </p>

              {canCancel ? (
                <button
                  type="button"
                  onClick={() => onCancel(order)}
                  disabled={cancelling}
                  className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-red-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-red-600 disabled:cursor-wait disabled:opacity-60"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  {cancelling ? "Cancelling..." : "Cancel order"}
                </button>
              ) : (
                <span className="text-xs font-bold text-stone-400">
                  Window closed
                </span>
              )}
            </div>
          )}

          {order.status === "In Kitchen" && (
            <div className="flex items-center gap-2.5 border-t border-stone-100 pt-4 text-xs font-bold text-amber-700">
              <ChefHat className="h-4 w-4 shrink-0 text-amber-600" />
              Your pizza is being prepared and can no longer be cancelled.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ORDER CARD */

function OrderCard({ order, expanded, onToggle, onCancel, cancelling }) {
  const items = getItems(order);
  const status = getStatus(order);

  return (
    <article
      className={`overflow-hidden rounded-2xl border bg-white transition ${
        expanded
          ? "border-orange-300"
          : "border-stone-200 hover:border-stone-300"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 p-4 text-left sm:gap-4"
      >
        {/* MAIN INFO */}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-black text-stone-900 sm:text-base">
              #{getOrderNumber(order)}
            </h2>
            <StatusBadge status={status} />
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium text-stone-400 sm:text-xs">
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {formatDate(order.createdAt)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Package className="h-3 w-3" />
              {items.length} item{items.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* THUMBNAILS */}

        {items.length > 0 && (
          <div className="hidden items-center -space-x-2 sm:flex">
            {items.slice(0, 3).map((item) => (
              <div
                key={item.key}
                className="rounded-xl bg-white p-0.5 ring-1 ring-stone-200"
              >
                <ItemImage item={item} />
              </div>
            ))}
            {items.length > 3 && (
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-stone-100 text-[11px] font-black text-stone-500 ring-2 ring-white">
                +{items.length - 3}
              </div>
            )}
          </div>
        )}

        {/* TOTAL */}

        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
            Total
          </p>
          <p className="text-base font-black text-stone-900 sm:text-lg">
            {formatPrice(order.totalPrice)}
          </p>
        </div>

        {/* CHEVRON */}

        <div
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition ${
            expanded ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-500"
          }`}
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {expanded && (
        <OrderDetails
          order={order}
          items={items}
          onCancel={onCancel}
          cancelling={cancelling}
        />
      )}
    </article>
  );
}

/* STATES */

function LoadingOrders() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-20 animate-pulse rounded-2xl border border-stone-100 bg-white"
        />
      ))}
    </div>
  );
}

function OrderError({ error, onRetry }) {
  return (
    <div className="rounded-2xl border border-red-100 bg-white p-10 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-red-50 text-red-500">
        <XCircle className="h-5 w-5" />
      </div>
      <h2 className="mt-4 text-lg font-black text-stone-900">
        Something went wrong
      </h2>
      <p className="mx-auto mt-1.5 max-w-sm text-sm text-stone-500">{error}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-stone-800"
      >
        <RefreshCw className="h-4 w-4" />
        Try again
      </button>
    </div>
  );
}

function EmptyOrders({ onBrowse }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white px-6 py-16 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-orange-50 text-[#C1442D]">
        <ShoppingBag className="h-7 w-7" />
      </div>
      <h2 className="mt-5 text-xl font-black text-stone-900">No orders yet</h2>
      <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-stone-500">
        Your order history is empty. Find something delicious and place your
        first order.
      </p>
      <button
        type="button"
        onClick={onBrowse}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#C1442D] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#c1432ddc]"
      >
        Browse menu
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function NoResults({ onClear }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white px-6 py-14 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-stone-100 text-stone-400">
        <Search className="h-5 w-5" />
      </div>
      <h2 className="mt-4 text-lg font-black text-stone-900">
        No matching orders
      </h2>
      <p className="mt-1.5 text-sm text-stone-500">
        Try changing your search or filters.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-4 text-sm font-bold text-orange-600 hover:text-orange-700"
      >
        Clear all filters
      </button>
    </div>
  );
}

/* MAIN PAGE */

function OrderPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);

  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filter, setFilter] = useState("all");
  const [cancellingId, setCancellingId] = useState("");

  /* LOAD ORDERS */

  const loadOrders = async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);

    setError("");

    try {
      const data = await getMyOrders();
      setOrders(Array.isArray(data?.orders) ? data.orders : []);
    } catch (err) {
      setError(
        err.response?.data?.message || "We could not load your orders."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  /* AUTO REFRESH */

  useEffect(() => {
    const interval = window.setInterval(() => loadOrders(true), 5000);
    return () => window.clearInterval(interval);
  }, []);

  /* OPEN ORDER FROM URL */

  useEffect(() => {
    const orderId = searchParams.get("order");
    if (orderId && orders.some((o) => o._id === orderId)) {
      setExpandedOrder(orderId);
    }
  }, [orders, searchParams]);

  /* PAYMENT REDIRECT */

  useEffect(() => {
    const payment = searchParams.get("payment");

    if (payment === "success") {
      toast.success("Payment successful. Your order is confirmed.", {
        id: "order-payment-success",
      });
      navigate("/orders", { replace: true });
    }

    if (payment === "failure") {
      const reason =
        searchParams.get("reason") || "eSewa did not complete the payment.";
      toast.error(`Payment failed: ${reason}`, {
        id: "order-payment-failure",
      });
      navigate("/orders", { replace: true });
    }
  }, [navigate, searchParams]);

  /* COUNTS */

  const counts = useMemo(
    () => ({
      all: orders.length,
      active: orders.filter(isActive).length,
      delivered: orders.filter((o) => getStatus(o) === "Delivered").length,
      cancelled: orders.filter((o) => getStatus(o) === "Cancelled").length,
    }),
    [orders]
  );

  /* FILTER + SORT */

  const visibleOrders = useMemo(() => {
    const search = query.trim().toUpperCase();

    const filtered = orders.filter((order) => {
      if (!getOrderNumber(order).includes(search)) return false;

      const status = getStatus(order);

      if (filter === "active" && !isActive(order)) return false;
      if (filter === "delivered" && status !== "Delivered") return false;
      if (filter === "cancelled" && status !== "Cancelled") return false;

      return true;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "highest") return b.totalPrice - a.totalPrice;
      if (sortBy === "lowest") return a.totalPrice - b.totalPrice;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [orders, query, sortBy, filter]);

  /* CLEAR FILTERS */

  const clearFilters = () => {
    setQuery("");
    setFilter("all");
    setSortBy("newest");
  };

  /* CANCEL ORDER */

  const handleCancelOrder = async (order) => {
    if (!window.confirm("Cancel this order?")) return;

    setCancellingId(order._id);

    try {
      const data = await cancelMyOrder(order._id);

      setOrders((current) =>
        current.map((item) =>
          item._id === order._id ? { ...item, ...data.order } : item
        )
      );

      toast.success("Order cancelled");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Could not cancel this order"
      );
    } finally {
      setCancellingId("");
    }
  };

  return (
    <section className="min-h-svh bg-[#faf9f7] px-4 pb-20 pt-24 sm:px-6 lg:pt-28">
      <div className="mx-auto w-full max-w-4xl">
        {/* HEADER */}

        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-[11px] font-bold text-orange-600">
              <PackageCheck className="h-3 w-3" />
              Your orders
            </div>
            <h1 className="text-2xl font-black tracking-tight text-stone-900 sm:text-3xl">
              Order history
            </h1>
            <p className="mt-1.5 max-w-lg text-sm text-stone-500">
              Track your pizzas, check payments, and view everything you've
              ordered.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadOrders(true)}
            disabled={refreshing}
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-bold text-stone-700 transition hover:border-stone-300 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing" : "Refresh"}
          </button>
        </header>

        {/* FILTERS */}

        {!loading && !error && orders.length > 0 && (
          <div className="mb-5">
            <FilterBar
              query={query}
              setQuery={setQuery}
              sortBy={sortBy}
              setSortBy={setSortBy}
              filter={filter}
              setFilter={setFilter}
              counts={counts}
            />
          </div>
        )}

        {/* CONTENT */}

        {loading && <LoadingOrders />}

        {!loading && error && (
          <OrderError error={error} onRetry={() => loadOrders()} />
        )}

        {!loading && !error && orders.length === 0 && (
          <EmptyOrders onBrowse={() => navigate("/menu")} />
        )}

        {!loading &&
          !error &&
          orders.length > 0 &&
          visibleOrders.length === 0 && <NoResults onClear={clearFilters} />}

        {!loading && !error && visibleOrders.length > 0 && (
          <div className="space-y-3">
            {visibleOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                expanded={expandedOrder === order._id}
                onToggle={() =>
                  setExpandedOrder(
                    expandedOrder === order._id ? null : order._id
                  )
                }
                onCancel={handleCancelOrder}
                cancelling={cancellingId === order._id}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default OrderPage;