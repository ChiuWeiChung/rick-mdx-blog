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
import { useEffect, useState } from 'react';
import { Option } from '@/types/global';

export interface SingleSelectProps<
  T extends string | number | boolean = string | number | boolean,
> {
  placeholder?: string;
  options: Option<T>[];
  value: T;
  onChange: (value?: T | null) => void;
  creatable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
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
  disabled = false,
}: SingleSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [currentOptions, setCurrentOptions] = useState(options);
  const [query, setQuery] = useState('');
  const selectedLabel = currentOptions.find(option => option.value === value)?.label;

  // re-mount 時，如果 creatable 為 true，則將 value 中的選項加入到 currentOptions 中
  useEffect(() => {
    if (creatable && value) {
      const isValueInCurrentOptions = currentOptions.some(option => option.value === value);
      if (!isValueInCurrentOptions) {
        setCurrentOptions([
          ...currentOptions,
          { value, label: value, description: 'NEW' } as Option<T>,
        ]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creatable]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn('w-full justify-between', !selectedLabel && 'text-muted-foreground')}
          disabled={disabled}
        >
          {selectedLabel ?? placeholder ?? ''}
          {selectedLabel && clearable && (
            <span
              onClick={e => {
                e.stopPropagation(); // 不要讓外層 Button 展開下拉
                onChange(null); // 清空選項
              }}
              className="hover:text-destructive ml-auto cursor-pointer p-1"
            >
              <X className="pointer-events-auto h-4 w-4" /> {/* 2) 或直接開啟 pointer-events */}
            </span>
          )}
          <ChevronsUpDown className="opacity-50" />
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
