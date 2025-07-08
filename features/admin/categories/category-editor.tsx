'use client';
import { FileUploadField, InputField } from '@/components/form-fields';
import SmartForm from '@/components/smart-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';

import DialogContainer from '@/components/dialog-container';
import { Plus } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Category,
  createCategorySchema,
  createCategorySchemaKeys,
} from '@/actions/categories/types';

import { getDefaultValues } from '@/utils/form-utils';
import { z } from 'zod/v4';

interface CategoryEditorProps {
  existingCategory?: Partial<Category> & { id: number };
}

const createCategorySchemaWithFile = createCategorySchema.extend({
  iconFile: z.instanceof(File).nullable(),
  coverFile: z.instanceof(File).nullable(),
});
type CreateCategorySchemaWithFile = z.infer<typeof createCategorySchemaWithFile>;

const CategoryEditor = ({ existingCategory }: CategoryEditorProps) => {
  const isCreate = !existingCategory;
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(createCategorySchemaWithFile),
    defaultValues: {
      ...getDefaultValues(createCategorySchemaWithFile),
      ...existingCategory,
    },
  });

  //   const mutateSuccessHandler = (message: string) => {
  //     toast.success(message);
  //     // router.push('/admin/notes');
  //     setOpen(false);
  //   };

  //   const { mutate: createNoteMutation, isPending: isCreatePending } = useMutation({
  //     mutationFn: mutationHandler(createNote),
  //     onSuccess: () => mutateSuccessHandler('類別建立成功'),
  //   });

  //   const { mutate: updateNoteMutation, isPending: isUpdatePending } = useMutation({
  //     mutationFn: mutationHandler(updateNote),
  //     onSuccess: () => mutateSuccessHandler('筆記更新成功'),
  //   });

  const onSubmit = (data: Partial<CreateCategorySchemaWithFile>) => {
    console.log('data', data);
    // if (existingCategory) updateNoteMutation({ ...data, id: existingCategory.id });
    // else createNoteMutation(data);
  };

  //   const isPending = isCreatePending || isUpdatePending;
  const isPending = false;

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)} className="w-fit self-end">
        <Plus />
        新增類別
      </Button>
      <DialogContainer
        title={isCreate ? '新增類別' : '編輯類別'}
        description=""
        open={open}
        onOpenChange={setOpen}
      >
        <SmartForm
          {...form}
          onSubmit={onSubmit}
          className={cn('flex flex-col gap-4', isPending && 'pointer-events-none')}
        >
          <InputField
            name={createCategorySchemaKeys.name}
            label="類別名稱"
            placeholder="請輸入類別名稱"
          />
          <FileUploadField
            name={'iconFile'}
            label="類別 Icon"
            description="建議使用 32x32 的圖片，作為類別列表的圖示"
          />
          <FileUploadField
            name={'coverFile'}
            label="類別封面"
            description="建議使用 800x450 的圖片，作為文章的封面" // 16:9
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button type="submit" disabled={isPending}>
              送出
            </Button>
          </div>
        </SmartForm>
      </DialogContainer>
    </>
  );
};

export default CategoryEditor;
