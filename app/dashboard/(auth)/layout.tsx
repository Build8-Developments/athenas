import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Athenas Admin",
  robots: "noindex, nofollow",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
