'use client';
import {
  defaultCreateNoteValues,
  createNoteSchemaKeys,
  createNoteSchema,
  CreateNoteRequest,
  Frontmatter,
} from '@/actions/notes/types';
import { Option } from '@/types/global';
import {
  FileUploadField,
  InputField,
  MultiSelectField,
  SingleSelectField,
  SwitchField,
} from '@/components/form-fields';
import SmartForm from '@/components/smart-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useRef, useState } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { createNote, updateNote } from '@/actions/notes';
import DialogContainer from '@/components/dialog-container';
import { useRouter } from 'next/navigation';
import { ForwardRefEditor } from '@/components/mdx-editor';
import { Edit } from 'lucide-react';
import { PreventNavigation } from '@/components/prevent-navigation';
import { useMutation } from '@tanstack/react-query';
import { mutationHandler } from '@/utils/react-query-handler';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useAlertModal } from '@/hooks/use-alert-modal';
import { NoteMemo } from '@/actions/note-memos/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { deleteNoteMemosByPostId } from '@/actions/note-memos';
import HintPopover from '@/components/hint-popover';
import { MDXEditorMethods } from '@mdxeditor/editor';
import { evaluate } from 'next-mdx-remote-client/rsc';

interface NoteEditorFormProps {
  noteToEdit?: Partial<CreateNoteRequest> & { id: number };
  categoryOptions: Option<number>[];
  tagOptions: Option<number>[];
  markdown?: string;
  memos?: NoteMemo[];
}

