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
  // InsertImage,
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
          },
        }),
        imagePlugin({ disableImageSettingsButton: true }),
        tablePlugin(),
        markdownShortcutPlugin(), // 需要在最底下，才可支援上述的 plugin shortcut
        diffSourcePlugin({ diffMarkdown: props.markdown, viewMode: 'rich-text' }),
        toolbarPlugin({
          toolbarClassName: 'mdx-editor-toolbar !pl-8',
          toolbarContents: () => (
            <>
              <DiffSourceToggleWrapper>
                <div className="flex items-center gap-2">
                  {/* <div className="grid xl:grid-cols-8 grid-cols-4 gap-2"> */}
                  <UndoRedo />
                  <div className="mx-2 inline-block h-4 w-[1px] self-center bg-neutral-300" />
                  <BlockTypeSelect />
                  <BoldItalicUnderlineToggles />
                  <div className="mx-2 inline-block h-4 w-[1px] self-center bg-neutral-300" />
                  <ListsToggle />
                  <div className="mx-2 inline-block h-4 w-[1px] self-center bg-neutral-300" />
                  <InsertTable />
                  {/* <InsertImage /> */}
                  <AddImage />
                  <CreateLink />
                  <ConditionalContents
                    options={[
                      {
                        when: editor => editor?.editorType === 'codeblock',
                        contents: () => <ChangeCodeMirrorLanguage />,
                      },
                      {
                        fallback: () => (
                          <>
                            <InsertCodeBlock />
                          </>
                        ),
                      },
                    ]}
                  />
                  <div className="mx-2 ml-auto inline-block h-4 w-[1px] self-center bg-neutral-300" />
                  <InsertFrontmatter />
                </div>
              </DiffSourceToggleWrapper>
            </>
          ),
        }),
      ]}
      {...props}
      ref={editorRef}
    />
  );
}
