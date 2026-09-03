import { BrowserRouter, Route, Routes } from "react-router-dom";
import { routes } from "./routes/AppRoutes";
import Layout from "./component/common/Layout";


import adminRoutes from './routes/adminRoutes';
import AdminLayout from './pages/admin/AdminLayout';
import LoginPage from './pages/admin/AdminLogin';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main site routes */}
        <Route path="/" element={<Layout />}>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Route>


        {/* Admin routes */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          {adminRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;