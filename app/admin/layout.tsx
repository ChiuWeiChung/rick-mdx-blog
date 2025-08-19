import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AdminSidebar from '@/features/admin/layout/sidebar';
import { auth } from '@/auth';
import { notFound } from 'next/navigation';
import { HomeIcon, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) notFound();
  return (
    <SidebarProvider className="overflow-hidden">
      <AdminSidebar />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <div className="absolute top-2 right-10 hidden items-center gap-4 text-lg md:flex">
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
        </header>
        <div className="relative flex flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
