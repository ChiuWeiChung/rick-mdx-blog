'use client';

import { useForm } from 'react-hook-form';
import {
  playgroundFormDefaultValues,
  playgroundFormKeys,
  PlaygroundFormSchema,
  playgroundFormSchema,
} from './types';
import { zodResolver } from '@hookform/resolvers/zod';
import SmartForm from '@/components/smart-form';
import { Button } from '@/components/ui/button';
import { useAlertModal } from '@/hooks/use-alert-modal';
import { InputField, SingleSelectField, MultiSelectField, SwitchField, FileUploadField, DatePickerField } from '@/components/form-fields';

const options = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
];

const tagsOptions = [
  { label: 'Option 1', value: 1 },
  { label: 'Option 2', value: 2 },
  { label: 'Option 3', value: 3 },
  { label: 'Option 4', value: 4 },
  { label: 'Option 5', value: 5 },
];

const PlaygroundForm = () => {
  const { openAlertModal } = useAlertModal();
  const form = useForm({
    defaultValues: {
      ...playgroundFormDefaultValues,
      image: null,
    },
    resolver: zodResolver(playgroundFormSchema),
  });

  const onSubmit = (values: Partial<PlaygroundFormSchema>) => {
    openAlertModal({
      title: 'Form Submitted',
      description: JSON.stringify(values),
      status: 'success',
    });
  };

  return (
    <SmartForm {...form} onSubmit={onSubmit} className="flex flex-col gap-4">
      <InputField
        name={playgroundFormKeys.name}
        label="Name"
        placeholder="Enter your name"
        description="This is your name"
      />
      <InputField
        name={playgroundFormKeys.email}
        label="Email"
        type="email"
        placeholder="Enter your email"
        description="This is your email"
      />
      <InputField
        name={playgroundFormKeys.password}
        label="Password"
        type="password"
        placeholder="Enter your password"
        description="This is your password"
      />
      <SingleSelectField
        name={playgroundFormKeys.language}
        label="Language"
        placeholder="Select your language"
        options={options}
        creatable
      />
      <MultiSelectField
        name={playgroundFormKeys.tags}
        label="Tags"
        placeholder="Select your tags"
        options={tagsOptions}
        creatable
      />
      <SwitchField
        name={playgroundFormKeys.isPublic}
        label="Is Public"
        description="This is your public display name."
      />
      <DatePickerField
        name={playgroundFormKeys.date}
        label="選擇日期"
        placeholder="選擇日期"
        description="This is your date"
      />

      <FileUploadField
        name={playgroundFormKeys.markdown}
        accept="text/markdown"
        label="請上傳 Markdown 檔案"
      />
      {/* <FileUploadField name="image" accept="image/*" label="請上傳圖片" /> */}

      <Button type="submit">Submit</Button>
    </SmartForm>
  );
};

export default PlaygroundForm;
