import AdminDashboardPage from "../pages/admin/AdminDashboard";
import AdminOrdersPage from "../pages/admin/AdminOrdersPage";
import InventoryPage from "../pages/admin/InventoryPage";

const adminRoutes = [
  {
    path: "dashboard",
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
];

export default adminRoutes;