import PageContent from '@/components/page-content';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AdminSidebar from '@/features/admin/layout/sidebar';
import { auth } from '@/auth';
import { notFound } from 'next/navigation';
import { User } from 'lucide-react';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) notFound();
  return (
    <SidebarProvider>
      <AdminSidebar />
      <PageContent>
        <SidebarTrigger className="-translate-4" />
        <div className="absolute top-2 right-10 flex items-center gap-2 text-lg">
          <User className="bg-primary mr-1 rounded-full text-white" />
          <span className="font-bold">Hi, {session.user?.name}</span>
        </div>
        {children}
      </PageContent>
    </SidebarProvider>
  );
}
