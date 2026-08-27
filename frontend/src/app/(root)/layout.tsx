import Footer from "@/components/layouts/Footer";
import Navbar from "@/components/layouts/Navbar";
import RootMobileTabBar from "@/components/layouts/RootMobileTabBar";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen pb-16 lg:pb-0">
      <header className="sticky top-0 z-50 bg-white">
        <Navbar />
      </header>
      {children}
      <Footer />
      <RootMobileTabBar />
    </main>
  );
}
