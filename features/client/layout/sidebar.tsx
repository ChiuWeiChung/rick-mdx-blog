import { BlocksIcon, NotebookIcon } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { getCategoryOptions } from '@/actions/categories';
import NavLink from '@/components/nav-link';
import Image from 'next/image';
import { getUpdatedSearchParams } from '@/utils/form-utils';
import { getOrigin } from '@/lib/router';

export default async function ClientSidebar() {
  const origin = await getOrigin();
  const categories = await getCategoryOptions();

  const getSearchParams = (categoryId?: number) => {
    const searchRequest = getUpdatedSearchParams({
      category: categoryId,
    });
    return `/notes?${searchRequest.toString()}`;
  };

  return (
    <Sidebar variant="floating" className="pt-18">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="mb-4 gap-2 text-xl">
            <NotebookIcon className="!size-6" />
            筆記類別
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="gap-2 pl-2">
              <SidebarMenuItem className="rounded-none border-b border-gray-200">
                <SidebarMenuButton asChild>
                  <NavLink href={getSearchParams()} className="flex h-12 items-center gap-2">
                    <BlocksIcon className="!size-6" />
                    全部
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {categories.map(cat => (
                <SidebarMenuItem key={cat.value} className="rounded-none border-b border-gray-200">
                  <SidebarMenuButton asChild>
                    <NavLink
                      href={getSearchParams(cat.value)}
                      className="flex h-12 items-center gap-2"
                    >
                      <Image
                        src={`${origin}/api/image?key=categories/${cat.label}/icon.png`}
                        alt={cat.label}
                        width={24}
                        height={24}
                        className="object-cover"
                      />
                      {cat.label.split('_').join(' ')}
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
