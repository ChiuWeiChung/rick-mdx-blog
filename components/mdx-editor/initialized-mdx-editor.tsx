'use client';
import type { ForwardedRef } from 'react';
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  UndoRedo,
  ListsToggle,
  toolbarPlugin,
  linkPlugin,
  linkDialogPlugin,
  BoldItalicUnderlineToggles,
  MDXEditor,
  diffSourcePlugin,
  type MDXEditorMethods,
  type MDXEditorProps,
  DiffSourceToggleWrapper,
  CreateLink,
  codeBlockPlugin,
  InsertCodeBlock,
  codeMirrorPlugin,
  ConditionalContents,
  ChangeCodeMirrorLanguage,
  imagePlugin,
  tablePlugin,
  InsertTable,
  BlockTypeSelect,
  frontmatterPlugin,
  InsertFrontmatter,
} from '@mdxeditor/editor';

import '@mdxeditor/editor/style.css';
import AddImage from './component/image-dialog';

export default function InitializedMDXEditor({
  editorRef,
  ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
  return (
    <MDXEditor
      plugins={[
        frontmatterPlugin(),
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        linkPlugin(),
        linkDialogPlugin({
          // TODO 透過 API 取得文章的 id，再組成 options
          linkAutocompleteSuggestions: [],
        }),
        codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
        codeMirrorPlugin({
          codeBlockLanguages: {
            js: 'JavaScript',
            javascript: 'JavaScript',
            jsx: 'JavaScript',
            tsx: 'TypeScript',
            ts: 'TypeScript',
            typescript: 'TypeScript',
            css: 'CSS',
            mermaid: 'Mermaid',
            react: 'React',
            console: 'Console',
            sql: 'SQL',
            python: 'Python',
            java: 'Java',
            html: 'HTML',
            json: 'JSON',
            yaml: 'YAML',
            bash: 'Bash',
            plaintext: 'Plain Text',
            dockerfile: 'Dockerfile',
            nginx: 'Nginx',
            http: 'HTTP',
            dotenv: 'Dotenv',
          },
        }),
        imagePlugin({ disableImageSettingsButton: true }),
        tablePlugin(),
        markdownShortcutPlugin(), // 需要在最底下，才可支援上述的 plugin shortcut
        diffSourcePlugin({ diffMarkdown: props.markdown, viewMode: 'rich-text' }),
        toolbarPlugin({
          toolbarClassName:
            'mdx-editor-toolbar !flex-col sm:!flex-row !pl-8 divide-y-2 sm:divide-y-0 sm:divide-x-2 divide-neutral',
          toolbarContents: () => (
            <DiffSourceToggleWrapper>
              <div className="flex flex-wrap items-center gap-2 px-2">
                <UndoRedo />
                <div className="mx-2 inline-block h-4 w-[1px] self-center bg-neutral-300" />
                <BlockTypeSelect />
                <div className="mx-2 inline-block h-4 w-[1px] self-center bg-neutral-300" />
                <BoldItalicUnderlineToggles />
                <div className="mx-2 inline-block h-4 w-[1px] self-center bg-neutral-300" />
                <ListsToggle />
                <div className="mx-2 inline-block h-4 w-[1px] self-center bg-neutral-300" />
                <InsertTable />
                <AddImage />
                <CreateLink />
                <ConditionalContents
                  options={[
                    {
                      when: editor => editor?.editorType === 'codeblock',
                      contents: () => <ChangeCodeMirrorLanguage />,
                    },
                    {
                      fallback: () => <InsertCodeBlock />,
                    },
                  ]}
                />
                <InsertFrontmatter />
              </div>
            </DiffSourceToggleWrapper>
          ),
        }),
      ]}
      {...props}
      ref={editorRef}
    />
  );
}
