import ClientSidebar from '@/features/client/layout/sidebar'
import PageContent from '@/components/page-content'
import { SidebarProvider } from '@/components/ui/sidebar'

export default async function layout({ children }: { children: React.ReactNode }) { 
  return (
      <SidebarProvider>
        <ClientSidebar />
        <PageContent className="relative m-5 p-5 pt-12 pb-18 min-h-screen bg-white">
          {children}
        </PageContent>
      </SidebarProvider>
  )
}
