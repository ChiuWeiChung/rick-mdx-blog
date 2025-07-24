import React, { ReactNode } from 'react';
import Image from 'next/image';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { placeholderDataUrl } from '@/constants/placeholder';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  title: ReactNode;
  description: ReactNode;
  content?: ReactNode;
  footer: ReactNode;
  imageUrl?: string;
  className?: string;
}


export function FeatureCard({
	title,
	description,
	content,
	footer,
	imageUrl,
  className,
}: FeatureCardProps) {
	return (
    <Card
      className={cn(
        'transform overflow-hidden outline-offset-10 transition-all duration-300 hover:translate-y-[-1rem] hover:outline-4',
        className
      )}
    >
      <CardHeader className="pb-0">
        {imageUrl && (
          <div className="relative -mx-6 -mt-6 mb-4 aspect-video overflow-hidden rounded-t-lg">
            <Image
              src={imageUrl}
              alt={imageUrl}
              width={1152}
              height={768}
              placeholder={placeholderDataUrl}
              priority
              className="h-full object-cover"
            />
          </div>
        )}
        <CardTitle className="text-lg font-bold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {content }
      </CardContent>
      <CardFooter className="mt-auto">{footer}</CardFooter>
    </Card>
  );
}

export default FeatureCard;
