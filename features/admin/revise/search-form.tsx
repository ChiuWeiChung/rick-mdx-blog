'use client';

import {  SingleSelectField } from '@/components/form-fields';
import SmartForm from '@/components/smart-form';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { getUpdatedSearchParams } from '@/utils/form-utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { QueryNoteMemo, queryNoteMemoSchema, queryNoteMemoKeys } from '@/actions/note-memos/types';
import { Option } from '@/types/global';
// import { Option } from '@/types/option';

interface QuerySearchFormProps {
  defaultValues: QueryNoteMemo;
  noteOptions: Option<string>[];
}

const QuerySearchForm = ({ defaultValues, noteOptions }: QuerySearchFormProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const form = useForm({
    resolver: zodResolver(queryNoteMemoSchema.pick({ postId: true })),
    defaultValues,
  });

  const onReset = () => {
    form.reset({ postId: '' });
    router.push('?');
  };  

  const onSubmit = (values: Partial<QueryNoteMemo>) => {
    const params = getUpdatedSearchParams(values, searchParams);
    router.push(`?${params.toString()}`);
  };

  return (
    <SmartForm {...form} onSubmit={onSubmit} className="flex w-fit items-end gap-2">
      <SingleSelectField
        name={queryNoteMemoKeys.postId}
        label="筆記標題"
        placeholder="搜尋筆記標題"
        options={noteOptions}
        className="min-w-72"
      />

      <Button type="button" variant="outline" onClick={onReset}>
        清除條件
      </Button>
      <Button type="submit" className="min-w-24">
        搜尋
      </Button>
    </SmartForm>
  );
};

export default QuerySearchForm;
