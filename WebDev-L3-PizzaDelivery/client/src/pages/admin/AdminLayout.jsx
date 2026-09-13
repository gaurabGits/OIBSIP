import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Settings,
  User,
  LogOut,
  ChevronDown,
  ChevronsLeft,
  Users,
  Menu,
} from "lucide-react";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import {
  getAllOrders,
  getStoreStatus,
  updateStoreStatus,
} from "../../services/adminService";

const STORE_STATUS_KEY = import.meta.env.VITE_STORE_STATUS_KEY;

const NAV_ITEMS = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Orders", to: "/admin/orders", icon: ShoppingBag },
  { label: "Inventory", to: "/admin/inventory", icon: Package },
  { label: "Users", to: "/admin/users", icon: Users },
];

export function AdminLayout() {
  const [isStoreOpen, setIsStoreOpen] = useState(
    () => localStorage.getItem(STORE_STATUS_KEY) !== "false"
  );
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [storeStatusLoading, setStoreStatusLoading] = useState(true);
  const [newOrderCount, setNewOrderCount] = useState(0);

  const profileRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const adminUser = {
    name: user?.fname || "Admin",
    role: "Administrator",
    email: user?.email || "admin@slicehouse.com",
  };

  const currentPage =
    NAV_ITEMS.find((item) => location.pathname.startsWith(item.to))?.label ??
    "Dashboard";

  // close the mobile menu whenever we navigate somewhere
  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [location.pathname]);

  // get the real store status from the server on first load
  useEffect(() => {
    let mounted = true;

    getStoreStatus()
      .then((data) => {
        if (!mounted) return;
        const open = data.isOpen !== false;
        setIsStoreOpen(open);
        localStorage.setItem(STORE_STATUS_KEY, String(open));
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setStoreStatusLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadNewOrderCount = async () => {
      try {
        const data = await getAllOrders();
        const orders = Array.isArray(data?.orders) ? data.orders : [];

        if (mounted) {
          setNewOrderCount(
            orders.filter((order) => order.status === "Order Received").length
          );
        }
      } catch {
        // Keep the last known count when the background refresh fails.
      }
    };

    loadNewOrderCount();
    const interval = setInterval(loadNewOrderCount, 15000);
    window.addEventListener("slicehouse-orders-updated", loadNewOrderCount);

    return () => {
      mounted = false;
      clearInterval(interval);
      window.removeEventListener("slicehouse-orders-updated", loadNewOrderCount);
    };
  }, []);

  // close the profile dropdown when clicking outside it
  useEffect(() => {
    if (!isProfileOpen) return;

    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileOpen]);

  async function toggleStoreStatus() {
    const next = !isStoreOpen;
    setIsStoreOpen(next);

    try {
      const data = await updateStoreStatus(next);
      const confirmed = data.isOpen !== false;
      setIsStoreOpen(confirmed);
      localStorage.setItem(STORE_STATUS_KEY, String(confirmed));
      window.dispatchEvent(new Event("slicehouse-store-status"));
      toast.success(confirmed ? "Now accepting orders" : "Orders paused");
    } catch {
      setIsStoreOpen(!next); // revert if the request failed
      toast.error("Could not update store status");
    }
  }

  function handleLogout() {
    logout();
    toast.success("Signed out successfully");
    navigate("/admin/login", { replace: true });
  }

  const sidebar = (
    <>
      <div>
        {/* Logo */}
        <div
          className={`flex h-16 items-center gap-2 border-b border-white/10 px-5 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <span className="flex h-8 w-8 font-extrabold tracking-wider  flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#C1442D] to-amber-400 text-white">
            S
          </span>
          {!isCollapsed && (
            <span className="text-xl font-extrabold tracking-wider text-white">
              Slice<span className="text-amber-400">House</span>
            </span>
          )}
        </div>

        <nav className="p-3">
          {!isCollapsed && (
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-white/50">
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
                      `relative flex items-center rounded-lg py-2.5 pl-3 pr-3 text-sm transition-colors ${
                        isCollapsed ? "justify-center" : "justify-between gap-3"
                      } ${
                        isActive
                          ? "bg-white/10 font-semibold text-white"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-amber-400" />
                        )}
                        <span className="flex min-w-0 items-center gap-3">
                          <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-amber-400" : ""}`} />
                          {!isCollapsed && <span className="truncate">{item.label}</span>}
                        </span>
                        {item.label === "Orders" && newOrderCount > 0 && !isCollapsed && (
                          <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[11px] font-bold text-slate-900">
                            {newOrderCount}
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

      {/* Sidebar footer */}
      <div className="border-t border-white/10 p-3">
        <div className="mb-2 flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 sm:hidden">
          <span className="flex items-center gap-2 text-xs text-white/70">
            <span className={`h-1.5 w-1.5 rounded-full ${isStoreOpen ? "bg-emerald-400" : "bg-rose-400"}`} />
            {isStoreOpen ? "Accepting orders" : "Orders paused"}
          </span>
          <button
            type="button"
            onClick={toggleStoreStatus}
            disabled={storeStatusLoading}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 disabled:opacity-50"
          >
            {isStoreOpen ? "Pause" : "Resume"}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          className={`mb-2 hidden items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-white/70 hover:bg-white/5 hover:text-white lg:flex ${
            isCollapsed ? "w-full justify-center" : ""
          }`}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronsLeft className={`h-4 w-4 transition-transform ${isCollapsed ? "rotate-180" : ""}`} />
          {!isCollapsed && <span>Collapse</span>}
        </button>

        {!isCollapsed && (
          <div className="flex items-center gap-2 px-3 text-[11px] text-white/50">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            System connected
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
      {/* Desktop sidebar */}
      <aside
        className={`hidden flex-shrink-0 flex-col justify-between bg-gradient-to-b from-[#3A0F0A] to-[#2A0A06] transition-[width] duration-200 lg:flex ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {sidebar}
      </aside>

      {/* Mobile sidebar */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileNavOpen(false)} />
          <aside className="relative flex w-64 flex-shrink-0 flex-col justify-between bg-gradient-to-b from-[#3A0F0A] to-[#2A0A06]">
            {sidebar}
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="z-10 flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-4">
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>

            <h1 className="truncate font-serif text-lg font-extrabold text-slate-900">
              {currentPage}
            </h1>

            <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 sm:flex">
              <span
                className={`h-2 w-2 rounded-full ${isStoreOpen ? "animate-pulse bg-emerald-500" : "bg-rose-500"}`}
              />
              <span className="text-xs font-medium text-slate-600">
                {isStoreOpen ? "Accepting orders" : "Orders paused"}
              </span>
              <button
                type="button"
                onClick={toggleStoreStatus}
                disabled={storeStatusLoading}
                className="ml-1 border-l border-slate-200 pl-2 text-xs font-semibold text-amber-600 hover:text-amber-700 hover:underline disabled:opacity-50"
              >
                {isStoreOpen ? "Pause" : "Resume"}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="flex items-center gap-2.5 rounded-lg p-1 pl-1.5 hover:bg-slate-100"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-sm font-semibold text-slate-900">
                  {adminUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden text-left md:block">
                  <p className="text-sm font-semibold leading-none text-slate-900">{adminUser.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{adminUser.role}</p>
                </div>
                <ChevronDown
                  className={`hidden h-4 w-4 text-slate-400 transition-transform md:block ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="text-xs text-slate-500">Signed in as</p>
                    <p className="truncate text-sm font-semibold text-slate-900">{adminUser.email}</p>
                  </div>

                  <NavLink
                    to="/admin/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  >
                    <User className="h-4 w-4" />
                    Admin profile
                  </NavLink>

                  <NavLink
                    to="/admin/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </NavLink>

                  <div className="mt-1 border-t border-slate-100">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;