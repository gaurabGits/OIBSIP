import { useState } from 'react'
import {
  Bell,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  LayoutDashboard,
  Menu,
  Package,
  Pizza,
  Search,
  ShoppingBag,
  Users,
  X,
} from 'lucide-react'

const stats = [
  { label: 'Today’s revenue', value: '₹48,260', change: '+12.8%', icon: CircleDollarSign, tone: 'red' },
  { label: 'Orders today', value: '128', change: '+8.4%', icon: ShoppingBag, tone: 'orange' },
  { label: 'Active customers', value: '2,846', change: '+4.6%', icon: Users, tone: 'blue' },
  { label: 'Menu items', value: '24', change: '2 low stock', icon: Pizza, tone: 'green' },
]

const orders = [
  { id: '#SH-1048', customer: 'Aarav Mehta', items: '2 pizzas · 1 drink', total: '₹1,850', status: 'In Kitchen', time: '2 min ago' },
  { id: '#SH-1047', customer: 'Ananya Sharma', items: '1 pizza · 2 sides', total: '₹1,240', status: 'Order Received', time: '8 min ago' },
  { id: '#SH-1046', customer: 'Rohan Kapoor', items: '3 pizzas', total: '₹2,650', status: 'Sent to Delivery', time: '15 min ago' },
  { id: '#SH-1045', customer: 'Diya Nair', items: '1 pizza · 1 dessert', total: '₹980', status: 'Delivered', time: '22 min ago' },
  { id: '#SH-1044', customer: 'Kabir Singh', items: '2 pizzas · 2 drinks', total: '₹1,720', status: 'Delivered', time: '31 min ago' },
]

const inventory = [
  { name: 'Neapolitan dough', category: 'Base', stock: 8, unit: 'portions' },
  { name: 'Fresh mozzarella', category: 'Cheese', stock: 12, unit: 'packs' },
  { name: 'San Marzano sauce', category: 'Sauce', stock: 18, unit: 'jars' },
]

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Orders', icon: ShoppingBag },
  { label: 'Menu', icon: Pizza },
  { label: 'Inventory', icon: Package },
  { label: 'Customers', icon: Users },
]

function statusClass(status) {
  if (status === 'Delivered') return 'admin-status admin-status-success'
  if (status === 'Sent to Delivery') return 'admin-status admin-status-info'
  if (status === 'In Kitchen') return 'admin-status admin-status-warning'
  return 'admin-status admin-status-neutral'
}

function AdminDashboard() {
  const [activePage, setActivePage] = useState('Overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filteredOrders = orders.filter((order) =>
    `${order.id} ${order.customer}`.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar-open' : ''}`}>
        <div className="admin-brand">
          <span className="admin-brand-mark"><Pizza size={22} /></span>
          <span>Slice<span>House</span></span>
          <button className="admin-close-button" type="button" onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X size={20} /></button>
        </div>
        <p className="admin-nav-label">Workspace</p>
        <nav className="admin-nav" aria-label="Admin navigation">
          {navItems.map(({ label, icon: Icon }) => (
            <button
              className={`admin-nav-item ${activePage === label ? 'admin-nav-item-active' : ''}`}
              key={label}
              type="button"
              onClick={() => { setActivePage(label); setSidebarOpen(false) }}
            >
              <Icon size={19} />
              {label}
              {label === 'Orders' && <span className="admin-nav-count">8</span>}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <div className="admin-avatar">AD</div>
          <div><strong>Admin</strong><span>Store manager</span></div>
          <ChevronDown size={16} />
        </div>
      </aside>

      {sidebarOpen && <button className="admin-sidebar-overlay" type="button" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />}

      <main className="admin-main">
        <header className="admin-header">
          <button className="admin-menu-button" type="button" onClick={() => setSidebarOpen(true)} aria-label="Open menu"><Menu size={22} /></button>
          <div>
            <p className="admin-eyebrow">Thursday, September 3, 2026</p>
            <h1>{activePage === 'Overview' ? 'Good evening, Admin' : activePage}</h1>
          </div>
          <div className="admin-header-actions">
            <label className="admin-search">
              <Search size={18} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search orders" aria-label="Search orders" />
            </label>
            <button className="admin-icon-button" type="button" aria-label="Notifications"><Bell size={19} /><span /></button>
            <div className="admin-header-avatar">AD</div>
          </div>
        </header>

        {activePage === 'Overview' ? (
          <>
            <section className="admin-stats-grid" aria-label="Store summary">
              {stats.map(({ label, value, change, icon: Icon, tone }) => (
                <article className="admin-stat-card" key={label}>
                  <div className={`admin-stat-icon admin-stat-icon-${tone}`}><Icon size={21} /></div>
                  <p>{label}</p>
                  <strong>{value}</strong>
                  <span className={change.startsWith('+') ? 'admin-positive' : 'admin-warning-text'}>{change}</span>
                </article>
              ))}
            </section>

            <section className="admin-content-grid">
              <article className="admin-panel admin-orders-panel">
                <div className="admin-panel-heading">
                  <div><h2>Recent orders</h2><p>Keep an eye on your latest orders</p></div>
                  <button className="admin-text-button" type="button" onClick={() => setActivePage('Orders')}>View all <ChevronRight size={16} /></button>
                </div>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th><th>Placed</th></tr></thead>
                    <tbody>
                      {filteredOrders.map((order) => <tr key={order.id}><td className="admin-order-id">{order.id}</td><td><strong>{order.customer}</strong><small>{order.items}</small></td><td>{order.total}</td><td><span className={statusClass(order.status)}>{order.status}</span></td><td className="admin-muted">{order.time}</td></tr>)}
                    </tbody>
                  </table>
                  {filteredOrders.length === 0 && <p className="admin-empty-state">No orders match your search.</p>}
                </div>
              </article>

              <article className="admin-panel admin-inventory-panel">
                <div className="admin-panel-heading"><div><h2>Inventory alerts</h2><p>Items that need attention</p></div><Package size={20} className="admin-heading-icon" /></div>
                <div className="admin-inventory-list">
                  {inventory.map((item) => <div className="admin-inventory-item" key={item.name}><div className="admin-inventory-icon"><Package size={17} /></div><div className="admin-inventory-detail"><strong>{item.name}</strong><span>{item.category}</span></div><div className="admin-stock"><strong>{item.stock}</strong><span>{item.unit}</span></div></div>)}
                </div>
                <button className="admin-outline-button" type="button" onClick={() => setActivePage('Inventory')}>Manage inventory <ChevronRight size={16} /></button>
              </article>
            </section>
          </>
        ) : (
          <section className="admin-panel admin-placeholder-panel"><div className="admin-placeholder-icon"><Pizza size={28} /></div><h2>{activePage} is ready to set up</h2><p>This workspace is connected to the admin dashboard navigation. Add management actions here when the next admin feature is ready.</p></section>
        )}
      </main>
    </div>
  )
}

export default AdminDashboard
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

const STATUS_TEXT_STYLES = {
  "Order Received": "text-[#c1442d]",
  "In Kitchen": "text-[#9a6a35]",
  "Sent to Delivery": "text-[#2f5aa8]",
  Delivered: "text-[#27663a]",
  Cancelled: "text-[#c5221f]",
};

const formatPrice = (value) => {
  return `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;
};

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
            Good morning, admin.
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
