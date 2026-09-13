import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Check,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Loader2,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getAllOrders,
  markCashPaymentPaid,
  updateOrderStatus,
} from "../../services/adminService";
import { formatNpr } from "../../utils/pricing";

const ORDER_STATUSES = [
  "Order Received",
  "In Kitchen",
  "Sent to Delivery",
  "Delivered",
  "Cancelled",
];

const STATUS_SELECT_STYLES = {
  "Order Received": "border-[#c1442d] text-[#c1442d]",
  "In Kitchen": "border-[#d98b2b] text-[#9a6a35]",
  "Sent to Delivery": "border-[#2f5aa8] text-[#2f5aa8]",
  Delivered: "border-[#27663a] text-[#27663a]",
  Cancelled: "border-[#c5221f] bg-[#fce8e6] text-[#c5221f]",
};

const formatPrice = (value) => formatNpr(value);

const formatDate = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Unknown date";

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const getCancellationLabel = (order) => {
  if (order.cancelledBy === "user") return "Cancelled by customer";
  if (order.cancelledBy === "admin") return "Cancelled by admin";
  if (order.cancelledBy === "system") return "Cancelled automatically after payment failure";
  if (order.paymentStatus === "Failed") return "Cancelled automatically after payment failure";
  if (order.status === "Cancelled") return "Cancelled by customer or previous system version";
  return "Not cancelled";
};

const getPaymentLabel = (order) => {
  if (order.status === "Cancelled" && order.paymentMethod === "cash") {
    return `${order.paymentMethod || "Unknown"} · Payment not collected`;
  }

  return `${order.paymentMethod || "Unknown"} · ${order.paymentStatus || "Unknown"}`;
};

const getAvailableStatuses = (order) => {
  const currentIndex = ORDER_STATUSES.indexOf(order.status);

  if (currentIndex < 0 || order.status === "Cancelled") {
    return [order.status];
  }

  return ORDER_STATUSES.slice(currentIndex, 4);
};

