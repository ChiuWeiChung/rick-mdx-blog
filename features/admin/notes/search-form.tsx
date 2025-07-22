'use client';
import {
  queryNoteSchema,
  type QueryNote,
  queryNoteKeys,
  defaultQueryNoteValues,
} from '@/actions/notes/types';
import { InputField, MultiSelectField, SingleSelectField, DatePickerField } from '@/components/form-fields';
import SmartForm from '@/components/smart-form';
import { Button } from '@/components/ui/button';
import { Option } from '@/types/global';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { getUpdatedSearchParams } from '@/utils/form-utils';
import { useRouter, useSearchParams } from 'next/navigation';

interface QuerySearchFormProps {
  tagOptions: Option<number>[];
  categoryOptions: Option<number>[];
  defaultValues: QueryNote;
}

const QuerySearchForm = ({ tagOptions, categoryOptions, defaultValues }: QuerySearchFormProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const form = useForm({ resolver: zodResolver(queryNoteSchema), defaultValues });

  const onReset = () => {
    form.reset(defaultQueryNoteValues);
    router.push('?');
  };

  const onSubmit = (values: Partial<QueryNote>) => {
    const params = getUpdatedSearchParams(values, searchParams);
    router.push(`?${params.toString()}`);
  };

  return (
    <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger className="w-24 items-center justify-start gap-2 py-1 text-2xl font-bold text-neutral-400">
          進階搜尋
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 p-0 text-balance">
          <SmartForm
            {...form}
            onSubmit={onSubmit}
            className="grid grid-cols-4 gap-4 rounded-lg bg-neutral-100 p-4"
          >
            <InputField
              name={queryNoteKeys.title}
              label="標題"
              placeholder="搜尋文章標題"
              className="col-span-4 lg:col-span-2 xl:col-span-1"
            />

            <SingleSelectField
              name={queryNoteKeys.visible}
              label="是否顯示"
              placeholder="選擇是否顯示"
              options={[
                { label: '顯示', value: true },
                { label: '不顯示', value: false },
              ]}
              className="col-span-4 lg:col-span-2 xl:col-span-1"
            />
            <SingleSelectField
              name={queryNoteKeys.category}
              label="類別"
              placeholder="選擇類別"
              options={categoryOptions}
              className="col-span-4 lg:col-span-2 xl:col-span-1"
            />

            <MultiSelectField
              name={queryNoteKeys.tags}
              label="標籤"
              placeholder="選擇標籤"
              options={tagOptions}
              className="col-span-4 lg:col-span-2 xl:col-span-1"
            />

            <div className="col-span-4 flex w-full flex-col gap-2 2xl:col-span-2">
              
              <div className="flex flex-col items-end gap-2 lg:flex-row">
                <DatePickerField name={queryNoteKeys.startCreatedTime} label="建立時間" placeholder="起始時間" />
                <DatePickerField name={queryNoteKeys.endCreatedTime} placeholder="結束時間" />
              </div>

              {/* <div className="h-14 min-w-[1px] bg-gray-300" /> */}
            </div>
            <div className="col-span-4 flex w-full flex-col gap-2 2xl:col-span-2">
              
              <div className="flex flex-col items-end gap-2 lg:flex-row">
                <DatePickerField name={queryNoteKeys.startUpdatedTime} label="更新時間" placeholder="起始時間" />
                <DatePickerField name={queryNoteKeys.endUpdatedTime} placeholder="結束時間" />
              </div>
            </div>

            <div className="col-span-1 col-start-4 ml-auto flex w-full justify-end gap-2">
              <Button type="button" variant="outline" onClick={onReset}>
                清除條件
              </Button>
              <Button type="submit" className="min-w-24">
                搜尋
              </Button>
            </div>
          </SmartForm>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default QuerySearchForm;
