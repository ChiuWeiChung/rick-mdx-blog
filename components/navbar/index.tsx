import { Code } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { auth } from '@/auth';
import DropdownMenuContainer from './dropdown-menu';
import { signOutAction } from '@/actions/user';

const Navbar = async () => {
	const session = await auth();
	return (
		<div className="sticky top-0 z-20 w-full bg-transparent">
			<div className="pointer-events-none absolute z-[-1] h-full w-full bg-white opacity-80 shadow-md" />
			<nav className="right-0 left-0 mx-auto flex h-16 max-w-[90rem] items-center pr-[max(env(safe-area-inset-right),1.5rem)] pl-[max(env(safe-area-inset-left),1.5rem)] backdrop-blur-md">
				<Link
					href="/"
					className="text-primary mr-2 flex w-full items-center gap-2 text-2xl font-bold"
				>
					<Code className="size-6" /> Rick&apos;s 開發筆記
				</Link>

				{session && (
					<DropdownMenuContainer
						triggerName={`Hi ${session.user?.name}`}
						items={[
							{ name: 'Playground', href: '/form-playground' },
							{
								name: 'logout',
								element: (
									<form>
										<button type="submit" formAction={signOutAction}>
											Sign Out
										</button>
									</form>
								),
							},
						]}
					/>
				)}
			</nav>
		</div>
	);
};

export default Navbar;
