'use client';

import { InputField } from '@/components/form-fields';
import SmartForm from '@/components/smart-form';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { getUpdatedSearchParams } from '@/utils/form-utils';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  QueryTag,
  queryTagSchema,
  queryTagKeys,
} from '@/actions/tags/types';

interface QuerySearchFormProps {
  defaultValues: QueryTag;
}

const QuerySearchForm = ({ defaultValues }: QuerySearchFormProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const form = useForm({
    resolver: zodResolver(queryTagSchema.pick({ name: true })),
    defaultValues: { name: defaultValues.name },
  });

  const onReset = () => {
    form.reset({ name: '' });
    router.push('?');
  };

  const onSubmit = (values: Partial<QueryTag>) => {
    const params = getUpdatedSearchParams(values, searchParams);
    router.push(`?${params.toString()}`);
  };

  return (
    <SmartForm
      {...form}
      onSubmit={onSubmit}
      className="flex items-end w-fit gap-2"
    >
      <InputField
        name={queryTagKeys.name}
        label="標籤名稱"
        placeholder="搜尋標籤名稱"
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
