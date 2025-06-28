'use client';

import { Check, ChevronsUpDown, X, XIcon } from 'lucide-react';

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
import { Option } from '@/types/global';

export interface SingleSelectProps<
  T extends string | number | boolean = string | number | boolean,
> {
  placeholder?: string;
  options: Option<T>[];
  value: T;
  onChange: (value?: T) => void;
  creatable?: boolean;
  clearable?: boolean;
}

const matches = (str: string, query: string, exact: boolean = false) =>
  exact
    ? str.toLowerCase() === query.toLowerCase()
    : str.toLowerCase().includes(query.toLowerCase());

export function SingleSelect<T extends string | number = string | number>({
  options,
  value,
  placeholder,
  onChange,
  creatable = false,
  clearable = true,
}: SingleSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [currentOptions, setCurrentOptions] = useState(options);
  const [query, setQuery] = useState('');
  const selectedLabel = currentOptions.find(option => option.value === value)?.label;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full">
          <Button
            variant="outline"
            role="combobox"
            className={cn('w-full justify-between', !selectedLabel && 'text-muted-foreground')}
          >
            {selectedLabel ?? placeholder ?? ''}
            <ChevronsUpDown className="opacity-50" />
          </Button>
          {selectedLabel && clearable && (
            <X
              className="text-card-foreground hover:text-destructive absolute top-1/2 right-8 ml-auto h-4 w-4 -translate-y-1/2"
              onClick={e => {
                e.stopPropagation();
                onChange(undefined);
              }}
            />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput
            placeholder="搜尋選項"
            className="h-9"
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {!creatable && <CommandEmpty>無選項</CommandEmpty>}
            {query &&
              creatable &&
              !currentOptions.some(option => matches(option.label, query, true)) && (
                <CommandItem
                  key={query}
                  value={query}
                  onSelect={() => {
                    const newOption: Option<T> = {
                      value: query as T,
                      label: query,
                      description: 'NEW',
                    };
                    setCurrentOptions([...currentOptions, newOption]);
                    setQuery('');
                  }}
                >
                  新增 {query}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto"
                    onClick={() => {
                      console.log('close create');
                      setQuery('');
                    }}
                  >
                    <XIcon className="h-4 w-4 cursor-pointer text-red-500" />
                  </Button>
                </CommandItem>
              )}
            <CommandGroup>
              {currentOptions.map(opt => (
                <CommandItem
                  value={opt.label}
                  key={opt.value}
                  onSelect={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                >
                  {opt.label}
                  {opt.description && (
                    <span className="text-destructive text-xs font-bold">{opt.description}</span>
                  )}
                  <Check
                    className={cn(
                      'text-primary ml-auto',
                      opt.value === value ? 'opacity-100' : 'opacity-0'
                    )}
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
