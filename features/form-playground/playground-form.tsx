'use client';

import { useForm } from 'react-hook-form';
import { playgroundFormDefaultValues, PlaygroundFormSchema, playgroundFormSchema } from './types';
import { zodResolver } from '@hookform/resolvers/zod';
import SmartForm from '@/components/smart-form';
import InputField from '@/components/form-fields/input-field';
import { Button } from '@/components/ui/button';
import SingleSelectField from '@/components/form-fields/single-select-field';
import MultiSelectField from '@/components/form-fields/multi-select-field';
// import { MultiSelect } from '@/components/multi-select';
// import { useState } from 'react';

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
  // const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const form = useForm({
    defaultValues: playgroundFormDefaultValues,
    resolver: zodResolver(playgroundFormSchema),
  });

  console.log('playgroundFormDefaultValues', playgroundFormDefaultValues);

  const onSubmit = (data: PlaygroundFormSchema) => {
    console.log(data);
  };

  return (
    <div>
      <SmartForm {...form} onSubmit={onSubmit} className="flex flex-col gap-4">
        <InputField name="name" label="Name" placeholder="Enter your name" description="This is your name" />
        <InputField name="email" label="Email" type="email" placeholder="Enter your email" description="This is your email" />
        <InputField name="password" label="Password" type="password" placeholder="Enter your password" description="This is your password" />
        <SingleSelectField name="language" label="Language" placeholder="Select your language" options={options} />
        <MultiSelectField name="tags" label="Tags" placeholder="Select your tags" options={tagsOptions} />
        {/* <MultiSelect value={selectedTags} onChange={setSelectedTags} placeholder="Select your tags" options={options} /> */}

        <Button type="submit">Submit</Button>
      </SmartForm>
    </div>
  );
};

export default PlaygroundForm;
