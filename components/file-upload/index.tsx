'use client';

import React, { useEffect, useState } from 'react';
import { Edit, Upload } from 'lucide-react';
import { Input } from '../ui/input';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Label } from '../ui/label';
import SpinnerLoader from '../spinner-loader';

export interface FileUploadProps extends Omit<React.ComponentProps<'input'>, 'value'> {
  label?: string;
  value?: File | null;
}

export function FileUpload({ value, width, ...props }: FileUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<{ src: string; width: number; height: number } | null>(null);

  const renderUploadFile = () => {
    if (!value) {
      return <Upload className="h-12 w-12 text-gray-400" />;
    }

    if (isLoading) {
      return <SpinnerLoader />;
    }

    if (image) {
      return (
        <Image
          src={image.src}
          alt="file"
          width={image.width}
          height={image.height}
          className="object-cover"
          style={{ width: width || image.width }}
        />
      );
      // return <Image src={image.src} alt="file" fill className="object-cover" priority />;
    }
    return <p className="text-lg font-bold text-gray-500">{value.name}</p>;
  };

  useEffect(() => {
    if (value && value.type.includes('image')) {
      setIsLoading(true);
      // value is a Image File type, create a fileReader to get the width and height
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
          <Label
            data-slot="form-label"
            className={cn(
              'text-primary cursor-pointer text-2xl font-bold',
              image ? 'absolute top-0 right-0' : ''
            )}
            htmlFor={props.name}
          >
            {value ? (
              <div className="bg-secondary flex items-center justify-center rounded-full p-2">
                <Edit className="size-6 text-gray-400" />
              </div>
            ) : (
              (props.label ?? '請上傳檔案')
            )}
          </Label>

          {renderUploadFile()}

          <Input
            {...props}
            type="file"
            id={props.name}
            name={props.name}
            accept={props.accept || 'image/*'}
            className="sr-only"
          />
        </div>
      </div>
    </div>
  );
}
