import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FeatureCardProps } from './types';

export function FeatureCard({
	title,
	description,
	content,
	buttonText,
	href,
	imageUrl,
	variant = 'outline',
}: FeatureCardProps) {
	return (
		<Card className="transform outline-offset-10 transition-all duration-300 hover:translate-y-[-1rem] hover:outline-4">
			<CardHeader className="pb-0">
				{imageUrl && (
					<div className="relative -mx-6 -mt-6 mb-4 aspect-video overflow-hidden rounded-t-lg">
						<Image
							src={imageUrl}
							alt={title}
							width={1152}
							height={768}
							priority
							className="object-cover h-full"
						/>
					</div>
				)}
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>
				<p className="text-gray-500 dark:text-gray-400">{content}</p>
			</CardContent>
			<CardFooter>
				<Link href={href} className="w-full">
					<Button variant={variant} className="w-full">
						{buttonText}
					</Button>
				</Link>
			</CardFooter>
		</Card>
	);
}

export default FeatureCard;
