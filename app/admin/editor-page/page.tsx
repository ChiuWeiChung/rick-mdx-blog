import MarkdownEditor from '@/features/MarkdownEditor';

const markdown = `
# Hello World
This is a test markdown
[Link](https://virtuoso.dev)
dsafasdadsfd

## 重要句子
meow moew
`;

const EditorPage = () => {
	return <MarkdownEditor content={markdown} />;
};

export default EditorPage;
