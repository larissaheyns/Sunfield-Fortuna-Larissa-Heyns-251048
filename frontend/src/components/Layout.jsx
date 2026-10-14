import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return (
    <AuthProvider>
      <div className="sf">
        <Navbar />
        <main><Outlet /></main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
