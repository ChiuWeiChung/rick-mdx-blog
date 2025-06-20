import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/admin-sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			{/* <AppSidebar /> */}
			<AdminSidebar />
			<main className="flex-1 p-4">
				<SidebarTrigger />
				{children}
			</main>
		</SidebarProvider>
	);
}
