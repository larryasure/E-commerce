import { Outlet, ScrollRestoration } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function RootLayout() {
  return (
    <>
      <header>
        <Navbar />
      </header>

      <main>
        <Outlet />
        <ScrollRestoration />
      </main>

      <footer>
        <Footer />
      </footer>
    </>
  );
}
