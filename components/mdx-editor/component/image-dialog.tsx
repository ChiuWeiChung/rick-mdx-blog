'use client';
import { useState } from 'react';
import { usePublisher, insertImage$ } from '@mdxeditor/editor';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ImageIcon, SeparatorHorizontal } from 'lucide-react';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useForm } from 'react-hook-form';
import { FileUploadField, InputField } from '@/components/form-fields';
import SmartForm from '@/components/smart-form';
import { imageDialogKeys, ImageDialogSchema, imageDialogSchema } from './types';
import { zodResolver } from '@hookform/resolvers/zod';
import { uploadImage } from '@/actions/s3/image';

const AddImage = () => {
  const _insertImage = usePublisher(insertImage$);
  const [openImageDialog, seOpenImageDialog] = useState(false);
  const form = useForm({
    defaultValues: { src: '', title: '', uploadedImage: null },
    resolver: zodResolver(imageDialogSchema),
  });

  const onSubmit = async (data: ImageDialogSchema) => {
    let src = data.src;
    if (data.uploadedImage) {
      const key = await uploadImage({
        file: data.uploadedImage,
        fileName: data.title,
        folder: 'blog-images',
      });
      src = `${window.location.origin}/api/image?key=${key}`;
    }

    _insertImage({
      src,
      altText: data.title,
      title: data.title,
    });
    form.reset();
    seOpenImageDialog(false);
  };

  return (
    <>
      <Button onClick={() => seOpenImageDialog(true)} variant="ghost">
        <ImageIcon className="size-6" />
      </Button>

      <Dialog
        open={openImageDialog}
        onOpenChange={() => seOpenImageDialog(false)}
        aria-labelledby="Create Note"
        aria-describedby="Dialog to create new note"
      >
        <DialogContent
          aria-labelledby="Create Note"
          aria-describedby="Dialog to create new note"
          className="flex w-full max-w-[520px] flex-col gap-6 border-none bg-white px-6 py-9 shadow-md"
        >
          <DialogTitle className="text-2xl font-bold">上傳圖片</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">上傳圖片之 AWS S3</DialogDescription>
          <SmartForm {...form} onSubmit={onSubmit}>
            <div className="flex flex-col gap-2">
              <FileUploadField
                name={imageDialogKeys.uploadedImage}
                accept="image/*"
                label="請上傳圖片"
              />

              <SeparatorHorizontal className="bg-secondary my-4 h-[2px] w-full" />
              <InputField name={imageDialogKeys.src} label="Link" />
              <InputField name={imageDialogKeys.title} label="Title" />

              <div className="flex w-full items-center justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    seOpenImageDialog(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </div>
          </SmartForm>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddImage;
