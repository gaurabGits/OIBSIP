import AdminDashboardPage from "../pages/admin/AdminDashboard";
import AdminOrdersPage from "../pages/admin/AdminOrdersPage";
import InventoryPage from "../pages/admin/InventoryPage";
import UserManagementPage from "../pages/admin/UserManagementPage";

const adminRoutes = [
  {
    path: "dashboard",
    element: <AdminDashboardPage />,
  },
  {
    path: "profile",
    element: <AdminDashboardPage />,
  },
  {
    path: "settings",
    element: <AdminDashboardPage />,
  },
  {
    path: "orders",
    element: <AdminOrdersPage />,
  },
  {
    path: "inventory",
    element: <InventoryPage />,
  },
  {
    path: "users",
    element: <UserManagementPage />,
  },
];

export default adminRoutes;