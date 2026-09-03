import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Navbar />
      <main className="page-transition flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
