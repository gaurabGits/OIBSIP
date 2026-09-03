import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Settings,
  User,
  LogOut,
  ChevronDown,
  Pizza,
  CircleCheck,
} from "lucide-react";
import  SystemLogo  from "../../assets/icons/SystemLogo";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    to: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Orders",
    to: "/admin/orders",
    icon: ShoppingBag,
    badge: "12",
  },
  {
    label: "Inventory",
    to: "/admin/inventory",
    icon: Package,
  },
  {
    label: "Settings",
    to: "/admin/settings",
    icon: Settings,
  },
];

export function AdminLayout() {
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const adminUser = {
    name: "PizzaSlice Admin",
    role: "Administrator",
    email: "admin@pizzaslice.com",
    avatar:
      "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=100&auto=format&fit=crop&q=80",
  };

  return (
    <div
      className="flex h-screen w-screen overflow-hidden font-sans"

    >
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 flex-shrink-0 bg-red-950 text-white flex flex-col justify-between border-r border-red-900">

        {/* Sidebar Top */}
        <div>
          <div className="p-5 col-auto flex flex-col border-b border-red-900/60 items-center gap-3">
            <SystemLogo className="w-10 h-10 " />
            <p className="text-xs -mt-5 tracking-[1px] text-red-200">
              Admin Panel
            </p>
          </div>


          {/* Navigation */}
          <nav className="p-4">
            <p className="px-3 mb-3 text-[11px] font-bold uppercase tracking-wider text-white/80">
              Management
            </p>

            <ul className="space-y-1.5">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;

                return (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm transition-all ${
                          isActive
                            ? "bg-red-800 text-amber-300 font-semibold shadow-inner"
                            : "text-red-100 hover:bg-red-900/70 hover:text-white"
                        }`
                      }
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </span>

                      {item.badge && (
                        <span className="bg-amber-500 text-red-950 text-xs font-extrabold px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-red-900/60 text-xs text-red-300/80">
          <div className="flex items-center gap-2">
            <CircleCheck className="w-3.5 h-3.5 text-green-400" />

            <span>System Connected</span>
          </div>

          <p className="mt-2">
            PizzaSlice Admin v1.0
          </p>
        </div>
      </aside>

      {/* ================= MAIN AREA ================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/80 px-6 py-3 flex justify-between items-center shadow-sm z-10">

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/70 border border-gray-200 px-3 py-1.5 rounded-full">

              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  isStoreOpen
                    ? "bg-green-500 animate-pulse"
                    : "bg-red-500"
                }`}
              />

              <span className="text-xs font-semibold text-gray-700">
                {isStoreOpen
                  ? "Accepting Orders"
                  : "Orders Paused"}
              </span>

              <button
                onClick={() => setIsStoreOpen(!isStoreOpen)}
                className="ml-2 text-xs font-bold text-red-700 hover:text-red-900 hover:underline border-l pl-2 border-gray-300"
              >
                {isStoreOpen ? "Pause" : "Resume"}
              </button>
            </div>
          </div>

          {/* Header Right */}
          <div className="flex items-center gap-5">

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-1 rounded-full hover:bg-gray-100/80 transition-colors focus:outline-none focus:ring-2 focus:ring-red-700"
                aria-expanded={isProfileOpen}
                aria-haspopup="true"
              >
                <img
                  src={adminUser.avatar}
                  alt={adminUser.name}
                  className="w-9 h-9 rounded-full object-cover border-2 border-amber-500"
                />

                <div className="text-left hidden md:block">
                  <p className="text-sm font-semibold text-gray-900 leading-none">
                    {adminUser.name}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {adminUser.role}
                  </p>
                </div>

                <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">

                  {/* Account */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs text-gray-500">
                      Signed in as
                    </p>

                    <p className="text-sm font-bold text-gray-800 truncate">
                      {adminUser.email}
                    </p>
                  </div>

                  {/* Profile */}
                  <NavLink
                    to="/admin/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-700"
                  >
                    <User className="w-4 h-4" />
                    Admin Profile
                  </NavLink>

                  {/* Settings */}
                  <NavLink
                    to="/admin/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-700"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </NavLink>

                  {/* Logout */}
                  <div className="border-t border-gray-100 mt-1">
                    <button
                      onClick={() => alert("Logging out...")}
                      className="w-full flex items-center gap-3 text-left px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ================= PAGE CONTENT ================= */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;