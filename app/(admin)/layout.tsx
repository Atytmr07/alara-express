import type { Metadata } from "next";

// Admin is a demo dashboard — keep it out of search indexes entirely.
export const metadata: Metadata = {
  title: "Yönetim",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-shell">{children}</div>;
}
