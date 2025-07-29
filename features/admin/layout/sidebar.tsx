'use client';

import { Flame, Library, Notebook, PenTool, Settings, Tag, UserPen } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import NavLink from '../../../components/nav-link';

// Menu items.
const items = [
  {
    title: '筆記管理',
    url: '/admin/notes',
    icon: Notebook,
  },
  {
    title: '類別管理',
    url: '/admin/categories',
    icon: Flame,
  },
  {
    title: '標籤管理',
    url: '/admin/tags',
    icon: Tag,
  },
  {
    title: '修訂建議',
    url: '/admin/revise',
    icon: PenTool,
  },
  {
    title: '自我介紹管理',
    url: '/admin/profile',
    icon: UserPen,
  },
  {
    title: '作品集管理',
    url: '/admin/portfolios',
    icon: Library,
  },
];

export default function AdminSidebar() {
  return (
    <Sidebar>
      <SidebarTrigger className="absolute top-0 -right-6 hidden md:flex" />
      <SidebarContent>
        <SidebarGroup>
          {/* Add Home Admin Home Logo */}
          <SidebarGroupLabel className="mb-4">
            <Link href="/admin" className="flex items-center gap-2 text-xl font-bold">
              <Settings className="text-neutral-950 w-8 h-8" />
              <h1 className="bg-gradient-to-r from-neutral-600 to-neutral-500 bg-clip-text text-transparent">
                DevNote 管理後台
              </h1>
            </Link>
          </SidebarGroupLabel>
          <SidebarGroupContent className="pl-4">
            <SidebarMenu>
              {items.map(item => (
                <SidebarMenuItem key={item.title} className="rounded-none border-b border-gray-200">
                  <SidebarMenuButton asChild>
                    <NavLink href={item.url} className="flex h-12 items-center gap-2 !text-[1rem]">
                      <item.icon className="!size-4" />
                      {item.title}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
