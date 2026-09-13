import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpDown,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  PackageCheck,
  RefreshCw,
  Search,
  ShoppingBag,
  X,
  XCircle,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { cancelMyOrder, getMyOrders } from "../../services/orderService";

const STATUS_META = {
  "Order Received": {
    className: "bg-[#FFF0DF] text-[#C1442D]",
    dot: "bg-[#C1442D]",
  },
  "In Kitchen": {
    className: "bg-[#FFF0DF] text-[#C1442D]",
    dot: "bg-[#C1442D]",
  },
  "Sent to Delivery": {
    className: "bg-[#E8F0F8] text-[#2B5A8E]",
    dot: "bg-[#2B5A8E]",
  },
  Delivered: {
    className: "bg-[#E6F4EA] text-[#1E7E34]",
    dot: "bg-[#1E7E34]",
  },
  Cancelled: {
    className: "bg-[#FCE8E6] text-[#C5221F]",
    dot: "bg-[#C5221F]",
  },
};

const PAYMENT_META = {
  Paid: {
    className: "bg-[#E6F4EA] text-[#1E7E34]",
    icon: CheckCircle2,
  },
  Pending: {
    className: "bg-[#FFF0DF] text-[#C1442D]",
    icon: Clock3,
  },
  Failed: {
    className: "bg-[#FCE8E6] text-[#C5221F]",
    icon: XCircle,
  },
  Cancelled: {
    className: "bg-[#FCE8E6] text-[#C5221F]",
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

const formatDate = (date) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(date));

const formatPrice = (price) =>
  `Rs. ${Number(price || 0).toLocaleString("en-IN")}`;

const getOrderNumber = (order) =>
  order._id?.slice(-7).toUpperCase() || "-------";

const getStatus = (order) =>
  order.status || "Order Received";

const isActive = (order) => {
  const status = getStatus(order);
  return status !== "Delivered" && status !== "Cancelled";
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
        detail: ingredients.map((item) => item.name).join(" · "),
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
    },
  ];
};

function ItemImage({ item, large = false }) {
  const box = large ? "h-12 w-12" : "h-10 w-10";
  const icon = large ? "h-5 w-5" : "h-4 w-4";

  if (item.image) {
    return (
      <img
        src={item.image}
        alt=""
        className={`${box} shrink-0 rounded-lg object-cover ring-1 ring-[#f0e2d0]`}
      />
    );
  }

  return (
    <div
      className={`grid ${box} shrink-0 place-items-center rounded-lg bg-[#FFF0DF] text-[#C1442D] ring-1 ring-[#f0e2d0]`}
    >
      <ShoppingBag className={icon} />
    </div>
  );
}

function OrderThumbnails({ items }) {
  return (
    <div className="flex -space-x-2">
      {items.slice(0, 3).map((item) => (
        <div
          key={item.key}
          className="rounded-lg bg-white p-[2px] ring-1 ring-[#f0e2d0]"
        >
          <ItemImage item={item} />
        </div>
      ))}

      {items.length > 3 && (
        <div className="grid h-11 w-11 place-items-center rounded-lg bg-[#FAF6EF] text-xs font-semibold text-[#6B5C4D] ring-1 ring-[#f0e2d0]">
          +{items.length - 3}
        </div>
      )}
    </div>
  );
}

