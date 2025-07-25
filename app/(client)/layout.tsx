import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import LandingBackground from '@/features/client/landing-background';

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative pb-18 z-10 min-h-screen bg-gradient-to-b from-slate-50 to-slate-200 shadow-inner dark:from-gray-900 dark:to-gray-950">
      <LandingBackground />
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
