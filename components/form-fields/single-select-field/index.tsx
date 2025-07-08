import { ReactNode } from 'react';
import {
	FormControl,
	FormDescription,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { FormField } from '@/components/ui/form';
import { SingleSelect, SingleSelectProps } from '@/components/single-select';
import { Control, FieldValues } from 'react-hook-form';

interface SingleSelectFieldProps<TFieldValues extends FieldValues = FieldValues>
	extends Omit<SingleSelectProps, 'onChange' | 'value'> {
	control?: Control<TFieldValues>;
	name: string;
	label?: ReactNode;
	className?: string;
	description?: ReactNode;
}

export const SingleSelectField = (props: SingleSelectFieldProps) => {
	const { control, name, label, description, className, ...singleSelectProps } = props;
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className={className}>
					{label ? <FormLabel>{label}</FormLabel> : null}
					<FormControl>
						<SingleSelect {...field} {...singleSelectProps} />
					</FormControl>
					{description ? (
						<FormDescription>This is your public display name.</FormDescription>
					) : null}
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};
