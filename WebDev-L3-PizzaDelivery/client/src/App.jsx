import { Navigate, Route, Routes } from "react-router-dom";
import { routes } from "./routes/AppRoutes";
import Layout from "./component/common/Layout";

import adminRoutes from './routes/adminRoutes';
import AdminLayout from './pages/admin/AdminLayout';
import LoginPage from './pages/admin/AdminLogin';
import AdminProtectedRoute from './routes/AdminProtectedRoute';
import { Toaster } from 'react-hot-toast';

const renderRoutes = (routeList) =>
  routeList.map((route, index) => (
    <Route
      key={route.path || index}
      index={route.index}
      path={route.index ? undefined : route.path}
      element={route.element}
    >
      {route.children ? renderRoutes(route.children) : null}
    </Route>
  ));

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '16px',
            background: '#fffaf2',
            border: '1px solid #f0d8bd',
            boxShadow: '0 12px 30px rgba(99, 54, 28, 0.14)',
            color: '#2b211b',
            fontWeight: 600,
          },
          success: {
            style: {
              background: '#fff4d9',
              borderColor: '#f3c766',
            },
            iconTheme: { primary: '#d88908', secondary: '#fff4d9' },
          },
          error: {
            style: {
              background: '#fff0ed',
              borderColor: '#e7a18f',
              color: '#8f2f20',
            },
            iconTheme: { primary: '#c1442d', secondary: '#fff0ed' },
          },
        }}
      />
      <Routes>
      {/* Main site routes */}
      <Route path="/" element={<Layout />}>
        {renderRoutes(routes)}
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />

      {/* Admin routes */}
      <Route path="/admin/login" element={<LoginPage />} />
      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          {adminRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Route>
      </Route>
      </Routes>
    </>
  );
}

export default App;
