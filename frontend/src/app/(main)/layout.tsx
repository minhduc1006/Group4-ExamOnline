import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col min-h-[100vh]">
      <Header />
      <div className="flex-grow">{children}</div>
      <Footer />
    </div>
  );
}
