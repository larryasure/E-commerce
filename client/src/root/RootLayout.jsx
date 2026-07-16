import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function RootLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      <header>{!isAdmin && <Navbar />}</header>

      <main className="min-h-screen mb-10  sm:mb-16 lg:mb-20 ">
        <Outlet />
        <ScrollRestoration />
      </main>

      <footer>{!isAdmin && <Footer />}</footer>
    </>
  );
}
