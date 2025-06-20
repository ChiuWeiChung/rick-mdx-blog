import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	// DropdownMenuLabel,
	// DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownMenuContainerProps {
	triggerName: React.ReactNode;
	items: (
		| {
				name: string;
				href: string;
				icon?: React.ReactNode;
		  }
		| { element: ReactNode; name: string }
	)[];
}

export default function DropdownMenuContainer({ triggerName, items }: DropdownMenuContainerProps) {
	const renderItems = () => {
		return items.map(item => {
			if ('href' in item) {
				return (
					<DropdownMenuItem key={item.name}>
						<Link href={item.href}>{item.name}</Link>
						{item.icon}
					</DropdownMenuItem>
				);
			} else {
				return <DropdownMenuItem key={item.name}>{item.element}</DropdownMenuItem>;
			}
		});
	};
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline">
					{triggerName}
					<ChevronDown className="size-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="start">
				{renderItems()}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
