import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Package,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  getAdminInventory,
  getAllOrders,
} from "../../services/adminService";
import { formatNpr } from "../../utils/pricing";

const STATUS_TEXT_STYLES = {
  "Order Received": "text-[#c1442d]",
  "In Kitchen": "text-[#9a6a35]",
  "Sent to Delivery": "text-[#2f5aa8]",
  Delivered: "text-[#27663a]",
  Cancelled: "text-[#c5221f]",
};

const formatPrice = (value) => formatNpr(value);

const formatDate = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

function AdminDashboardPage() {
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const [inventoryData, orderData] = await Promise.all([
        getAdminInventory(),
        getAllOrders(),
      ]);

      setInventory(
        Array.isArray(inventoryData?.inventory)
          ? inventoryData.inventory
          : []
      );

      setOrders(
        Array.isArray(orderData?.orders)
          ? orderData.orders
          : []
      );
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          "Could not load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const lowStockItems = useMemo(() => {
    return inventory.filter(
      (item) =>
        Number(item.stock) <=
        Number(item.lowStockThreshold ?? 20)
    );
  }, [inventory]);

  const deliveredOrders = useMemo(() => {
    return orders.filter(
      (order) => order.status === "Delivered"
    ).length;
  }, [orders]);

  const activeOrders = useMemo(() => {
    return orders.filter(
      (order) =>
        !["Delivered", "Cancelled"].includes(order.status)
    ).length;
  }, [orders]);

  const revenue = useMemo(() => {
    return orders
      .filter((order) => order.status !== "Cancelled")
      .reduce(
        (total, order) =>
          total + Number(order.totalPrice || 0),
        0
      );
  }, [orders]);

  const stats = [
    {
      label: "Total orders",
      value: orders.length,
      icon: ClipboardList,
      tone: "bg-[#fff0df] text-[#c1442d]",
    },
    {
      label: "In progress",
      value: activeOrders,
      icon: ShoppingBag,
      tone: "bg-[#e8f0fb] text-[#2f5aa8]",
    },
    {
      label: "Delivered",
      value: deliveredOrders,
      icon: CheckCircle2,
      tone: "bg-[#e8f3e8] text-[#27663a]",
    },
    {
      label: "Gross sales",
      value: formatPrice(revenue),
      icon: Package,
      tone: "bg-[#fdf3dd] text-[#9a6a35]",
    },
  ];

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#c1442d]">
            Overview
          </p>

          <h2 className="mt-1 text-3xl font-black tracking-tight text-[#1c1712]">
            Hello, admin.
          </h2>

          <p className="mt-2 text-sm text-[#806f60]">
            A quick read on today&apos;s SliceHouse operation.
          </p>
        </div>

        <button
          onClick={loadDashboard}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-[#eadfd2] bg-white px-4 py-2 text-sm font-bold text-[#5c4f42] shadow-sm hover:border-[#c1442d] disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              loading ? "animate-spin" : ""
            }`}
          />
          Refresh
        </button>
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, tone }) => (
          <div
            key={label}
            className="rounded-xl border border-[#eee5d9] bg-white p-5 shadow-sm"
          >
            <div
              className={`grid h-10 w-10 place-items-center rounded-lg ${tone}`}
            >
              <Icon className="h-5 w-5" />
            </div>

            <p className="mt-5 text-sm font-semibold text-[#806f60]">
              {label}
            </p>

            <p className="mt-1 text-2xl font-black text-[#1c1712]">
              {loading ? "..." : value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <div className="rounded-xl border border-[#eee5d9] bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-[#1c1712]">
                Recent orders
              </h3>

              <p className="mt-1 text-sm text-[#806f60]">
                Newest activity from your customers.
              </p>
            </div>

            <Link
              to="/admin/orders"
              className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-[#c1442d] hover:underline"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="divide-y divide-[#f1e9df]">
            {orders.slice(0, 5).map((order) => {
              const customerName =
                order.user?.fname ||
                order.address?.fullName ||
                "Customer";

              return (
                <div
                  key={order._id}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[#1c1712]">
                      {customerName}
                    </p>

                    <p className="mt-1 text-xs text-[#806f60]">
                      #{String(order._id).slice(-6)} ·{" "}
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-sm font-black text-[#1c1712]">
                      {formatPrice(order.totalPrice)}
                    </p>

                    <span
                      className={`text-xs font-semibold ${
                        STATUS_TEXT_STYLES[order.status] ||
                        "text-[#806f60]"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              );
            })}

            {!loading && orders.length === 0 && (
              <div className="py-10 text-center">
                <ClipboardList className="mx-auto h-8 w-8 text-[#d4c5b7]" />

                <p className="mt-3 text-sm font-semibold text-[#806f60]">
                  No orders yet.
                </p>
              </div>
            )}

            {loading && (
              <div className="space-y-4 py-4">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="h-4 w-28 rounded bg-[#f1e9df]" />
                      <div className="h-3 w-36 rounded bg-[#f7f1ea]" />
                    </div>

                    <div className="space-y-2">
                      <div className="ml-auto h-4 w-16 rounded bg-[#f1e9df]" />
                      <div className="ml-auto h-3 w-20 rounded bg-[#f7f1ea]" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-[#eee5d9] bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-[#1c1712]">
                Stock watch
              </h3>

              <p className="mt-1 text-sm text-[#806f60]">
                Items at or below their alert threshold.
              </p>
            </div>

            <Link
              to="/admin/inventory"
              aria-label="Manage inventory"
              className="rounded-lg p-2 text-[#c1442d] hover:bg-[#fff0df]"
            >
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-12 rounded-lg bg-[#f7f1ea]"
                />
              ))}
            </div>
          ) : lowStockItems.length === 0 ? (
            <div className="flex items-center gap-3 rounded-lg bg-[#e8f3e8] p-4 text-sm font-semibold text-[#27663a]">
              <CheckCircle2 className="h-5 w-5 shrink-0" />

              <span>
                All inventory levels look healthy.
              </span>
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockItems.slice(0, 5).map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between gap-3 rounded-lg bg-[#fff8f0] p-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-[#c1442d]" />

                    <span className="truncate text-sm font-bold text-[#1c1712]">
                      {item.name}
                    </span>
                  </div>

                  <span className="shrink-0 text-sm font-black text-[#c1442d]">
                    {item.stock} left
                  </span>
                </div>
              ))}

              {lowStockItems.length > 5 && (
                <Link
                  to="/admin/inventory"
                  className="block pt-1 text-center text-sm font-bold text-[#c1442d] hover:underline"
                >
                  View all low-stock items
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default AdminDashboardPage;