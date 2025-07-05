import { Loader } from 'lucide-react';
import React from 'react';

const SpinnerLoader = () => {
  return (
    <div className="flex items-center justify-center">
      <Loader className="h-20 w-20 text-primary animate-spin" />
    </div>
  );
};

export default SpinnerLoader;
