import FloatingNavbar from "@/components/layout/Navbar";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Athenas Foods",
  description: "Premium Egyptian frozen products exporter",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`antialiased bg-accent/20`}>
        <main className="w-full overflow-x-hidden flex flex-col relative">
          <FloatingNavbar />
          {children}
        </main>
      </body>
    </html>
  );
}
