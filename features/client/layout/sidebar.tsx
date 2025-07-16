import { NotebookIcon } from 'lucide-react';
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
import NavLink from '../../../components/nav-link';
import { headers } from 'next/headers';
import Image from 'next/image';
import { getUpdatedSearchParams } from '@/utils/form-utils';

export default async function ClientSidebar() {
  const headersList = await headers();
  const protocol = headersList.get('x-forwarded-proto') ?? 'http';

  const host = headersList.get('host');
  const origin = `${protocol}://${host}`;
  const categories = await getCategoryOptions();

  const getSearchParams = (categoryName: string) => {
    const searchRequest = getUpdatedSearchParams({
      category: categoryName,
    });
    return `/notes/?${searchRequest.toString()}`;
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
              {categories.map(cat => (
                <SidebarMenuItem key={cat.value} className="rounded-none border-b border-gray-200">
                  <SidebarMenuButton asChild>
                    <NavLink
                      href={getSearchParams(cat.label)}
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
