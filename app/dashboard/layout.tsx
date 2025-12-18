import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Athenas Admin",
  robots: "noindex, nofollow",
};

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