function FilterSection({
  query,
  setQuery,
  sortBy,
  setSortBy,
  filter,
  setFilter,
  counts,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
}) {
  const hasDates = dateFrom || dateTo;

  const clearDates = () => {
    setDateFrom("");
    setDateTo("");
  };

  return (
    <div className="space-y-3 rounded-xl border border-[#f0e2d0] bg-white p-3 sm:p-4">
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {STATUS_FILTERS.map((item) => {
          const active = filter === item.value;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-bold transition ${
                active
                  ? "border-[#C1442D] bg-[#C1442D] text-white"
                  : "border-[#f0e2d0] bg-white text-[#6B5C4D] hover:border-[#C1442D] hover:text-[#C1442D]"
              }`}
            >
              {item.label}
              <span
                className={`rounded-md px-1.5 text-[11px] ${
                  active
                    ? "bg-white/20 text-white"
                    : "bg-[#FAF6EF] text-[#A08E7C]"
                }`}
              >
                {counts[item.value]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="h-px bg-[#f0e2d0]" />

      <div className="grid gap-2 sm:grid-cols-2">
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A08E7C]" />

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by order number"
            className="h-10 w-full rounded-lg border border-[#f0e2d0] bg-white pl-9 pr-3 text-sm text-[#1A1A1A] outline-none placeholder:text-[#A08E7C] focus:border-[#C1442D]"
          />
        </label>

        <label className="relative">
          <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#A08E7C]" />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-10 w-full appearance-none rounded-lg border border-[#f0e2d0] bg-white pl-8 pr-8 text-sm font-medium text-[#6B5C4D] outline-none focus:border-[#C1442D]"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#A08E7C]" />
        </label>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-[#f0e2d0] bg-[#FAF6EF] px-3 py-1.5">
          <CalendarDays className="h-4 w-4 shrink-0 text-[#A08E7C]" />

          <div className="flex flex-1 flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
            <label className="flex flex-1 items-center gap-2">
              <span className="shrink-0 text-[11px] font-bold uppercase tracking-wider text-[#A08E7C]">
                From
              </span>

              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-7 w-full min-w-0 bg-transparent text-sm font-medium text-[#1A1A1A] outline-none"
              />
            </label>

            <div className="hidden h-4 w-px bg-[#f0e2d0] sm:block" />

            <label className="flex flex-1 items-center gap-2">
              <span className="shrink-0 text-[11px] font-bold uppercase tracking-wider text-[#A08E7C]">
                To
              </span>

              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="h-7 w-full min-w-0 bg-transparent text-sm font-medium text-[#1A1A1A] outline-none"
              />
            </label>
          </div>

          {hasDates && (
            <button
              type="button"
              onClick={clearDates}
              aria-label="Clear date range"
              className="shrink-0 rounded-full p-1 text-[#A08E7C] hover:bg-white hover:text-[#C1442D]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function OrderDetails({ order, items, onCancel, cancelling }) {
  const paymentStatus = order.status === "Cancelled"
    ? order.paymentStatus || "Cancelled"
    : order.paymentStatus || "Pending";
  const payment = PAYMENT_META[paymentStatus] || PAYMENT_META.Pending;
  const PaymentIcon = payment.icon;

  const paymentMethod =
    order.paymentMethod === "esewa" ? "eSewa" : "Cash on delivery";

  return (
    <div className="space-y-3 border-t border-[#f0e2d0] bg-[#FAF6EF] p-3 sm:p-4">
      <div className="overflow-hidden rounded-xl border border-[#f0e2d0] bg-white">
        {items.map((item) => (
          <div
            key={item.key}
            className="flex items-center gap-3 border-b border-[#f0e2d0] px-3 py-3 last:border-0 sm:px-4"
          >
            <ItemImage item={item} />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-[#1A1A1A]">
                {item.name}
              </p>

              <p className="mt-0.5 truncate text-xs text-[#6B5C4D]">
                {item.detail || "Classic pizza"}
              </p>
            </div>

            <span className="shrink-0 text-xs text-[#6B5C4D]">
              ×{item.quantity}
            </span>

            <span className="shrink-0 text-sm font-bold text-[#1A1A1A]">
              {formatPrice((item.price || 0) * item.quantity)}
            </span>
          </div>
        ))}

        <div className="flex items-center justify-between border-t border-[#f0e2d0] px-3 py-3 sm:px-4">
          <span className="text-sm font-medium text-[#6B5C4D]">
            Order total
          </span>

          <span className="text-sm font-bold text-[#1A1A1A]">
            {formatPrice(order.totalPrice)}
          </span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-[#f0e2d0] bg-white p-3.5 sm:p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#A08E7C]">
            Payment
          </p>

          <div className="mt-2.5 flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-bold ${payment.className}`}
            >
              <PaymentIcon className="h-3.5 w-3.5" />
              {paymentStatus}
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-md bg-[#FAF6EF] px-2.5 py-1 text-xs font-bold text-[#6B5C4D]">
              <PackageCheck className="h-3.5 w-3.5" />
              {paymentMethod}
            </span>
          </div>

          {order.paymentStatus === "Failed" && (
            <p className="mt-2 text-xs font-semibold text-[#C5221F]">
              Reason: {order.paymentFailureReason || "eSewa did not complete the payment."}
            </p>
          )}
        </div>

        <div className="rounded-xl border border-[#f0e2d0] bg-white p-3.5 sm:p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#A08E7C]">
            Delivering to
          </p>

          <p className="mt-2.5 text-sm font-bold text-[#1A1A1A]">
            {order.address?.fullName || "—"}
          </p>

          {order.address && (
            <p className="mt-0.5 text-xs text-[#6B5C4D]">
              {order.address.line}, {order.address.city}
            </p>
          )}
        </div>
      </div>

      {order.status === "Order Received" && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#f0e2d0] bg-white p-3.5 sm:p-4">
          <p className="text-xs text-[#6B5C4D]">
            You can cancel this order within 20 minutes, before it enters the kitchen.
          </p>
          {Date.now() - new Date(order.createdAt).getTime() <= 20 * 60 * 1000 ? (
            <button
              type="button"
              onClick={() => onCancel(order)}
              disabled={cancelling}
              className="inline-flex items-center gap-2 rounded-lg border border-[#C5221F] px-3 py-2 text-xs font-bold text-[#C5221F] hover:bg-[#FCE8E6] disabled:cursor-wait disabled:opacity-60"
            >
              <XCircle className="h-3.5 w-3.5" />
              {cancelling ? "Cancelling..." : "Cancel order"}
            </button>
          ) : <span className="text-xs font-bold text-[#A08E7C]">Cancellation window closed</span>}
        </div>
      )}

      {order.status === "In Kitchen" && (
        <p className="rounded-xl border border-[#f0e2d0] bg-white p-3.5 text-xs font-semibold text-[#9a6a35] sm:p-4">
          This order is already in the kitchen and can no longer be cancelled.
        </p>
      )}
    </div>
  );
}

function OrderCard({ order, expanded, onToggle, onCancel, cancelling }) {
  const items = getItems(order);
  const status = getStatus(order);
  const statusMeta =
    STATUS_META[status] || STATUS_META["Order Received"];

  return (
    <article
      className={`overflow-hidden rounded-xl border bg-white ${
        expanded ? "border-[#C1442D]/40" : "border-[#f0e2d0]"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full flex-col gap-3 p-3.5 text-left hover:bg-[#FAF6EF] sm:flex-row sm:items-center sm:justify-between sm:p-4"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-[#1A1A1A]">
              Order #{getOrderNumber(order)}
            </span>

            <span
              className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-bold ${statusMeta.className}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${statusMeta.dot}`}
              />
              {status}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-[#6B5C4D]">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDate(order.createdAt)}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <PackageCheck className="h-3.5 w-3.5" />
              {items.length} item{items.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end sm:gap-5">
          <OrderThumbnails items={items} />

          <div className="text-right">
            <p className="text-[11px] text-[#6B5C4D]">Total</p>
            <p className="text-sm font-bold text-[#1A1A1A] sm:text-base">
              {formatPrice(order.totalPrice)}
            </p>
          </div>

          <ChevronDown
            className={`h-4 w-4 shrink-0 text-[#A08E7C] transition-transform ${
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

function LoadingOrders() {
  return (
    <div className="grid gap-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-24 animate-pulse rounded-xl border border-[#f0e2d0] bg-white"
        />
      ))}
    </div>
  );
}

function OrderError({ error, onRetry }) {
  return (
    <div className="rounded-xl border border-[#f0e2d0] bg-white p-6 text-center sm:p-8">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#FCE8E6] text-[#C5221F]">
        <XCircle className="h-5 w-5" />
      </div>

      <p className="mt-4 text-sm font-bold text-[#1A1A1A]">{error}</p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#C1442D] px-4 py-2 text-sm font-bold text-white hover:bg-[#A93724]"
      >
        <RefreshCw className="h-4 w-4" />
        Try again
      </button>
    </div>
  );
}

function EmptyOrders({ onBrowse }) {
  return (
    <div className="rounded-xl border border-[#f0e2d0] bg-white px-6 py-14 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#FFF0DF] text-[#C1442D]">
        <ShoppingBag className="h-6 w-6" />
      </div>

      <h2 className="mt-5 text-lg font-bold text-[#1A1A1A]">
        No orders yet
      </h2>

      <p className="mx-auto mt-2 max-w-sm text-sm text-[#6B5C4D]">
        Your next pizza order will appear here.
      </p>

      <button
        type="button"
        onClick={onBrowse}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#C1442D] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#A93724]"
      >
        Browse menu
      </button>
    </div>
  );
}

function NoResults({ onClear }) {
  return (
    <div className="rounded-xl border border-[#f0e2d0] bg-white px-6 py-12 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#FAF6EF] text-[#A08E7C]">
        <Search className="h-5 w-5" />
      </div>

      <p className="mt-4 text-sm font-bold text-[#1A1A1A]">
        No orders match your filters
      </p>

      <button
        type="button"
        onClick={onClear}
        className="mt-3 text-sm font-bold text-[#C1442D] underline underline-offset-4 hover:text-[#A93724]"
      >
        Clear all filters
      </button>
    </div>
  );
}

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
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [cancellingId, setCancellingId] = useState("");

  const loadOrders = async (silent = false) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

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

  useEffect(() => {
    const refreshInterval = window.setInterval(() => {
      loadOrders(true);
    }, 5000);

    return () => window.clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    const orderId = searchParams.get("order");

    if (orderId && orders.some((order) => order._id === orderId)) {
      setExpandedOrder(orderId);
    }
  }, [orders, searchParams]);

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
        searchParams.get("reason") ||
        "eSewa did not complete the payment.";

      toast.error(`Payment failed: ${reason}`, {
        id: "order-payment-failure",
      });

      navigate("/orders", { replace: true });
    }
  }, [navigate, searchParams]);

  const counts = useMemo(
    () => ({
      all: orders.length,
      active: orders.filter(isActive).length,
      delivered: orders.filter(
        (order) => getStatus(order) === "Delivered"
      ).length,
      cancelled: orders.filter(
        (order) => getStatus(order) === "Cancelled"
      ).length,
    }),
    [orders]
  );

  const visibleOrders = useMemo(() => {
    const search = query.trim().toUpperCase();

    const from = dateFrom
      ? new Date(`${dateFrom}T00:00:00`)
      : null;

    const to = dateTo
      ? new Date(`${dateTo}T23:59:59`)
      : null;

    const filtered = orders.filter((order) => {
      if (!getOrderNumber(order).includes(search)) return false;

      const status = getStatus(order);

      if (filter === "active" && !isActive(order)) return false;
      if (filter === "delivered" && status !== "Delivered") return false;
      if (filter === "cancelled" && status !== "Cancelled") return false;

      const orderDate = new Date(order.createdAt);

      if (from && orderDate < from) return false;
      if (to && orderDate > to) return false;

      return true;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }

      if (sortBy === "highest") {
        return b.totalPrice - a.totalPrice;
      }

      if (sortBy === "lowest") {
        return a.totalPrice - b.totalPrice;
      }

      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [orders, query, sortBy, filter, dateFrom, dateTo]);

  const clearFilters = () => {
    setQuery("");
    setFilter("all");
    setSortBy("newest");
    setDateFrom("");
    setDateTo("");
  };

  const handleCancelOrder = async (order) => {
    if (!window.confirm("Cancel this order? Paid orders may require a refund from the restaurant.")) {
      return;
    }

    setCancellingId(order._id);
    try {
      const data = await cancelMyOrder(order._id);
      setOrders((current) => current.map((item) => (
        item._id === order._id ? { ...item, ...data.order } : item
      )));
      toast.success("Order cancelled");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not cancel this order");
    } finally {
      setCancellingId("");
    }
  };

  return (
    <section className="min-h-svh bg-[#FAF6EF] px-4 pb-16 pt-[104px] sm:px-6 sm:pt-[120px]">
      <div className="mx-auto w-full max-w-4xl">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#1A1A1A]">
              Order history
            </h1>

            <p className="mt-1 text-sm text-[#6B5C4D]">
              View and track your past orders.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadOrders(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 self-start rounded-lg border border-[#f0e2d0] bg-white px-3 py-2 text-sm font-bold text-[#6B5C4D] hover:border-[#C1442D] hover:text-[#C1442D] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${
                refreshing ? "animate-spin" : ""
              }`}
            />
            Refresh
          </button>
        </header>

        {!loading && !error && orders.length > 0 && (
          <div className="mt-5">
            <FilterSection
              query={query}
              setQuery={setQuery}
              sortBy={sortBy}
              setSortBy={setSortBy}
              filter={filter}
              setFilter={setFilter}
              counts={counts}
              dateFrom={dateFrom}
              setDateFrom={setDateFrom}
              dateTo={dateTo}
              setDateTo={setDateTo}
            />
          </div>
        )}

        {!loading &&
          !error &&
          orders.length > 0 &&
          visibleOrders.length > 0 && (
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#A08E7C]">
              Showing {visibleOrders.length} order
              {visibleOrders.length !== 1 ? "s" : ""}
            </p>
          )}

        <div className="mt-3">
          {loading && <LoadingOrders />}

          {!loading && error && (
            <OrderError
              error={error}
              onRetry={() => loadOrders()}
            />
          )}

          {!loading && !error && orders.length === 0 && (
            <EmptyOrders onBrowse={() => navigate("/menu")} />
          )}

          {!loading &&
            !error &&
            orders.length > 0 &&
            visibleOrders.length === 0 && (
              <NoResults onClear={clearFilters} />
            )}

          {!loading && !error && visibleOrders.length > 0 && (
            <div className="grid gap-3">
              {visibleOrders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  expanded={expandedOrder === order._id}
                  onCancel={handleCancelOrder}
                  cancelling={cancellingId === order._id}
                  onToggle={() =>
                    setExpandedOrder(
                      expandedOrder === order._id
                        ? null
                        : order._id
                    )
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default OrderPage;