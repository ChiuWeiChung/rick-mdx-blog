import { ReactNode } from 'react';
import {
	FormControl,
	FormDescription,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control, FieldValues } from 'react-hook-form';

interface InputFieldProps<TFieldValues extends FieldValues = FieldValues>
	extends React.InputHTMLAttributes<HTMLInputElement> {
	control?: Control<TFieldValues>;
	name: string;
	label?: ReactNode;
	className?: string;
	description?: ReactNode;
}

export const InputField = (props: InputFieldProps) => {
	const { control, name, label, placeholder, description, className, required, ...inputProps } =
    props;
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className={className}>
					{label ? <FormLabel>{label} {required && <span className="text-destructive">＊</span>}</FormLabel> : null}
					<FormControl>
						<Input placeholder={placeholder} {...field} {...inputProps} />
					</FormControl>
					{description ? <FormDescription>{description}</FormDescription> : null}
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};
