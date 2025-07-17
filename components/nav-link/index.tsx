'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import React from 'react';
import { cn } from '@/lib/utils';

interface NavLinkProps {
	href: string;
	children: React.ReactNode;
	className?: string;
}

const NavLink = ({ href, children, className }: NavLinkProps) => {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const isSearchParamsMatched = `${pathname}?${searchParams.toString()}` === href;
	const isActive = pathname === href || isSearchParamsMatched;

	return (
		<Link href={href} className={cn(isActive && 'text-primary bg-primary-foreground font-bold', className)}>
			{children}
		</Link>
	);
};

export default NavLink;
