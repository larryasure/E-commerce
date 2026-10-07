"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthHydrate from "@/components/AuthHydrate";

export default function MainContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar />}

      <main
        className={`min-h-screen ${
          isAdmin ? "" : "mt-16 mb-10 sm:mb-8 lg:mb-10"
        }`}
      >
        <AuthHydrate />
        {children}
      </main>

      {!isAdmin && <Footer />}
    </>
  );
}
