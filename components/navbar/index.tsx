import { Code2Icon, LogOutIcon, MenuIcon, SettingsIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { auth } from '@/auth';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import DropdownMenuContainer from './dropdown-menu';
import { signOutAction } from '@/actions/authentication';
import { Button } from '../ui/button';

const Navbar = async () => {
  const session = await auth();

  const navItems = [
    { name: '筆記', href: '/notes' },
    { name: '關於我', href: '/profile' },
    { name: '作品集', href: '/portfolios' },
  ];

  const dropdownItems = [
    {
      name: '管理後台',
      href: '/admin',
      icon: <SettingsIcon className="size-4" />,
    },
    {
      name: 'logout',
      element: (
        <form action={signOutAction} className="w-full">
          <button type="submit" className="flex w-full cursor-pointer items-center gap-2 text-left">
            <LogOutIcon className="size-4" />
            登出
          </button>
        </form>
      ),
    },
  ];

  const renderNavItems = () => {
    return navItems.map(item => (
      <Button
        variant="ghost"
        asChild
        className="hover:text-primary hover:bg-primary-foreground font-bold hover:scale-110"
        key={item.href}
      >
        <Link href={item.href}>{item.name}</Link>
      </Button>
    ));
  };

  return (
    <div className="sticky top-0 z-20 w-full bg-transparent">
      <div className="pointer-events-none absolute z-[-1] h-full w-full bg-white opacity-80 shadow-md" />
      <nav className="mx-auto flex h-16 items-center gap-2 pr-[max(env(safe-area-inset-right),1.5rem)] pl-[max(env(safe-area-inset-left),1.5rem)] backdrop-blur-md">
        <Link
          href="/"
          className="text-primary mr-2 hidden items-center gap-2 text-sm font-bold md:flex md:text-2xl"
        >
          <Code2Icon className="size-6" /> Rick&apos;s DevNotes
        </Link>

        {/* section for navigation for desktop */}
        <section className="mr-auto hidden items-center justify-center gap-2 md:flex">
          {renderNavItems()}
        </section>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="mr-auto md:hidden">
              <MenuIcon className="size-6" />
              Menu
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex w-[100vw] flex-col gap-2 opacity-90">
            <Button
              variant="ghost"
              asChild
              className="hover:text-primary hover:bg-primary-foreground text-lg font-bold hover:scale-110"
            >
              <Link href={'/'}>首頁</Link>
            </Button>
            {renderNavItems()}
          </PopoverContent>
        </Popover>

        {session && (
          <DropdownMenuContainer triggerName={`${session.user?.name} 👋 `} items={dropdownItems} />
        )}
      </nav>
    </div>
  );
};

export default Navbar;
