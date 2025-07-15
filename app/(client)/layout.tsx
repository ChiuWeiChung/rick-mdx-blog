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
    // <>
    //   <Navbar />
    //   <SidebarProvider>
    //     <ClientSidebar />
    //     <PageContent className="z-10 mx-2 mt-2 min-h-screen rounded bg-gradient-to-b from-slate-50 to-slate-200 shadow-inner dark:from-gray-900 dark:to-gray-950">
    //       <SidebarTrigger />
    //       {children}
    //       <Footer />
    //     </PageContent>
    //   </SidebarProvider>
    // </>
  );
}
