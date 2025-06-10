'use client';

import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState } from 'react';

export interface SingleSelectProps {
	placeholder?: string;
	options: { label: string; value: string }[];
	value: string;
	onChange: (value: string) => void;
}

export function SingleSelect({ options, value, placeholder, onChange }: SingleSelectProps) {
	const [open, setOpen] = useState(false);
	const selectedLabel = options.find(option => option.value === value)?.label;

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					className={cn('justify-between', !selectedLabel && 'text-muted-foreground')}
				>
					{selectedLabel ?? placeholder ?? ''}
					<ChevronsUpDown className="opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
				<Command>
					<CommandInput placeholder="搜尋選項" className="h-9" />
					<CommandList>
						<CommandEmpty>無選項</CommandEmpty>
						<CommandGroup>
							{options.map(opt => (
								<CommandItem
									value={opt.label}
									key={opt.value}
									onSelect={() => {
										console.log('opt.value', opt.value);
										console.log('onChange', onChange);
										onChange(opt.value);
										setOpen(false);
									}}
								>
									{opt.label}
									<Check
										className={cn('ml-auto', opt.value === value ? 'opacity-100' : 'opacity-0')}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
