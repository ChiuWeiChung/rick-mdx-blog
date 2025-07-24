'use client';
import {
  DatePickerField,
  InputField,
  FileUploadField,
  TextAreaField,
} from '@/components/form-fields';
import SmartForm from '@/components/smart-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  createPortfolioSchema,
  type CreatePortfolioRequest,
  createPortfolioKeys,
} from '@/actions/portfolios/types';

import { getDefaultValues } from '@/utils/form-utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { mutationHandler } from '@/utils/react-query-handler';
import { Portfolio } from '@/actions/portfolios/types';
import { createPortfolio, updatePortfolio } from '@/actions/portfolios';
import { useMemo } from 'react';

interface PortfolioEditorProps {
  portfolio?: Portfolio & { id: number };
}

const PortfolioEditor = ({ portfolio }: PortfolioEditorProps) => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(createPortfolioSchema),
    defaultValues: {
      ...getDefaultValues(createPortfolioSchema),
      ...portfolio,
      description: portfolio?.description ?? '',
    },
  });

  const mutateSuccessHandler = (message: string) => {
    toast.success(message);
    router.back();
  };

  const createMutation = useMutation({
    mutationFn: mutationHandler(createPortfolio),
    onSuccess: () => mutateSuccessHandler('作品集建立成功'),
  });

  const updateMutation = useMutation({
    mutationFn: mutationHandler(updatePortfolio),
    onSuccess: () => mutateSuccessHandler('作品集更新成功'),
  });

  const onSubmit = (data: CreatePortfolioRequest) => {
    if (portfolio) updateMutation.mutate({ ...data, id: portfolio.id, oldName: portfolio.projectName });
    else createMutation.mutate(data);
  };

  const defaultCoverImage = useMemo(() => {
    if (!portfolio || !portfolio.coverPath) return undefined;
    const src = `${window.location.origin}/api/image?key=${portfolio.coverPath}`;
    return { src, width: 256, height: 144 };
  }, [portfolio]);


  const isPending = updateMutation.isPending || createMutation.isPending;

  return (
    <SmartForm
      {...form}
      onSubmit={onSubmit}
      className={cn('flex flex-col gap-4', isPending && 'pointer-events-none')}
    >
      <InputField name={createPortfolioKeys.projectName} label="專案名稱" placeholder="請輸入專案名稱" />
      <FileUploadField
        name={createPortfolioKeys.coverFile}
        label="作品集封面"
        description="建議使用 256x144 的圖片，作為文章的封面" // 16:9
        width={256}
        aspectRatio="16/9"
        defaultImage={defaultCoverImage}
      />
      <TextAreaField
        name={createPortfolioKeys.description}
        label="作品集描述"
        placeholder="請輸入作品集描述"
        rows={5}
      />
      <InputField
        name={createPortfolioKeys.githubUrl}
        label="Github 連結"
        placeholder="請輸入Github 連結"
      />
      <InputField
        name={createPortfolioKeys.readmeUrl}
        label="Readme 連結"
        placeholder="請輸入Readme 連結"
      />
      <div className="grid grid-cols-2 gap-4">
        <DatePickerField name={createPortfolioKeys.startDate} label="專案開始日期" />
        <DatePickerField name={createPortfolioKeys.endDate} label="專案結束日期" />
      </div>

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

export default PortfolioEditor;
