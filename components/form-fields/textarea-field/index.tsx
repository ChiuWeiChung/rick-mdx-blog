import { ReactNode } from 'react';
import {
	FormControl,
	FormDescription,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { FormField } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Control, FieldValues } from 'react-hook-form';

interface TextAreaFieldProps<TFieldValues extends FieldValues = FieldValues>
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	control?: Control<TFieldValues>;
	name: string;
	label?: ReactNode;
	className?: string;
	description?: ReactNode;
}

export const TextAreaField = (props: TextAreaFieldProps) => {
	const { control, name, label, placeholder, description, className, ...inputProps } = props;
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className={className}>
					{label ? <FormLabel>{label}</FormLabel> : null}
					<FormControl>
						<Textarea placeholder={placeholder} {...field} {...inputProps} />
					</FormControl>
					{description ? <FormDescription>{description}</FormDescription> : null}
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};
