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
import React, { useState } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import SwitchField from '@/components/form-fields/switch-field';
import { Button } from '@/components/ui/button';
import { FormMessage } from '@/components/ui/form';
import { createNote } from '@/actions/notes';
import DialogContainer from '@/components/dialog-container';
import { useRouter } from 'next/navigation';
import { ForwardRefEditor } from '@/components/mdx-editor';
import { Edit } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { PreventNavigation } from '@/components/prevent-navigation';
import { useMutation } from '@tanstack/react-query';
import { mutationHandler } from '@/utils/react-query-handler';
import { toast } from 'sonner';
import SpinnerLoader from '@/components/spinner-loader';
import { cn } from '@/lib/utils';
import { useAlertModal } from '@/hooks/use-alert-modal';

interface NoteEditorFormProps {
  id?: string;
  categoryOptions: Option[];
  tagOptions: Option[];
}

const NoteEditorForm = ({ id, categoryOptions, tagOptions }: NoteEditorFormProps) => {
  const isCreate = !id;
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const isMobile = useIsMobile();
  const { openAlertModal } = useAlertModal();

  const form = useForm({
    resolver: zodResolver(createNoteSchema),
    defaultValues: defaultNoteValues,
  });

  const [markdown, manualUpload] = form.watch([
    createNoteSchemaKeys.content,
    createNoteSchemaKeys.manualUpload,
  ]);

  const { mutate: createNoteMutation, isPending } = useMutation({
    mutationFn: mutationHandler(createNote),
    onSuccess: () => {
      toast.success('筆記建立成功');
      router.push('/admin/notes');
    },
  });

  const onSubmit = (data: CreateNote) => {
    createNoteMutation(data);
  };

  const handleMarkdownChange = (markdown: string) => {
    form.setValue(createNoteSchemaKeys.content, markdown, { shouldDirty: true });
  };

  const renderBasicInfo = (title: string, value: string) => {
    return (
      <p>
        <span className="font-bold">{title}:</span> {value || '未設定'}
      </p>
    );
  };

  const handleSaveBtnClick = () => {
    const onInvalid = (errors: FieldErrors<CreateNote>) => {
      const messages = Object.keys(errors).map(key => errors[key as keyof typeof errors]?.message);
      openAlertModal({
        status: 'error',
        title: '請檢查以下錯誤',
        description: (
          <span className="ml-4 flex flex-col gap-2">
            {messages.map(message => (
              <li key={message}>{message}</li>
            ))}
          </span>
        ),
      });
    };

    form.handleSubmit(onSubmit, onInvalid)();
  };

  return (
    <>
      <PreventNavigation
        isDirty={form.formState.isDirty}
        backHref="/admin/notes"
        resetData={() => {}}
      />
      <DialogContainer
        title={isCreate ? '新增筆記' : '編輯筆記'}
        description="請輸入筆記基本資料"
        open={open}
        onOpenChange={setOpen}
      >
        <SmartForm
          {...form}
          onSubmit={onSubmit}
          className={cn('flex flex-col gap-4', isPending && 'pointer-events-none')}
        >
          <InputField
            name={createNoteSchemaKeys.title}
            label="文章標題"
            placeholder="請輸入文章標題"
          />
          <InputField
            name={createNoteSchemaKeys.fileName}
            label="檔案名稱"
            placeholder="請輸入檔案名稱"
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

          <div className="flex items-center justify-evenly gap-4">
            <SwitchField name={createNoteSchemaKeys.visible} label="是否公開" />
            <div className="h-full w-[2px] bg-gray-200" />
            <SwitchField
              name={createNoteSchemaKeys.manualUpload}
              label="手動上傳"
              disabled={!isCreate}
            />
          </div>

          <div className="col-span-2 h-33 w-full">
            {manualUpload && (
              <FileUploadField
                name={createNoteSchemaKeys.file}
                label="請上傳檔案"
                accept="text/markdown"
              />
            )}
          </div>

          <div className="flex items-center justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              取消
            </Button>

            {manualUpload ? (
              <Button type="submit" disabled={isPending}>
                {isPending ? '建立中...' : '建立筆記'}
              </Button>
            ) : (
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                繼續編輯
              </Button>
            )}
          </div>
        </SmartForm>
      </DialogContainer>

      {!open && (
        <div className="bg-primary-foreground fixed right-4 bottom-4 z-[1000] flex flex-col items-center gap-2 rounded-lg p-2 opacity-80">
          <div className="flex items-center justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              取消
            </Button>
            <Button type="button" onClick={handleSaveBtnClick}>
              儲存
            </Button>
          </div>
          <Button type="button" variant="outline" onClick={() => setOpen(true)}>
            文章基本資料 <Edit />
          </Button>

          {!isMobile && (
            <div className="rounded-lg border bg-white/90 p-3 shadow-lg backdrop-blur-sm">
              <div className="space-y-1 text-sm text-gray-600">
                {renderBasicInfo('文章標題', form.watch(createNoteSchemaKeys.title))}
                {renderBasicInfo('檔案名稱', form.watch(createNoteSchemaKeys.fileName))}
                {renderBasicInfo('分類', form.watch(createNoteSchemaKeys.category))}
                {renderBasicInfo('標籤', form.watch(createNoteSchemaKeys.tags)?.join(', '))}
                {renderBasicInfo(
                  '是否公開',
                  form.watch(createNoteSchemaKeys.visible) ? '是' : '否'
                )}
                {renderBasicInfo('手動上傳', manualUpload ? '是' : '否')}
              </div>
            </div>
          )}
        </div>
      )}

      <ForwardRefEditor
        markdown={markdown}
        contentEditableClassName="prose lg:prose-lg"
        onChange={handleMarkdownChange}
      />

      {/* Full page mask */}
      {isPending && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50">
          <SpinnerLoader />
        </div>
      )}
    </>
  );
};

export default NoteEditorForm;
