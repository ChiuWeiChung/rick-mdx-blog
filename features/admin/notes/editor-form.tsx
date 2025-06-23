'use client';
import {
  defaultNoteValues,
  createNoteSchemaKeys,
  createNoteSchema,
  CreateNote,
} from '@/actions/notes/types';
import { Option } from '@/types/global';
import FileUploadField from '@/components/form-fields/file-upload-field';
import InputField from '@/components/form-fields/input-field';
import MultiSelectField from '@/components/form-fields/multi-select-field';
import SingleSelectField from '@/components/form-fields/single-select-field';
import SmartForm from '@/components/smart-form';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { zodResolver } from '@hookform/resolvers/zod';
// import { Form } from '@/components/ui/form';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import SwitchField from '@/components/form-fields/switch-field';
import { Button } from '@/components/ui/button';
import { FormMessage } from '@/components/ui/form';
import { createNote } from '@/actions/notes';

interface NoteEditorFormProps {
  id?: string;
  categoryOptions: Option[];
  tagOptions: Option[];
}

const NoteEditorForm = ({ id, categoryOptions, tagOptions }: NoteEditorFormProps) => {
  const isCreate = !id;
  const [manualUpload, setManualUpload] = useState(true);
  const form = useForm({
    resolver: zodResolver(createNoteSchema),
    defaultValues: defaultNoteValues,
  });

  const onSubmit = (data: CreateNote) => {
    createNote(data).then(note => {
      console.log('note', note);
    });
  };

  const handleSwitchChange = (checked: boolean) => {
    setManualUpload(checked);
  };
  // console.log('defaultNoteValues', defaultNoteValues);
  // console.log('form.errors', form.formState.errors);
  return (
    <div>
      <h1 className="my-4 text-2xl font-bold">{isCreate ? '新增筆記' : '編輯筆記'}</h1>
      {/* <SmartForm {...form} onSubmit={onSubmit} className="grid w-[80%] grid-cols-2 gap-6"> */}
      <SmartForm {...form} onSubmit={onSubmit} className="flex flex-col gap-4">
        <InputField
          name={createNoteSchemaKeys.title}
          label="文章標題"
          placeholder="請輸入文章標題"
        />
        <SingleSelectField
          name={createNoteSchemaKeys.category}
          label="分類"
          placeholder="請選擇分類"
          options={categoryOptions}
          creatable
        />

        <MultiSelectField
          name={createNoteSchemaKeys.tags}
          label="標籤"
          placeholder="請選擇標籤"
          options={tagOptions}
          creatable
        />

        <div className="flex items-center gap-4">
          <div className="flex flex-col justify-start gap-2">
            <Label>手動上傳</Label>
            <Switch
              checked={manualUpload}
              onCheckedChange={handleSwitchChange}
              className="h-[18px] w-8 flex-1"
            />
          </div>
          <SwitchField name={createNoteSchemaKeys.visible} label="是否公開" />
        </div>

        <FormMessage>
          {
            form.formState.errors['needFileOrContent' as keyof typeof form.formState.errors]
              ?.message
          }
        </FormMessage>
        <div className="col-span-2">
          {manualUpload ? (
            <div>
              <FileUploadField
                name={createNoteSchemaKeys.file}
                label="請上傳檔案"
                accept="text/markdown"
              />
            </div>
          ) : (
            <div>TODO: 輸入文章內容....</div>
          )}
        </div>

        <Button type="submit">建立筆記</Button>
      </SmartForm>
    </div>
  );
};

export default NoteEditorForm;
