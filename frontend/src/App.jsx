import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Mission from "./pages/Mission";
import Involved from "./pages/Involved";
import News from "./pages/News";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Donate from "./pages/Donate";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/mission" element={<Mission />} />
        <Route path="/involved" element={<Involved />} />
        <Route path="/news" element={<News />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Auth key="login" mode="login" />} />
        <Route path="/signup" element={<Auth key="signup" mode="signup" />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/donate" element={<Donate />} />
      </Route>
    </Routes>
  );
}
