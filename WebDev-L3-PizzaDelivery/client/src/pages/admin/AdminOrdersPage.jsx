import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  Loader2,
  RefreshCw,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getAllOrders,
  markCashPaymentPaid,
  updateOrderStatus,
} from "../../services/adminService";

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

const formatPrice = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

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

          return (
            <article
              key={order._id}
              className="rounded-xl border border-[#eee5d9] bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
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

                <div className="text-right">
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
                      : `${order.paymentMethod} · ${order.paymentStatus}`}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 border-t border-[#f1e9df] pt-4 lg:grid-cols-[minmax(0,1fr)_220px_180px]">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#806f60]">
                    Items
                  </p>

                  <p className="text-sm text-[#5c4f42]">
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
                    <div className="mt-6 flex h-10 items-center justify-center rounded-lg bg-[#fce8e6] px-3 text-xs font-bold text-[#c5221f]">
                      Cancelled
                    </div>
                  ) : isPaid ? (
                    <div className="mt-6 flex h-10 items-center justify-center rounded-lg bg-[#e8f3e8] px-3 text-xs font-bold text-[#27663a]">
                      Paid
                    </div>
                  ) : isKitchen ? (
                    <div className="mt-6 flex h-10 items-center justify-center rounded-lg bg-[#fdf3dd] px-3 text-xs font-bold text-[#9a6a35]">
                      Kitchen started
                    </div>
                  ) : isCash ? (
                    <button
                      onClick={() => markPaid(order)}
                      disabled={isUpdating}
                      className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg border border-[#c1442d] px-3 py-2 text-sm font-bold text-[#c1442d] hover:bg-[#fff0df] disabled:opacity-60"
                    >
                      {isUpdating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      Mark paid
                    </button>
                  ) : (
                    <div className="mt-6 flex h-10 items-center justify-center rounded-lg bg-[#fdf3dd] px-3 text-xs font-bold text-[#9a6a35]">
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

export default AdminOrderPage;