import { createElement, HTMLAttributes, isValidElement, ReactElement, ReactNode } from 'react';
import { FieldErrors, FieldValues, UseFormReturn } from 'react-hook-form';
import { Form as FormProvider } from '@/components/ui/form';

interface SmartFormProps<TFieldValues extends FieldValues = FieldValues>
	extends UseFormReturn<TFieldValues> {
	onSubmit?: (args: TFieldValues) => Promise<void> | void;
	onSubmitError?: (errors: FieldErrors<TFieldValues>) => Promise<void> | Promise<boolean> | boolean;
	children: ReactNode;
	className?: HTMLAttributes<HTMLFormElement>['className'];
	allowEnterSubmit?: boolean;
}

interface FormFieldChildProps {
	name: string;
	[key: string]: unknown;
}

export default function SmartForm<TFieldValues extends FieldValues = FieldValues>({
	children,
	onSubmit,
	onSubmitError,
	className,
	...formProps
}: SmartFormProps<TFieldValues>) {
	const { handleSubmit, control } = formProps;

	const onSubmitHandler = onSubmit ? handleSubmit(onSubmit, onSubmitError) : undefined;

	const renderChild = (child: ReactElement<FormFieldChildProps>) => {
		return createElement(child.type, {
			...{
				...child.props,
				control,
				key: child.props.name,
			},
		});
	};

	return (
		<FormProvider {...formProps}>
			<form onSubmit={onSubmitHandler} className={className}>
				{Array.isArray(children)
					? children.map((child: ReactElement) => {
							return isValidElement<FormFieldChildProps>(child) && child.props.name
								? createElement(child.type, {
										...child.props,
										control,
										key: child.props.name,
									})
								: child;
						})
					: renderChild(children as ReactElement<FormFieldChildProps>)}
			</form>
		</FormProvider>
	);
}
