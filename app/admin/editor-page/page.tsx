import MarkdownEditor from '@/features/MarkdownEditor';

const markdown = `
# Hello World
This is a test markdown
[Link](https://virtuoso.dev)
`;

const EditorPage = () => {
	return <MarkdownEditor content={markdown} />;
};

export default EditorPage;
