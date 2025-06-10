import { ReactNode } from 'react';
import {
	FormControl,
	FormDescription,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { FormField } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { Control, FieldValues } from 'react-hook-form';

interface SwitchFieldProps<TFieldValues extends FieldValues = FieldValues>
	extends React.ComponentProps<typeof SwitchPrimitive.Root> {
	control?: Control<TFieldValues>;
	name: string;
	label?: ReactNode;
	className?: string;
	description?: ReactNode;
}

const SwitchField = (props: SwitchFieldProps) => {
	const { control, name, label, description, className, ...switchProps } = props;
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className={className}>
					{label ? <FormLabel>{label}</FormLabel> : null}
					<FormControl>
						<Switch checked={field.value} onCheckedChange={field.onChange} {...switchProps} />
					</FormControl>
					{description ? <FormDescription>{description}</FormDescription> : null}
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};

export default SwitchField;
