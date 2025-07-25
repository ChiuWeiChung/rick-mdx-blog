import PageContent from '@/components/page-content';
import { SidebarProvider } from '@/components/ui/sidebar';
import AdminSidebar from '@/features/admin/layout/sidebar';
import { auth } from '@/auth';
import { notFound } from 'next/navigation';
import { HomeIcon, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) notFound();
  return (
    <SidebarProvider>
      <AdminSidebar />

      <PageContent className="relative flex flex-col gap-4 p-1 md:p-6">
        <div className="absolute top-2 right-10 items-center gap-4 text-lg hidden md:flex">
          <div className="flex items-center gap-2">
            <User className="bg-primary mr-1 rounded-full text-white" />
            <span className="font-bold">{session.user?.name}</span>
          </div>

          <Link href={'/'} className="flex h-12 items-center gap-2 !text-lg">
            <Button variant="outline">
              <HomeIcon /> 返回前台
            </Button>
          </Link>
        </div>
        {children}
      </PageContent>
    </SidebarProvider>
  );
}
