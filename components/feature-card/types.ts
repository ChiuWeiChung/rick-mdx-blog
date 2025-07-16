import { ReactNode } from "react";

export interface FeatureCardProps {
	title: ReactNode;
	description: string;
	content: string;
	buttonText: string;
	href: string;
	imageUrl?: string;
	variant?: 'outline' | 'default' | 'destructive' | 'secondary' | 'ghost' | 'link';
}
