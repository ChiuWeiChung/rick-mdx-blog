'use client';

import { Check, ChevronsUpDown, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

export interface MultiSelectProps {
  placeholder?: string;
  options: { label: string; value: string }[];
  value?: string[];
  onChange: (value: string[]) => void;
}

export function MultiSelect({ options, value, placeholder, onChange }: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (optionValue: string) => {
    if (value?.includes(optionValue)) {
      // Remove from selection
      onChange(value.filter((v) => v !== optionValue));
    } else {
      // Add to selection
      onChange([...(value || []), optionValue]);
    }
  };

  const handleRemove = (optionValue: string) => {
    if (value) {
      onChange(value.filter((v) => v !== optionValue));
    }
  };

  const selectedOptions = options.filter((option) => value?.includes(option.value));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className={cn('justify-between min-h-10 h-auto', !selectedOptions.length && 'text-muted-foreground')}>
          <div className="flex gap-1 flex-wrap">
            {selectedOptions.length > 0 ? (
              selectedOptions.map((option) => (
                <Badge
                  key={option.value}
                  //   variant="secondary"
                  className="mr-1 mb-1"
                >
                  {option.label}
                  <span
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleRemove(option.value);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemove(option.value);
                    }}
                  >
                    <X className="h-3 w-3 text-white hover:text-foreground" />
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
          <CommandInput placeholder="搜尋選項" className="h-9" />
          <CommandList>
            <CommandEmpty>無選項</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem value={opt.label} key={opt.value} onSelect={() => handleSelect(opt.value)}>
                  {opt.label}
                  <Check className={cn('ml-auto h-4 w-4', value?.includes(opt.value) ? 'opacity-100' : 'opacity-0')} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
