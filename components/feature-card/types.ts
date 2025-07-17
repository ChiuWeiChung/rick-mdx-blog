import { ReactNode } from 'react';

export interface FeatureCardProps {
  title: ReactNode;
  description: ReactNode;
  content: string;
  buttonText: ReactNode;
  href: string;
  imageUrl?: string;
  variant?: 'outline' | 'default' | 'destructive' | 'secondary' | 'ghost' | 'link';
}
