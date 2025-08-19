import ClientSidebar from '@/features/client/layout/sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export default async function layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <ClientSidebar />
      <SidebarInset className="mx-5 my-2 bg-white/60 p-4 pb-18 overflow-hidden">
        <SidebarTrigger className="fixed -ml-10" />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
