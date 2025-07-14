'use client';
import { DatePickerField, InputField } from '@/components/form-fields';
import SmartForm from '@/components/smart-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  createPortfolioSchema,
  type CreatePortfolioRequest,
  portfolioKeys,
} from '@/actions/portfolios/types';

import { getDefaultValues } from '@/utils/form-utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { mutationHandler } from '@/utils/react-query-handler';
import { Portfolio } from '@/actions/portfolios/types';
import { createPortfolio, updatePortfolio } from '@/actions/portfolios';

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
    if (portfolio) updateMutation.mutate({ ...data, id: portfolio.id });
    else createMutation.mutate(data);
  };

  const isPending = updateMutation.isPending || createMutation.isPending;

  return (
    <SmartForm
      {...form}
      onSubmit={onSubmit}
      className={cn('flex flex-col gap-4', isPending && 'pointer-events-none')}
    >
      <InputField name={portfolioKeys.projectName} label="專案名稱" placeholder="請輸入專案名稱" />
      <InputField
        name={portfolioKeys.githubUrl}
        label="Github 連結"
        placeholder="請輸入Github 連結"
      />
      <InputField
        name={portfolioKeys.readmeUrl}
        label="Readme 連結"
        placeholder="請輸入Readme 連結"
      />
      <div className="grid grid-cols-2 gap-4">
        <DatePickerField name={portfolioKeys.startDate} label="專案開始日期" />
        <DatePickerField name={portfolioKeys.endDate} label="專案結束日期" />
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
