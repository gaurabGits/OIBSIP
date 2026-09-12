import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Settings,
  User,
  LogOut,
  ChevronDown,
  ChevronsLeft,
  Search,
  Bell,
  CircleCheck,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import { getStoreStatus, updateStoreStatus } from "../../services/adminService";


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
    label: "Users",
    to: "/admin/users",
    icon: Users,
  },
];

export function AdminLayout() {
  const [isStoreOpen, setIsStoreOpen] = useState(() => {
    return localStorage.getItem("slicehouse-store-open") !== "false";
  });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [storeStatusLoading, setStoreStatusLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const adminUser = {
    name: user?.fname || "Admin",
    role: "Administrator",
    email: user?.email || "admin@slicehouse.com",
    avatar:
      "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=100&auto=format&fit=crop&q=80",
  };

  const currentPage =
    NAV_ITEMS.find((item) => location.pathname.startsWith(item.to))?.label ??
    "Dashboard";

  useEffect(() => {
    let mounted = true;
    getStoreStatus()
      .then((data) => {
        if (mounted) setIsStoreOpen(data.isOpen !== false);
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setStoreStatusLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const toggleStoreStatus = async () => {
    const next = !isStoreOpen;
    try {
      const data = await updateStoreStatus(next);
      setIsStoreOpen(data.isOpen !== false);
      window.dispatchEvent(new Event("slicehouse-store-status"));
    } catch {
      toast.error("Could not update store status");
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden font-sans bg-gray-50">
      {/* ================= SIDEBAR ================= */}
      <aside
        className={`${
          isCollapsed ? "w-20" : "w-64"
        } flex-shrink-0 bg-red-950 text-white flex flex-col justify-between border-r border-red-900 transition-[width] duration-200`}
      >
        {/* Sidebar Top */}
        <div>
          <div
            className={`flex items-center gap-3 border-b border-red-900/60 p-5 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <div>
              <span className="text-2xl font-extrabold tracking-wide text-[#fffaf2]">
              Slice<span className="text-amber-400">House</span>
            </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-3">
            {!isCollapsed && (
              <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wide text-red-300/70">
                Management
              </p>
            )}

            <ul className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;

                return (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      title={isCollapsed ? item.label : undefined}
                      className={({ isActive }) =>
                        `group relative flex items-center gap-3 rounded-md py-2.5 pl-3 pr-2.5 text-sm transition-colors ${
                          isCollapsed ? "justify-center" : "justify-between"
                        } ${
                          isActive
                            ? "bg-red-900/50 text-amber-300 font-semibold"
                            : "text-red-100/90 hover:bg-red-900/40 hover:text-white"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r bg-amber-400" />
                          )}
                          <span className="flex items-center gap-3 min-w-0">
                            <Icon className="h-5 w-5 flex-shrink-0" />
                            {!isCollapsed && <span className="truncate">{item.label}</span>}
                          </span>

                          {item.badge && !isCollapsed && (
                            <span className="rounded-full bg-amber-500 px-2 py-0.5 text-xs font-bold text-red-950">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-red-900/60 p-4 text-xs text-red-300/80">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`mb-3 flex items-center gap-2 rounded-md px-1 py-1 text-red-200 hover:text-white ${
              isCollapsed ? "justify-center w-full" : ""
            }`}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronsLeft
              className={`h-4 w-4 transition-transform ${isCollapsed ? "rotate-180" : ""}`}
            />
            {!isCollapsed && <span>Collapse</span>}
          </button>

          <div className={`flex items-center gap-2 ${isCollapsed ? "justify-center" : ""}`}>
            <CircleCheck className="h-3.5 w-3.5 flex-shrink-0 text-green-400" />
            {!isCollapsed && <span>System Connected</span>}
          </div>

          {!isCollapsed && <p className="mt-2">SliceHouse Admin v1.0</p>}
        </div>
      </aside>

      {/* ================= MAIN AREA ================= */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="z-10 flex items-center justify-between gap-4 border-b border-gray-200 bg-white px-6 py-3">
          <div className="flex min-w-0 items-center gap-6">
            <h1 className="text-lg font-bold text-gray-900">{currentPage}</h1>

            <div className="hidden items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 sm:flex">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  isStoreOpen ? "animate-pulse bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-xs font-semibold text-gray-700">
                {isStoreOpen ? "Accepting Orders" : "Orders Paused"}
              </span>
              <button
                onClick={toggleStoreStatus}
                disabled={storeStatusLoading}
                className="ml-1 border-l border-gray-300 pl-2 text-xs font-bold text-red-700 hover:text-red-900 hover:underline"
              >
                {isStoreOpen ? "Pause" : "Resume"}
              </button>
            </div>
          </div>

          {/* Header Right */}
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders, items..."
                className="w-56 rounded-full border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-700 placeholder-gray-400 transition focus:border-red-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-900/20"
              />
            </div>

            <button
              className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </button>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 rounded-full p-1 hover:bg-slate-100"
                aria-expanded={isProfileOpen}
                aria-haspopup="true"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-900 text-sm font-semibold text-amber-400">
                  {adminUser.name.charAt(0)}
                </div>
 
                <div className="hidden text-left md:block">
                  <p className="text-sm font-semibold leading-none text-slate-900">
                    {adminUser.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{adminUser.role}</p>
                </div>
 
                <ChevronDown className="hidden h-4 w-4 text-slate-400 md:block" />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
                  {/* Account */}
                  <div className="border-b border-gray-100 px-4 py-3">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="truncate text-sm font-bold text-gray-800">
                      {adminUser.email}
                    </p>
                  </div>

                  {/* Profile */}
                  <NavLink
                    to="/admin/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-700"
                  >
                    <User className="h-4 w-4" />
                    Admin Profile
                  </NavLink>

                  {/* Settings */}
                  <NavLink
                    to="/admin/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-700"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </NavLink>

                  {/* Logout */}
                  <div className="mt-1 border-t border-gray-100">
                    <button
                      onClick={() => {
                        logout();
                        toast.success("Signed out successfully");
                        navigate("/admin/login", { replace: true });
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
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
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;