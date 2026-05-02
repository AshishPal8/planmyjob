import DashboardSidebar from "@/components/layouts/DashboardSidebar";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f0f5ff] flex">
      <DashboardSidebar />
      <main className="flex-1 p-6 lg:p-8">{children}</main>
    </div>
  );
}
