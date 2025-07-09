'use client';
import { FileUploadField, InputField } from '@/components/form-fields';
import SmartForm from '@/components/smart-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';

// import DialogContainer from '@/components/dialog-container';
// import { Plus } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Category,
  createCategorySchema,
  type CreateCategoryRequest,
  createCategoryKeys,
} from '@/actions/categories/types';

import { getDefaultValues } from '@/utils/form-utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { createCategoryWithFile, updateCategoryWithFile } from '@/actions/categories';
import { mutationHandler } from '@/utils/react-query-handler';
// import { mutationHandler } from '@/utils/query-utils';

interface CategoryEditorProps {
  existingCategory?: Partial<Category> & { id: number };
}

const CategoryEditor = ({ existingCategory }: CategoryEditorProps) => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      ...getDefaultValues(createCategorySchema),
      ...existingCategory,
    },
  });

  const mutateSuccessHandler = (message: string) => {
    toast.success(message);
    router.back();
  };

  const createMutation = useMutation({
    mutationFn: mutationHandler(createCategoryWithFile),
    onSuccess: () => mutateSuccessHandler('類別建立成功'),
  });

  const updateMutation = useMutation({
    mutationFn: mutationHandler(updateCategoryWithFile),
    onSuccess: () => mutateSuccessHandler('類別更新成功'),
  });

  const onSubmit = (data: CreateCategoryRequest) => {
    if (existingCategory) updateMutation.mutate({ ...data, id: existingCategory.id });
    else createMutation.mutate(data);
  };

  const isPending = updateMutation.isPending || createMutation.isPending;

  return (
    <>
      {/* <Button type="button" onClick={() => setOpen(true)} className="w-fit self-end">
        <Plus />
        新增類別
      </Button> */}

      <SmartForm
        {...form}
        onSubmit={onSubmit}
        className={cn('flex flex-col gap-4', isPending && 'pointer-events-none')}
      >
        <InputField name={createCategoryKeys.name} label="類別名稱" placeholder="請輸入類別名稱" />
        <FileUploadField
          name={createCategoryKeys.iconFile}
          label="類別 Icon"
          description="建議使用 32x32 的圖片，作為類別列表的圖示"
          width={128}
          height={128}
        />
        <FileUploadField
          name={createCategoryKeys.coverFile}
          label="類別封面"
          description="建議使用 800x450 的圖片，作為文章的封面" // 16:9
          width={256}
          // height={144}
        />
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              // setOpen(false);
              router.back();
            }}
          >
            取消
          </Button>
          <Button type="submit" disabled={isPending}>
            送出
          </Button>
        </div>
      </SmartForm>
    </>
  );
};

export default CategoryEditor;
