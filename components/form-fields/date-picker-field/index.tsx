import { ReactNode } from 'react';
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FormField } from '@/components/ui/form';
import { Control, FieldValues } from 'react-hook-form';
import DatePicker, { DatePickerProps } from '@/components/date-picker';
import { cn } from '@/lib/utils';

interface DatePickerFieldProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<DatePickerProps, 'onChange' | 'value'> {
  control?: Control<TFieldValues>;
  name: string;
  label?: ReactNode;
  className?: string;
  description?: ReactNode;
}

const DatePickerField = (props: DatePickerFieldProps) => {
  const { control, name, label, description, className, ...datePickerProps } = props;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const { onChange, value, ...rest } = field;
        const handleChange = (date?: Date) => {
          if (date) {
            onChange(date.getTime());
          } else {
            field.onChange(null);
          }
        };

        return (
          <FormItem className={cn('relative w-full', className)}>
            {label ? <FormLabel>{label}</FormLabel> : null}
            <FormControl>
              <DatePicker
                onChange={handleChange}
                value={value ? new Date(value) : undefined}
                {...rest}
                {...datePickerProps}
              />
            </FormControl>
            {description ? <FormDescription>{description}</FormDescription> : null}
            <FormMessage className="absolute top-0 right-0 -translate-y-full" />
          </FormItem>
        );
      }}
    />
  );
};

export default DatePickerField;
