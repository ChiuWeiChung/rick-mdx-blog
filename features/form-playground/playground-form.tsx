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
import InputField from '@/components/form-fields/input-field';
import { Button } from '@/components/ui/button';
import SingleSelectField from '@/components/form-fields/single-select-field';
import MultiSelectField from '@/components/form-fields/multi-select-field';
import SwitchField from '@/components/form-fields/switch-field';
import FileUploadField from '@/components/form-fields/file-upload-field';
import { useAlertDialog } from '@/hooks/use-alert-dialog';

const options = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
];

const tagsOptions = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
  { label: 'Option 4', value: 'option4' },
  { label: 'Option 5', value: 'option5' },
];

const PlaygroundForm = () => {
  const { openAlertDialog } = useAlertDialog();
  const form = useForm({
    defaultValues: {
      ...playgroundFormDefaultValues,
      image: null,
    },
    resolver: zodResolver(playgroundFormSchema),
  });

  const onSubmit = (values: PlaygroundFormSchema) => {
    console.log('values', values);
    openAlertDialog({
      title: 'Form Submitted',
      description: 'Your form has been submitted successfully.',
      status: 'warning',
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

      <FileUploadField name="image" accept="text/markdown" label="請上傳 Markdown 檔案" />
      {/* <FileUploadField name="image" accept="image/*" label="請上傳圖片" /> */}

      <Button type="submit">Submit</Button>
    </SmartForm>
  );
};

export default PlaygroundForm;
