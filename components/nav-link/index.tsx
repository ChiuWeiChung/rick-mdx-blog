'use client';
import { usePathname } from 'next/navigation';
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
	const isActive = pathname === href;
	return (
		<Link href={href} className={cn(isActive && 'text-primary', className)}>
			{children}
		</Link>
	);
};

export default NavLink;
