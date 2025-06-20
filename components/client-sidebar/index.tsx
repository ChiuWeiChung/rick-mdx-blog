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
		<Sidebar>
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
									<SidebarMenuSubItem className="cursor-pointer">hi</SidebarMenuSubItem>
									<SidebarMenuSubItem>hi2</SidebarMenuSubItem>
									<SidebarMenuSubItem>hi3</SidebarMenuSubItem>
									<SidebarMenuSubItem>hi4</SidebarMenuSubItem>
									<SidebarMenuSubItem>hi5</SidebarMenuSubItem>
									<SidebarMenuSubItem>hi6</SidebarMenuSubItem>
									<SidebarMenuSubItem>hi7</SidebarMenuSubItem>
									<SidebarMenuSubItem>hi8</SidebarMenuSubItem>
								</SidebarMenuSub>
							</CollapsibleContent>
						</SidebarMenuItem>
					</Collapsible>
				</SidebarMenu>
			</SidebarContent>
		</Sidebar>
	);
}
