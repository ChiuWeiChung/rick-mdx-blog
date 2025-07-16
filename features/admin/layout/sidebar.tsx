'use client';

import { Code2, Flame, Library, Notebook, PenTool, Settings, Tag, UserPen } from 'lucide-react';
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
      <SidebarContent>
        <SidebarGroup>
          {/* Add Home Admin Home Logo */}
          <SidebarGroupLabel className="mb-4">
            <Link href="/admin" className="flex items-center gap-2 text-xl">
              <Settings /> DevNote 管理後台
            </Link>
          </SidebarGroupLabel>
          <SidebarGroupContent className="pl-4">
            <SidebarMenu>
              {items.map(item => (
                <SidebarMenuItem key={item.title}>
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
