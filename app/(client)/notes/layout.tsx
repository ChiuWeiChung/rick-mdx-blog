import ClientSidebar from '@/features/client/layout/sidebar'
import PageContent from '@/components/page-content'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

export default async function layout({ children }: { children: React.ReactNode }) {
    
  return (
     <>
      {/* <Navbar /> */}
      <SidebarProvider>
        <ClientSidebar />
        <PageContent className="relative m-2 p-8 pt-12 min-h-screen rounded bg-gradient-to-b from-slate-50 to-slate-200 shadow-inner dark:from-gray-900 dark:to-gray-950">
          <SidebarTrigger className="absolute top-2 left-2" />
          {children}
        </PageContent>
      </SidebarProvider>
    </>
  )
}
