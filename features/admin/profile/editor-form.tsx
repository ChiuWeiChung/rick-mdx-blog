'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FieldErrors, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { ForwardRefEditor } from '@/components/mdx-editor';
import { useMutation } from '@tanstack/react-query';
import { mutationHandler } from '@/utils/react-query-handler';
import { useAlertModal } from '@/hooks/use-alert-modal';
import {
  UpsertProfileRequest,
  upsertProfileSchema,
  upsertProfileSchemaKeys,
} from '@/actions/profile/types';
import { upsertProfile } from '@/actions/profile';
import { useState } from 'react';

interface ProfileEditorProps {
  markdown?: string | null;
}

const ProfileEditor = (props: ProfileEditorProps) => {
  const { openAlertModal } = useAlertModal();
  const [editMode, setEditMode] = useState(false);

  const form = useForm({
    resolver: zodResolver(upsertProfileSchema),
    defaultValues: { content: props.markdown ?? '' },
  });

  const upsertProfileMutation = useMutation({
    mutationFn: mutationHandler(upsertProfile),
    onSuccess: () => {
      setEditMode(false);
    },
    meta: {
      successMessage: { title: '個人資料更新成功' },
      shouldRefresh: true,
    },
  });

  const onSubmit = (data: UpsertProfileRequest) => {
    upsertProfileMutation.mutate(data);
  };

  const handleMarkdownChange = (content: string) => {
    form.setValue(upsertProfileSchemaKeys.content, content, { shouldDirty: true });
  };

  const handleSaveBtnClick = () => {
    const onInvalid = (errors: FieldErrors<UpsertProfileRequest>) => {
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

    openAlertModal({
      status: 'neutral',
      title: '確認儲存',
      description: '請確認是否儲存',
      confirmText: '儲存',
      cancelText: '取消',
      onConfirm: () => {
        form.handleSubmit(onSubmit, onInvalid)();
      },
    });
  };

  return (
    <>
      <div className="mb-2 flex items-center gap-4">
        <h1 className="text-2xl font-bold">個人資料</h1>
        <div className="flex items-center gap-2">
          {editMode ? (
            <>
              <Button
                type="button"
                key="cancel"
                variant="outline"
                onClick={() => {
                  setEditMode(false);
                  form.reset({ content: props.markdown ?? '' });
                }}
              >
                取消
              </Button>
              <Button type="button" key="save" onClick={handleSaveBtnClick}>
                儲存
              </Button>
            </>
          ) : (
            <Button type="button" variant="outline" className="w-32" key="edit" onClick={() => setEditMode(true)}>
              開始編輯
            </Button>
          )}
        </div>
      </div>

      <ForwardRefEditor
        key={editMode ? 'edit' : 'readOnly'}
        markdown={form.watch(upsertProfileSchemaKeys.content)}
        readOnly={!editMode}
        contentEditableClassName="prose prose-sm lg:prose-lg max-w-[80%] !pb-[8rem] [&_img]:!m-0"
        onChange={handleMarkdownChange}
      />
    </>
  );
};

export default ProfileEditor;
