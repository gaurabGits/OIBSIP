import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";

function Layout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Navbar />
      <main key={location.pathname} className="page-transition flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
