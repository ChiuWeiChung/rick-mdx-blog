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

// Only import this to the next file
export default function InitializedMDXEditor({
	editorRef,
	...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
	return (
		<MDXEditor
			plugins={[
				// Example Plugin Usage
				// directivesPlugin({ directiveDescriptors: [AdmonitionDirectiveDescriptor] }),
				// insert block type plugin
				frontmatterPlugin(),
				headingsPlugin(),
				listsPlugin(),
				quotePlugin(),
				thematicBreakPlugin(),
				linkPlugin(),
				linkDialogPlugin({
					// TODO
					linkAutocompleteSuggestions: ['https://virtuoso.dev', 'https://mdxeditor.dev'],
				}),
				codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
				codeMirrorPlugin({
					codeBlockLanguages: {
						js: 'JavaScript',
						javascript: 'JavaScript',
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
					},
				}),
				imagePlugin({
					disableImageSettingsButton: true,
					// imageUploadHandler: file => {
					// 	console.log('file', file);
					// 	return Promise.resolve(
					// 		'https://www.citypng.com/public/uploads/preview/funny-beluga-meme-cat-hd-transparent-background-735811696675541naaswhla0k.png'
					// 	);
					// },
				}),
				tablePlugin(),
				markdownShortcutPlugin(), // 需要在最底下，以支援上述的 plugin shortcut
				diffSourcePlugin({ diffMarkdown: props.markdown, viewMode: 'rich-text' }),
				toolbarPlugin({
					toolbarClassName: 'my-classname',
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
