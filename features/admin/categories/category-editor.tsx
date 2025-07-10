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
import { useMemo } from 'react';
// import { mutationHandler } from '@/utils/query-utils';

interface CategoryEditorProps {
  category?: Partial<Category> & { id: number };
}

const CategoryEditor = ({ category }: CategoryEditorProps) => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      ...getDefaultValues(createCategorySchema),
      ...category,
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

  const defaultIconImage = useMemo(() => {
    if(!category || !category.iconPath) return undefined;
    const src = `${window.location.origin}/api/image?key=${category.iconPath}`;
    return { src, width: 64, height: 64 };
  }, [category]);

  const defaultCoverImage = useMemo(() => {
    if(!category || !category.coverPath) return undefined;
    const src = `${window.location.origin}/api/image?key=${category.coverPath}`;
    return { src, width: 256, height: 144 };
  }, [category]);

  const onSubmit = (data: CreateCategoryRequest) => {
    if (category) updateMutation.mutate({ ...data, id: category.id });
    else createMutation.mutate(data);
  };

  const isPending = updateMutation.isPending || createMutation.isPending;

  return (
    <SmartForm
      {...form}
      onSubmit={onSubmit}
      className={cn('flex flex-col gap-4', isPending && 'pointer-events-none')}
    >
      <InputField name={createCategoryKeys.name} label="類別名稱" placeholder="請輸入類別名稱" />
      <FileUploadField
        name={createCategoryKeys.iconFile}
        label="類別 Icon"
        description="建議使用 32x32 的圖片，作為類別的圖示"
        width={32}
        height={32}
        aspectRatio="1/1"
        defaultImage={defaultIconImage}
      />
      <FileUploadField
        name={createCategoryKeys.coverFile}
        label="類別封面"
        description="建議使用 256x144 的圖片，作為文章的封面" // 16:9
        width={256}
        aspectRatio="16/9"
        defaultImage={defaultCoverImage}
      />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          取消
        </Button>
        <Button type="submit" disabled={isPending}>
          送出
        </Button>
      </div>
    </SmartForm>
  );
};

export default CategoryEditor;
