import Footer from "@/components/layouts/Footer";
import Navbar from "@/components/layouts/Navbar";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-50 bg-white">
        <Navbar />
      </header>
      {children}
      <Footer />
    </main>
  );
}
