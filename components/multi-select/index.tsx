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
import { Badge } from '@/components/ui/badge';

export interface MultiSelectProps {
  placeholder?: string;
  options: { label: string; value: string; description?: string }[];
  value?: string[];
  onChange: (value: string[]) => void;
  creatable?: boolean;
}

const matches = (str: string, query: string, exact: boolean = false) =>
  exact
    ? str.toLowerCase() === query.toLowerCase()
    : str.toLowerCase().includes(query.toLowerCase());

export function MultiSelect({
  options,
  value,
  placeholder,
  onChange,
  creatable = false,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [currentOptions, setCurrentOptions] = useState(options);
  const [query, setQuery] = useState('');

  const handleSelect = (optionValue: string) => {
    if (value?.includes(optionValue)) {
      // Remove from selection
      onChange(value.filter(v => v !== optionValue));
    } else {
      // Add to selection
      onChange([...(value || []), optionValue]);
    }
  };

  const handleRemove = (optionValue: string) => {
    if (value) {
      onChange(value.filter(v => v !== optionValue));
    }
  };

  const selectedOptions = currentOptions.filter(option => value?.includes(option.value));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn('h-9 justify-between', !selectedOptions.length && 'text-muted-foreground')}
        >
          <div className="flex flex-wrap gap-1">
            {selectedOptions.length > 0 ? (
              selectedOptions.map(option => (
                <Badge key={option.value} className="mr-1 mb-1">
                  {option.label}
                  <span
                    className="ring-offset-background focus:ring-ring ml-1 cursor-pointer rounded-full outline-none focus:ring-2 focus:ring-offset-2"
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleRemove(option.value);
                      }
                    }}
                    onMouseDown={e => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemove(option.value);
                    }}
                  >
                    <X className="hover:text-foreground h-3 w-3 text-white" />
                  </span>
                </Badge>
              ))
            ) : (
              <span>{placeholder ?? '請選擇選項'}</span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
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
                    const newOption = { value: query, label: query, description: 'NEW' };
                    setCurrentOptions([...currentOptions, newOption]);
                    setQuery('');
                  }}
                >
                  新增 <Badge className="ml-2">{query}</Badge>
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
                  onSelect={() => handleSelect(opt.value)}
                >
                  {opt.label}
                  {opt.description && (
                    <span className="text-destructive text-xs font-bold">{opt.description}</span>
                  )}
                  <Check
                    className={cn(
                      'text-primary ml-auto h-4 w-4',
                      value?.includes(opt.value) ? 'opacity-100' : 'opacity-0'
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
