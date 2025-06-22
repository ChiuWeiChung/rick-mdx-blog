'use client';
import { defaultNoteValues, Note, NoteKeys, noteSchema } from '@/actions/notes/types';
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

interface NoteEditorFormProps {
  id?: string;
}

const NoteEditorForm = ({ id }: NoteEditorFormProps) => {
  const isCreate = !id;
  const [manualUpload, setManualUpload] = useState(false);
  const form = useForm({
    resolver: zodResolver(noteSchema.omit({ id: true, createdAt: true, updatedAt: true })),
    defaultValues: defaultNoteValues,
  });

  const onSubmit = (data: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    // TODO 需要檢查是否有新增的標籤，如果有，需要新增到標籤列表中
    // TODO 需要檢查是否有新增的分類，如果有，需要新增到分類列表中
    console.log(data);
  };

  const handleSwitchChange = (checked: boolean) => {
    console.log('checked', checked);
    setManualUpload(checked);
  };
  console.log('manualUpload', manualUpload);
  return (
    <div>
      <h1 className="my-4 text-2xl font-bold">{isCreate ? '新增筆記' : '編輯筆記'}</h1>
      <SmartForm {...form} onSubmit={onSubmit} className="grid w-[80%] grid-cols-2 gap-6">
        <InputField name={NoteKeys.title} label="文章標題" placeholder="請輸入文章標題" />
        <SingleSelectField
          name={NoteKeys.category}
          label="分類"
          placeholder="請選擇分類"
          // TODO: 從後端取得分類
          options={[
            { label: 'test', value: 'test' },
            { label: 'test2', value: 'test2' },
          ]}
        />

        <MultiSelectField
          name={NoteKeys.tags}
          label="標籤"
          placeholder="請選擇標籤"
          // TODO: 從後端取得標籤
          options={[
            { label: 'test', value: 'test' },
            { label: 'test2', value: 'test2' },
            { label: 'test3', value: 'test3' },
          ]}
        />

        <div className="flex flex-col justify-start gap-2">
          <Label>是否手動上傳檔案</Label>
          <Switch
            checked={manualUpload}
            onCheckedChange={handleSwitchChange}
            className="my-3 w-8 flex-1"
          />
        </div>

        <div className="col-span-2">
          {manualUpload ? (
            <div>
              <FileUploadField name={NoteKeys.coverPath} label="請上傳檔案" required />
            </div>
          ) : (
            <div>輸入文章內容</div>
          )}
        </div>
      </SmartForm>
    </div>
  );
};

export default NoteEditorForm;