function AdminOrderPage() {
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [expandedIds, setExpandedIds] = useState({});
  const [error, setError] = useState("");

  const loadOrders = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);

    try {
      const data = await getAllOrders();
      setOrders(Array.isArray(data?.orders) ? data.orders : []);
      setError("");
    } catch (error) {
      if (!silent) {
        setError(
          error?.response?.data?.message || "Could not load orders."
        );
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();

    const interval = setInterval(() => {
      loadOrders(true);
    }, 15000);

    return () => clearInterval(interval);
  }, [loadOrders]);

  const filteredOrders = useMemo(() => {
    const search = query.trim().toLowerCase();

    return orders.filter((order) => {
      const text = [
        order._id,
        order.user?.fname,
        order.user?.email,
        order.address?.fullName,
      ]
        .join(" ")
        .toLowerCase();

      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;

      return matchesStatus && text.includes(search);
    });
  }, [orders, query, statusFilter]);

  const changeStatus = async (order, status) => {
    if (order.status === "Cancelled") return;

    if (order.paymentStatus === "Paid" && status === "Cancelled") {
      return;
    }

    setUpdatingId(order._id);

    try {
      const data = await updateOrderStatus(order._id, status);

      setOrders((current) =>
        current.map((item) =>
          item._id === order._id
            ? { ...item, ...data.order }
            : item
        )
      );
      window.dispatchEvent(new Event("slicehouse-orders-updated"));

      toast.success("Order status updated");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Could not update order status."
      );
    } finally {
      setUpdatingId("");
    }
  };

  const markPaid = async (order) => {
    setUpdatingId(order._id);

    try {
      const data = await markCashPaymentPaid(order._id);

      setOrders((current) =>
        current.map((item) =>
          item._id === order._id
            ? { ...item, ...data.order }
            : item
        )
      );

      toast.success("Payment marked as paid");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Could not update payment."
      );
    } finally {
      setUpdatingId("");
    }
  };

  const toggleOrder = (id) => {
    setExpandedIds((current) => ({
      ...current,
      [id]: !current[id],
    }));
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#c1442d]">
            Fulfillment
          </p>

          <h2 className="mt-1 text-3xl font-black tracking-tight text-[#1c1712]">
            Orders
          </h2>

          <p className="mt-2 text-sm text-[#806f60]">
            Manage incoming orders and keep customers in the loop.
          </p>
        </div>

        <button
          onClick={() => loadOrders()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-[#eadfd2] bg-white px-4 py-2 text-sm font-bold text-[#5c4f42] shadow-sm hover:border-[#c1442d] disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-[#eee5d9] bg-white p-4 shadow-sm sm:flex-row">
        <label className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#806f60]" />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search customer or order ID"
            className="w-full rounded-lg border border-[#eadfd2] py-2 pl-9 pr-3 text-sm outline-none focus:border-[#c1442d] focus:ring-2 focus:ring-[#c1442d]/15"
          />
        </label>

        <label className="relative sm:w-52">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full appearance-none rounded-lg border border-[#eadfd2] bg-white px-3 py-2 pr-9 text-sm font-semibold text-[#5c4f42] outline-none focus:border-[#c1442d]"
          >
            <option value="All">All</option>

            {ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#806f60]" />
        </label>
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}

      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const isUpdating = updatingId === order._id;
          const isCancelled = order.status === "Cancelled";
          const isPaid = order.paymentStatus === "Paid";
          const isCash = order.paymentMethod === "cash";
          const isKitchen = order.status === "In Kitchen";
          const isExpanded = Boolean(expandedIds[order._id]);
          const orderItems = order.items?.length
            ? order.items
            : [
                order.pizza?.base,
                order.pizza?.sauce,
                order.pizza?.cheese,
                ...(order.pizza?.vegetables || []),
              ].filter(Boolean);

          return (
            <article
              key={order._id}
              className="rounded-xl border border-[#eee5d9] bg-white p-4 shadow-sm sm:p-5"
            >
              <button
                type="button"
                onClick={() => toggleOrder(order._id)}
                className="grid w-full grid-cols-[minmax(0,1fr)_24px] gap-3 text-left sm:grid-cols-[minmax(0,1fr)_auto_24px] sm:items-start sm:gap-5"
                aria-expanded={isExpanded}
              >
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#c1442d]">
                    Order #{String(order._id).slice(-8)}
                  </p>

                  <h3 className="mt-1 text-lg font-black text-[#1c1712]">
                    {order.user?.fname ||
                      order.address?.fullName ||
                      "Customer"}
                  </h3>

                  <p className="mt-1 text-sm text-[#806f60]">
                    {order.user?.email || "No email"} ·{" "}
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="col-start-1 row-start-2 min-w-0 text-left sm:col-start-2 sm:row-start-1 sm:text-right">
                  <p className="text-lg font-black text-[#1c1712]">
                    {formatPrice(order.totalPrice)}
                  </p>

                  <p
                    className={`text-xs font-semibold ${
                      isCancelled
                        ? "text-[#c5221f]"
                        : "text-[#806f60]"
                    }`}
                  >
                    {isCancelled
                      ? "Cancelled"
                      : getPaymentLabel(order)}
                  </p>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 shrink-0 text-[#806f60]" />
                ) : (
                  <ChevronDown className="h-5 w-5 shrink-0 text-[#806f60]" />
                )}
              </button>

              {isExpanded && (
                <div className="mt-5 grid gap-4 border-t border-[#f1e9df] pt-4 md:grid-cols-2">
                  <InfoPanel title="Customer">
                    <InfoLine icon={Mail} value={order.user?.email || "No email"} />
                    <InfoLine icon={Phone} value={order.user?.phone || order.address?.phone || "No phone"} />
                  </InfoPanel>

                  <InfoPanel title="Delivery address">
                    <InfoLine icon={MapPin} value={order.address?.fullName || "No recipient name"} />
                    <p className="wrap-break-word pl-6 text-sm text-[#5c4f42]">
                      {order.address?.line || "No address"}
                      {order.address?.city ? `, ${order.address.city}` : ""}
                    </p>
                  </InfoPanel>

                  <InfoPanel title="Payment">
                    <InfoLine
                      icon={CreditCard}
                      value={getPaymentLabel(order)}
                    />
                    {order.transactionUuid && (
                      <p className="pl-6 text-xs text-[#806f60]">
                        Transaction: {order.transactionUuid}
                      </p>
                    )}
                    {order.paymentFailureReason && (
                      <p className="mt-2 flex gap-2 text-sm font-semibold text-[#c5221f]">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        Failed: {order.paymentFailureReason}
                      </p>
                    )}
                  </InfoPanel>

                  <InfoPanel title="Order history">
                    <p className="text-sm text-[#5c4f42]">
                      Placed {formatDate(order.createdAt)}
                    </p>
                    <p className={`mt-1 text-sm font-semibold ${isCancelled ? "text-[#c5221f]" : "text-[#5c4f42]"}`}>
                      {isCancelled
                        ? `${getCancellationLabel(order)}${order.cancelledAt ? ` on ${formatDate(order.cancelledAt)}` : ""}`
                        : order.status === "Order Received"
                          ? "Cancellation available to customer for 20 minutes"
                          : "Cancellation closed after kitchen handoff"}
                    </p>
                    {!isCancelled && order.status === "Order Received" && (
                      <p className="mt-1 text-xs text-[#806f60]">
                        Admin cannot cancel orders. Only the signed-in customer can cancel their own order.
                      </p>
                    )}
                  </InfoPanel>

                  <div className="md:col-span-2">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#806f60]">
                      Full item list
                    </p>
                    <div className="divide-y divide-[#f1e9df] rounded-lg border border-[#f1e9df]">
                      {orderItems.length ? orderItems.map((item, index) => (
                        <div key={`${item._id || item.itemId || item.name}-${index}`} className="flex min-w-0 flex-wrap justify-between gap-2 px-3 py-2 text-sm">
                          <span className="wrap-break-word font-semibold text-[#1c1712]">
                            {item.name || "Custom ingredient"} x{item.quantity || 1}
                          </span>
                          <span className="text-[#806f60]">
                            {item.price !== undefined ? formatPrice(item.price * (item.quantity || 1)) : "Included"}
                          </span>
                        </div>
                      )) : <p className="px-3 py-3 text-sm text-[#806f60]">No item details recorded.</p>}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-5 grid gap-4 border-t border-[#f1e9df] pt-4 lg:grid-cols-[minmax(0,1fr)_220px_180px] lg:items-end">
                <div className="min-w-0">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#806f60]">
                    Items
                  </p>

                  <p className="wrap-break-word text-sm text-[#5c4f42]">
                    {order.items?.length
                      ? order.items
                          .map(
                            (item) =>
                              `${item.name} x${item.quantity}`
                          )
                          .join(", ")
                      : "Custom pizza order"}
                  </p>
                </div>

                <label>
                  <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#806f60]">
                    Status
                  </span>

                  <select
                    value={order.status}
                    disabled={isUpdating || isCancelled}
                    onChange={(e) =>
                      changeStatus(order, e.target.value)
                    }
                    className={`w-full rounded-lg border bg-white px-3 py-2 text-sm font-bold outline-none focus:border-[#c1442d] ${
                      STATUS_SELECT_STYLES[order.status] ||
                      "border-[#eadfd2] text-[#5c4f42]"
                    }`}
                  >
                    {getAvailableStatuses(order).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>

                <div>
                  {isCancelled ? (
                    <div className="flex h-10 items-center justify-center rounded-lg bg-[#fce8e6] px-3 text-xs font-bold text-[#c5221f] lg:mt-6">
                      Cancelled
                    </div>
                  ) : isPaid ? (
                    <div className="flex h-10 items-center justify-center rounded-lg bg-[#e8f3e8] px-3 text-xs font-bold text-[#27663a] lg:mt-6">
                      Paid
                    </div>
                  ) : isKitchen ? (
                    <div className="flex h-10 items-center justify-center rounded-lg bg-[#fdf3dd] px-3 text-xs font-bold text-[#9a6a35] lg:mt-6">
                      Kitchen started
                    </div>
                  ) : isCash ? (
                    <button
                      onClick={() => markPaid(order)}
                      disabled={isUpdating}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#c1442d] px-3 py-2 text-sm font-bold text-[#c1442d] hover:bg-[#fff0df] disabled:opacity-60 lg:mt-6"
                    >
                      {isUpdating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      Mark paid
                    </button>
                  ) : (
                    <div className="flex h-10 items-center justify-center rounded-lg bg-[#fdf3dd] px-3 text-xs font-bold text-[#9a6a35] lg:mt-6">
                      Payment {order.paymentStatus}
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}

        {!loading && filteredOrders.length === 0 && (
          <div className="rounded-xl border border-dashed border-[#eadfd2] bg-white px-5 py-12 text-center text-sm text-[#806f60]">
            No matching orders.
          </div>
        )}
      </div>
    </section>
  );
}

function InfoPanel({ title, children }) {
  return (
    <div className="rounded-lg bg-[#fffaf5] p-3">
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#806f60]">
        {title}
      </p>
      {children}
    </div>
  );
}

function InfoLine({ icon: Icon, value }) {
  return (
    <p className="flex items-center gap-2 text-sm text-[#5c4f42]">
      <Icon className="h-4 w-4 shrink-0 text-[#c1442d]" />
      <span className="break-all">{value}</span>
    </p>
  );
}

export default AdminOrderPage;