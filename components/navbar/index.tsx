import { Code2Icon, LogOutIcon, SettingsIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { auth } from '@/auth';
import DropdownMenuContainer from './dropdown-menu';
import { signOutAction } from '@/actions/authentication';
import { Button } from '../ui/button';

const Navbar = async () => {
	const session = await auth();

	const navItems = [
		{ name: '筆記', href: '/notes' },
		{ name: '關於我', href: '/profile' },
		{ name: '專案', href: '/portfolios' },
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
          <button type="submit" className="w-full flex items-center gap-2 text-left cursor-pointer">
            <LogOutIcon className="size-4" />
            登出
          </button>
        </form>
      ),
    },
  ];

	const renderNavItems = () => {
		return navItems.map(item => (
			<Button variant="ghost" asChild className="text-lg font-bold hover:scale-110 hover:text-primary hover:bg-primary-foreground" key={item.href}>
				<Link href={item.href}>{item.name}</Link>
			</Button>
		));
	};

	return (
		<div className="sticky top-0 z-20 w-full bg-transparent">
			<div className="pointer-events-none absolute z-[-1] h-full w-full bg-white opacity-80 shadow-md" />
			<nav className="mx-auto flex h-16 max-w-[90rem] items-center pr-[max(env(safe-area-inset-right),1.5rem)] pl-[max(env(safe-area-inset-left),1.5rem)] backdrop-blur-md">
				<Link
					href="/"
					className="text-primary mr-2 flex items-center gap-2 text-sm font-bold md:text-2xl"
				>
					<Code2Icon className="size-6" /> Rick&apos;s DevNotes
				</Link>

				{/* section for navigation */}
				<section className="flex flex-1 items-center justify-center gap-6">
					{renderNavItems()}
				</section>

				{session && (
					<DropdownMenuContainer triggerName={`Hi ${session.user?.name}`} items={dropdownItems} />
				)}
			</nav>
		</div>
	);
};

export default Navbar;
