'use client';

import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import React from 'react';
import { ArrowLeftCircleIcon } from 'lucide-react';

interface GoBackButtonProps {
  children: React.ReactNode;
}

const GoBackButton = ({ children }: GoBackButtonProps) => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <Button variant="outline" type="button" onClick={handleGoBack} className="w-full md:w-auto">
      <ArrowLeftCircleIcon className="h-4 w-4" />
      {children}
    </Button>
  );
};

export default GoBackButton;
