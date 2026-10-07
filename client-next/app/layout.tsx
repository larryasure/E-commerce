import type { Metadata } from "next";
import "./globals.css";
import MainContent from "@/components/MainContent";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "PrimePack - Premium Shopping",
  description: "Shop premium products with PrimePack",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behaviour="smooth">
      <body
        className="bg-linear-to-br from-white via-blue-50 to-blue-100"
        suppressHydrationWarning={true}
      >
        <MainContent>
          {children}
          <Toaster position="top-center" richColors />
        </MainContent>
      </body>
    </html>
  );
}
