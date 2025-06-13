'use client';

import React, { useEffect, useState } from 'react';
import { Edit, Upload } from 'lucide-react';
import { Input } from '../ui/input';
import { FormLabel } from '../ui/form';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface FileUploadProps extends Omit<React.ComponentProps<'input'>, 'value'> {
	label?: string;
	value?: File | null;
}

export function FileUpload({ value, ...props }: FileUploadProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [image, setImage] = useState<{ src: string; width: number; height: number } | null>(null);

	useEffect(() => {
		if (value) {
			setIsLoading(true);
			// value is a File type, create a fileReader to get the width and height
			const fileReader = new FileReader();
			fileReader.onload = function () {
				const image = new window.Image();
				if (fileReader.result && typeof fileReader.result === 'string') {
					image.src = fileReader.result;
					image.onload = function () {
						setImage({
							src: image.src,
							width: image.width,
							height: image.height,
						});
						setIsLoading(false);
					};
				}
			};
			fileReader.readAsDataURL(value);
		}
	}, [value]);

	return (
		<div
			className={`rounded-lg border-2 border-dashed border-gray-300 bg-white p-4 text-center transition-colors hover:border-gray-400 ${
				props.disabled ? 'cursor-not-allowed opacity-50' : ''
			} ${props.className}`}
		>
			<div className="space-y-4">
				<div className="relative flex flex-col items-center justify-center gap-4">
					{props.label ? (
						<FormLabel
							className={cn(
								'text-primary cursor-pointer text-2xl font-bold',
								image ? 'absolute top-0 right-0' : ''
							)}
							htmlFor={props.name}
						>
							{image ? (
								<div className="bg-secondary flex items-center justify-center rounded-full p-2">
									<Edit className="size-6 text-gray-400" />
								</div>
							) : (
								props.label
							)}
						</FormLabel>
					) : null}

					{isLoading ? (
						<div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-400 border-t-transparent" />
					) : image ? (
						<Image src={image.src} alt="file" width={image.width} height={image.height} />
					) : (
						<Upload className="h-12 w-12 text-gray-400" />
					)}
					<Input
						{...props}
						type="file"
						id={props.name}
						name={props.name}
						accept="image/*"
						className="sr-only"
					/>
				</div>
			</div>
		</div>
	);
}
