'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState } from 'react';

export interface DatePickerProps {
  placeholder?: string;
  value?: Date;
  onChange: (value?: Date) => void;
  hideClearButton?: boolean;
  disabled?: boolean;
}

export default function DatePicker({
  placeholder,
  value,
  onChange,
  hideClearButton = false,
  disabled,
}: DatePickerProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen} modal>
      <PopoverTrigger asChild>
        <div className="relative w-full">
          <Button
            variant="outline"
            type="button"
            data-empty={!value}
            className="data-[empty=true]:text-muted-foreground w-full min-w-[9rem] justify-start text-left font-normal"
            disabled={disabled}
          >
            <CalendarIcon />

            {value ? format(value, 'yyyy/MM/dd') : <span>{placeholder}</span>}
          </Button>
          {value && !hideClearButton ? (
            <X
              className="text-card-foreground hover:text-destructive absolute top-1/2 right-2 ml-auto h-4 w-4 -translate-y-1/2"
              onClick={e => {
                e.stopPropagation();
                onChange(undefined);
              }}
            />
          ) : null}
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value ?? undefined}
          onSelect={onChange}
          required
          captionLayout="dropdown"
          defaultMonth={value ?? undefined}
        />
      </PopoverContent>
    </Popover>
  );
}
