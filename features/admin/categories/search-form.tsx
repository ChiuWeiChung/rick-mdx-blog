'use client';

import { InputField } from '@/components/form-fields';
import SmartForm from '@/components/smart-form';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { getUpdatedSearchParams } from '@/utils/form-utils';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  QueryCategory,
  queryCategorySchema,
  queryCategorySchemaKeys,
} from '@/actions/categories/types';

interface QuerySearchFormProps {
  defaultValues: QueryCategory;
}

const QuerySearchForm = ({ defaultValues }: QuerySearchFormProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const form = useForm({
    resolver: zodResolver(queryCategorySchema.pick({ name: true })),
    defaultValues: { name: defaultValues.name },
  });

  const onReset = () => {
    form.reset({ name: '' });
    router.push('?');
  };

  const onSubmit = (values: Partial<QueryCategory>) => {
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
        name={queryCategorySchemaKeys.name}
        label="類別名稱"
        placeholder="搜尋類別名稱"
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
