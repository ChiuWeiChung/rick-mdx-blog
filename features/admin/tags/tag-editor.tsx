'use client';
import {  InputField } from '@/components/form-fields';
import SmartForm from '@/components/smart-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';

// import DialogContainer from '@/components/dialog-container';
// import { Plus } from 'lucide-react';

import { cn } from '@/lib/utils';
  import {
    Tag,
    createTagSchema,
    type CreateTagRequest,
    createTagKeys,
  } from '@/actions/tags/types';

import { getDefaultValues } from '@/utils/form-utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { mutationHandler } from '@/utils/react-query-handler';
import { updateTagById } from '@/actions/tags';
// import { mutationHandler } from '@/utils/query-utils';

interface TagEditorProps {
  tag: Partial<Tag> & { id: number };
}

const TagEditor = ({ tag }: TagEditorProps) => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(createTagSchema),
    defaultValues: {
      ...getDefaultValues(createTagSchema),
      ...tag,
    },
  });

  const mutateSuccessHandler = (message: string) => {
    toast.success(message);
    router.back();
  };

  const updateMutation = useMutation({
    mutationFn: mutationHandler(updateTagById),
    onSuccess: () => mutateSuccessHandler('標籤更新成功'),
  });
  
  const onSubmit = (data: CreateTagRequest) => {
    updateMutation.mutate({ ...data, id: tag.id });
  };

  const isPending = updateMutation.isPending

  return (
    <SmartForm
      {...form}
      onSubmit={onSubmit}
      className={cn('flex flex-col gap-4', isPending && 'pointer-events-none')}
    >
      <InputField name={createTagKeys.name} label="標籤名稱" placeholder="請輸入標籤名稱" />

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

export default TagEditor;
