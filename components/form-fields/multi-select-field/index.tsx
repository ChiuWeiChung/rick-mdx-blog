import { ReactNode } from 'react';
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FormField } from '@/components/ui/form';
import { MultiSelect, MultiSelectProps } from '@/components/multi-select';
import { Control, FieldValues } from 'react-hook-form';

interface MultiSelectFieldProps<TFieldValues extends FieldValues = FieldValues> extends Omit<MultiSelectProps, 'onChange' | 'value'> {
  control?: Control<TFieldValues>;
  name: string;
  label?: ReactNode;
  className?: string;
  description?: ReactNode;
}

const MultiSelectField = (props: MultiSelectFieldProps) => {
  const { control, name, label, description, className, ...multiSelectProps } = props;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className={className}>
            {label ? <FormLabel>{label}</FormLabel> : null}
            <FormControl>
              <MultiSelect {...field} {...multiSelectProps} />
            </FormControl>
            {description ? <FormDescription>This is your public display name.</FormDescription> : null}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default MultiSelectField;
