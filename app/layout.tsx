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
  return children;
}
