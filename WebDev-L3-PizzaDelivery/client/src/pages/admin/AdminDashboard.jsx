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
