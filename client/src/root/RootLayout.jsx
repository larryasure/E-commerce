import { Outlet, ScrollRestoration } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function RootLayout() {
  return (
    <>
      <header>
        <Navbar />
      </header>

      <main className="min-h-screen  px-6 py-7 ">
        <Outlet />
        <ScrollRestoration />
      </main>

      <footer>
        <Footer />
      </footer>
    </>
  );
}
