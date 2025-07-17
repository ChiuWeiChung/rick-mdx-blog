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
    <Card className="transform overflow-hidden outline-offset-10 transition-all duration-300 hover:translate-y-[-1rem] hover:outline-4">
      <CardHeader className="pb-0">
        {imageUrl && (
          <div className="relative -mx-6 -mt-6 mb-4 aspect-video overflow-hidden rounded-t-lg">
            <Image
              src={imageUrl}
              alt={imageUrl}
              width={1152}
              height={768}
              placeholder="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAcHBwcIBwgJCQgMDAsMDBEQDg4QERoSFBIUEhonGB0YGB0YJyMqIiAiKiM+MSsrMT5IPDk8SFdOTldtaG2Pj8ABBwcHBwgHCAkJCAwMCwwMERAODhARGhIUEhQSGicYHRgYHRgnIyoiICIqIz4xKysxPkg8OTxIV05OV21obY+PwP/CABEIAFoAoAMBIgACEQEDEQH/xAAZAAADAQEBAAAAAAAAAAAAAAAAAQIDBAf/2gAIAQEAAAAA9a1qqdAwFKmZz59LqqbGApUzMcul1VMbAlJRMcul1TZQCSIzzWGlVbYAISjLMzurpsQIEowybunTBISUkc+Va6WNIlJJTMYZVvrQKVCQkpjHMd2BEZoq2pnLNc1t0phId3UxOayBtCACqlIP/8QAGAEBAQEBAQAAAAAAAAAAAAAAAAECAwT/2gAIAQIQAAAA7ACUCTndUiPO3qqkkVQgoP/EABcBAQEBAQAAAAAAAAAAAAAAAAABAgP/2gAIAQMQAAAAwALAF65yKt7zOYLdEAAD/8QAHRAAAwEBAQADAQAAAAAAAAAAAQISEwMRABAgMP/aAAgBAQABAgAMGqqqvffv32qJ9LEhg1VVVVVVVVVVFiwYNQaqqqqqqqqixcsGDBqDVVVV3d3RcvdhgwYMGqqu7u6qixe7BDUGqqqqu7u7Z2e7BB9qqqqq7u9NG6M96Bg1VV3d3d3d6N0bppovQdNNNdNNd99tdNNNC5e7Hcd9999j3Pc9tth2HbTTU9S5ex2HbbYdj2PbbXXXYdh21PXU9T00/J/gPh+E/j//xAAbEAEBAAIDAQAAAAAAAAAAAABhAAEgEDBAcP/aAAgBAQADPwD5Eztjh6mZmZ5z1szq6Pt//8QAHREBAQABBAMAAAAAAAAAAAAAABEBAhASMCAhQP/aAAgBAgEBPwDqvTXJjUqqqqu3tcsalXwu0cXFPh//xAAcEQEBAAICAwAAAAAAAAAAAAAAEQESAhAgMED/2gAIAQMBAT8A9UTziNWqIiIid544Z4NUTqIiqvxf/9k="
              priority
              className="h-full object-cover"
            />
          </div>
        )}
        <CardTitle className="text-lg font-bold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 dark:text-gray-400">{content}</p>
      </CardContent>
      <CardFooter className="mt-auto">
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
