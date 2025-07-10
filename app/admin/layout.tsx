import PageContent from '@/components/page-content';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AdminSidebar from '@/features/admin/layout/sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <PageContent>
        <SidebarTrigger className="-translate-4" />
        {children}
      </PageContent>
    </SidebarProvider>
  );
}
