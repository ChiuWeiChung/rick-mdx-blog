'use client';

import { Code2, Flame, Image, Notebook, Settings, Tag } from 'lucide-react';
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import NavLink from '../nav-link';

// Menu items.
const items = [
	{
		title: '筆記',
		url: '/admin/notes',
		icon: Notebook,
	},
	{
		title: '類別',
		url: '/admin/categories',
		icon: Flame,
	},
	{
		title: '標籤',
		url: '/admin/tags',
		icon: Tag,
	},
	{
		title: '圖片',
		url: '/admin/imgs',
		icon: Image,
	},
];

export default function AppSidebar() {
	return (
		<Sidebar>
			<SidebarContent>
				<SidebarGroup>
					{/* Add Home Admin Home Logo */}
					<SidebarGroupLabel className="mb-4">
						<Link href="/admin" className="flex items-center gap-2 text-xl">
							<Settings /> DevNote 管理後台
						</Link>
					</SidebarGroupLabel>
					{/* <SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton asChild></SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent> */}
					{/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}
					<SidebarGroupContent className="pl-4">
						<SidebarMenu>
							{items.map(item => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<NavLink href={item.url} className="flex h-12 items-center gap-2 !text-lg">
											<item.icon className="!size-6" />
											{item.title}
										</NavLink>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup className="mb-8 flex-1 justify-end">
					{/* <SidebarGroupLabel>Projects</SidebarGroupLabel> */}
					<SidebarGroupContent className="pl-4">
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<NavLink href={'/'} className="flex h-12 items-center gap-2 !text-lg">
										<Code2 className="!size-6" /> 返回前台
									</NavLink>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
