import { ReactNode } from 'react';
import { FormControl, FormDescription, FormItem, FormMessage } from '@/components/ui/form';
import { FormField } from '@/components/ui/form';
import { Control, FieldValues } from 'react-hook-form';
import { FileUpload } from '@/components/file-upload';

interface FileUploadFieldProps<TFieldValues extends FieldValues = FieldValues>
	extends React.InputHTMLAttributes<HTMLInputElement> {
	control?: Control<TFieldValues>;
	name: string;
	label?: string;
	className?: string;
	description?: ReactNode;
}

const FileUploadField = (props: FileUploadFieldProps) => {
	const { control, name, description, className, ...inputProps } = props;
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => {
				const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
					const file = event.target.files?.[0];
					if (file) field.onChange(file);
				};
				return (
					<FormItem className={className}>
						<FormControl>
							{/* <Input placeholder={placeholder} {...field} {...inputProps} /> */}
							<FileUpload {...field} {...inputProps} onChange={onChange} />
						</FormControl>
						{description ? <FormDescription>{description}</FormDescription> : null}
						<FormMessage />
					</FormItem>
				);
			}}
		/>
	);
};

export default FileUploadField;
