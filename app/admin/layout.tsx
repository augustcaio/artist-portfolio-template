import type { Metadata } from "next";
import AdminNavbar from "@/components/admin/AdminNavbar";

export const metadata: Metadata = {
  title: "Admin | Ana Gabriela Santos",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section style={{ backgroundColor: "#fffce3" }} className="min-h-screen">
      <AdminNavbar />
      {children}
    </section>
  );
}
