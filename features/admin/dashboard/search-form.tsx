'use client';

import { DatePickerField } from '@/components/form-fields';
import SmartForm from '@/components/smart-form';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { getUpdatedSearchParams } from '@/utils/form-utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { queryNoteChartKeys, queryNoteChartSchema, QueryNoteChart } from '@/actions/overview/types';

const QuerySearchForm = ({ defaultValues }: { defaultValues: QueryNoteChart }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm({
    defaultValues: defaultValues,
    resolver: zodResolver(queryNoteChartSchema),
  });

  const onSubmit = (values: Partial<QueryNoteChart>) => {
    const params = getUpdatedSearchParams(values, searchParams);
    router.push(`?${params.toString()}`);
  };

  return (
    <SmartForm
      {...form}
      onSubmit={onSubmit}
      className="flex flex-col justify-end gap-2 lg:flex-row lg:items-end mb-4"
    >
      <div className="flex w-full flex-col items-center gap-4 sm:flex-row lg:w-fit">
        <DatePickerField
          label="起始"
          name={queryNoteChartKeys.startDate}
          placeholder="起始時間"
          className="w-full lg:w-auto"
          hideClearButton={true}
        />
        <DatePickerField
          label="結束"
          name={queryNoteChartKeys.endDate}
          placeholder="結束時間"
          className="w-full lg:w-auto"
          hideClearButton={true}
        />
      </div>
      <Button type="submit">搜尋</Button>
    </SmartForm>
  );
};

export default QuerySearchForm;
