'use client';

import { ChevronDown } from 'lucide-react';
import {
	Sidebar,
	SidebarContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';

export default function ClientSidebar() {
	return (
		<Sidebar variant='floating'  className="pt-18">
			<SidebarContent>
				<SidebarMenu>
					<Collapsible defaultOpen className="group/collapsible">
						<SidebarMenuItem>
							<CollapsibleTrigger asChild>
								<SidebarMenuButton className="text-lg font-bold">
									JavaScript
									<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
								</SidebarMenuButton>
							</CollapsibleTrigger>
							<CollapsibleContent>
								<SidebarMenuSub>
									<SidebarMenuSubItem className="cursor-pointer">Item 1</SidebarMenuSubItem>
									<SidebarMenuSubItem>Item 2</SidebarMenuSubItem>
									<SidebarMenuSubItem>Item 3</SidebarMenuSubItem>
									<SidebarMenuSubItem>Item 4</SidebarMenuSubItem>
									<SidebarMenuSubItem>Item 5</SidebarMenuSubItem>
								</SidebarMenuSub>
							</CollapsibleContent>
						</SidebarMenuItem>
					</Collapsible>
				</SidebarMenu>
			</SidebarContent>
		</Sidebar>
	);
}
