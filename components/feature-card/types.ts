export interface FeatureCardProps {
	title: string;
	description: string;
	content: string;
	buttonText: string;
	href: string;
	imageUrl?: string;
	variant?: 'outline' | 'default' | 'destructive' | 'secondary' | 'ghost' | 'link';
}
