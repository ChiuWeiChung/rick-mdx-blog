import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FeatureCardProps } from './types';

export function FeatureCard({
  title,
  description,
  content,
  buttonText,
  href,
  imageUrl,
  variant = "outline"
}: FeatureCardProps) {
  return (
    <Card className="transform transition-all hover:scale-105">
      <CardHeader className="pb-0">
        {imageUrl && (
          <div className="overflow-hidden rounded-t-lg -mt-6 -mx-6 mb-4">
            <Image 
              src={imageUrl} 
              alt={title} 
              width={400} 
              height={225} 
              priority
              className="w-full object-cover h-48 hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 dark:text-gray-400">
          {content}
        </p>
      </CardContent>
      <CardFooter>
        <Link href={href} className="w-full">
          <Button variant={variant} className="w-full">{buttonText}</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default FeatureCard; 