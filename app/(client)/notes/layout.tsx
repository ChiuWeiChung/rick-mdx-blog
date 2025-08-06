import ClientSidebar from '@/features/client/layout/sidebar'
import PageContent from '@/components/page-content'
import { SidebarProvider } from '@/components/ui/sidebar'

export default async function layout({ children }: { children: React.ReactNode }) { 
  return (
    <SidebarProvider>
      <ClientSidebar />
      {/* bg-white with  */}
      <PageContent className="relative m-0 md:m-5 min-h-screen bg-white/60 p-5 pt-12 pb-18">
        {children}
      </PageContent>
    </SidebarProvider>
  );
}