const NoteEditorForm = ({
  noteToEdit,
  categoryOptions,
  tagOptions,
  memos,
}: NoteEditorFormProps) => {
  const isCreate = !noteToEdit;
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const { openAlertModal } = useAlertModal();
  const editorRef = useRef<MDXEditorMethods>(null);
  const form = useForm({
    resolver: zodResolver(createNoteSchema),
    defaultValues: { ...defaultCreateNoteValues, ...noteToEdit },
  });

  const [content, file] = form.watch([createNoteSchemaKeys.content, createNoteSchemaKeys.file]);

  const mutateSuccessHandler = (message: string) => {
    toast.success(message);
    router.push('/admin/notes');
  };

  // 刪除筆記備註
  const { mutate: deleteNoteMemosMutation } = useMutation({
    mutationFn: mutationHandler(deleteNoteMemosByPostId),
  });

  // 建立筆記
  const { mutate: createNoteMutation, isPending: isCreatePending } = useMutation({
    mutationFn: mutationHandler(createNote),
    onSuccess: () => mutateSuccessHandler('筆記建立成功'),
  });

  // 更新筆記
  const { mutate: updateNoteMutation, isPending: isUpdatePending } = useMutation({
    mutationFn: mutationHandler(updateNote),
    onSuccess: () => {
      if (memos && noteToEdit) deleteNoteMemosMutation(noteToEdit.id.toString()); // 批次刪除筆記備註  (因為筆記更新時， blockId 會改變，所以需要刪除舊的備註，避免備註的 blockId 與筆記的 blockId 不符)
      mutateSuccessHandler('筆記更新成功');
    },
  });

  const onSubmit = async (data: CreateNoteRequest) => {
    // 確認 content 內是否有 frontMatter，截取內部資訊後 (createdAt, description)，更新欄位
    const evaluateResult = await evaluate<Frontmatter>({
      source: data.content,
      options: { parseFrontmatter: true },
    });
    const { frontmatter } = evaluateResult;
    if (frontmatter.description) data.description = frontmatter.description;
    if (frontmatter.createdAt) data.createdAt = new Date(frontmatter.createdAt);
    if (noteToEdit) updateNoteMutation({ ...data, id: noteToEdit.id });
    else createNoteMutation(data);
  };

  const handleMarkdownChange = (markdown: string) => {
    form.setValue(createNoteSchemaKeys.content, markdown, { shouldDirty: true });
  };

  const handleSaveBtnClick = () => {
    const onInvalid = (errors: FieldErrors<CreateNoteRequest>) => {
      const messagesArr = Object.keys(errors).map(
        key => errors[key as keyof typeof errors]?.message
      );
      const messageSet = new Set(messagesArr);
      openAlertModal({
        status: 'error',
        title: '請檢查以下錯誤',
        description: (
          <span className="ml-4 flex flex-col gap-2">
            {Array.from(messageSet).map(message => (
              <li key={message}>{message}</li>
            ))}
          </span>
        ),
      });
    };

    form.handleSubmit(onSubmit, onInvalid)();
  };

  const isPending = isCreatePending || isUpdatePending;

  return (
    <div className="h-[calc(100vh-8rem)] overflow-y-scroll">
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
            required
          />
          <InputField
            name={createNoteSchemaKeys.fileName}
            label="檔案名稱"
            placeholder="請輸入檔案名稱"
            disabled={!isCreate}
            required
          />
          <SingleSelectField
            name={createNoteSchemaKeys.category}
            label="分類"
            placeholder="請選擇分類"
            options={categoryOptions}
            creatable
            required
          />
          <MultiSelectField
            name={createNoteSchemaKeys.tags}
            label="標籤"
            placeholder="請選擇標籤"
            options={tagOptions}
            creatable
            required
          />

          <SwitchField
            name={createNoteSchemaKeys.visible}
            label="是否公開"
            disabled={!isCreate}
            className="w-fit grid-cols-2"
          />

          <div className="col-span-2 h-33 w-full">
            {isCreate && (
              <FileUploadField
                name={createNoteSchemaKeys.file}
                label="請上傳檔案 (Optional)"
                accept="text/markdown"
                onChange={event => {
                  const file = event.target.files?.[0];
                  if (file) {
                    const fileReader = new FileReader();
                    fileReader.onload = e => {
                      const content = e.target?.result;
                      editorRef.current?.setMarkdown(content as string);
                      form.setValue(createNoteSchemaKeys.content, content as string, {
                        shouldDirty: true,
                      });
                    };
                    fileReader.readAsText(file);
                  }
                }}
              />
            )}
          </div>
          <div className="flex items-center justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              取消
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setOpen(false);
                editorRef.current?.focus();
              }}
            >
              繼續編輯
            </Button>

            {!!file && (
              <Button type="submit" disabled={isPending}>
                {isPending ? '建立中...' : '直接建立筆記'}
              </Button>
            )}
          </div>
        </SmartForm>
      </DialogContainer>

      {/* 筆記備註區塊 */}
      {!open && !!memos && memos.length > 0 && (
        <div className="bg-primary-foreground fixed top-28 right-6 z-[1000] flex flex-col items-center gap-2 rounded-lg p-2 opacity-80">
          <div className="flex items-center justify-end gap-4">
            <Accordion type="single" collapsible>
              <AccordionItem value="memos">
                <AccordionTrigger>筆記修訂備註 ({memos.length})</AccordionTrigger>
                <AccordionContent>
                  <div className="rounded-lg border bg-white/90 p-3 shadow-lg backdrop-blur-sm">
                    <div className="divide-y text-sm text-gray-600">
                      {memos.map((memo, index) => (
                        <div key={memo.id} className="flex flex-col py-2">
                          <div className="highlight">
                            {' '}
                            {index + 1}. {memo.selectedContent}
                          </div>
                          <div className="ml-4 text-sm text-gray-600">{memo.content}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      )}

      {!open && (
        <div className="bg-primary-foreground fixed right-6 bottom-4 z-[1000] flex flex-col items-center gap-2 rounded-lg p-2 opacity-80">
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
        </div>
      )}

      <ForwardRefEditor
        markdown={content}
        ref={editorRef}
        contentEditableClassName="prose prose-sm sm:prose-base max-w-[unset]"
        onChange={handleMarkdownChange}
      />

      <HintPopover />
    </div>
  );
};

export default NoteEditorForm;
