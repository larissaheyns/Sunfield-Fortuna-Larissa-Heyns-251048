import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import DashboardLayout from "./components/DashboardLayout";
import SiteMeta from "./components/SiteMeta";
import CookieBanner from "./components/CookieBanner";
import Home from "./pages/Home";
import Mission from "./pages/Mission";
import Involved from "./pages/Involved";
import News from "./pages/News";
import Contact from "./pages/Contact";
import Donate from "./pages/Donate";
import Privacy from "./pages/Privacy";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Overview from "./pages/dashboard/Overview";
import Donations from "./pages/dashboard/Donations";
import Profile from "./pages/dashboard/Profile";
import AdminOverview from "./pages/dashboard/AdminOverview";
import AdminWishlist from "./pages/dashboard/AdminWishlist";
import AdminDonations from "./pages/dashboard/AdminDonations";

function DashboardHome() {
  const { user } = useAuth();
  return user.role === "admin" ? <Navigate to="/dashboard/admin" replace /> : <Overview />;
}

function AdminOnly() {
  const { user } = useAuth();
  return user.role === "admin" ? <Outlet /> : <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <SiteMeta />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/mission" element={<Mission />} />
          <Route path="/involved" element={<Involved />} />
          <Route path="/news" element={<News />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/login" element={<Auth key="login" mode="login" />} />
          <Route path="/signup" element={<Auth key="signup" mode="signup" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="donations" element={<Donations />} />
          <Route path="profile" element={<Profile />} />
          <Route path="admin" element={<AdminOnly />}>
            <Route index element={<AdminOverview />} />
            <Route path="wishlist" element={<AdminWishlist />} />
            <Route path="donations" element={<AdminDonations />} />
          </Route>
        </Route>
      </Routes>
      <CookieBanner />
    </AuthProvider>
  );
}
