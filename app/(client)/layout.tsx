// import './globals.css';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
// import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
// import ClientSidebar from '@/components/client-sidebar';
// import PageContent from '@/components/page-content';

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
