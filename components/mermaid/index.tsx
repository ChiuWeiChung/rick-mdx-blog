'use client';

import { Mermaid as MDXMermaid } from 'mdx-mermaid/Mermaid';
import { useEffect, useReducer } from 'react';

interface MermaidProps {
	chart: string;
}

// 簡單的 Mermaid 組件，直接使用 mdx-mermaid/Mermaid
const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
	const [, forceRender] = useReducer(x => x + 1, 0);

	// NOTE: 為了解決了一個惱人的 bug：Mermaid 圖表在首次渲染後會跑版，因此透過強制渲染避免跑版
	useEffect(() => {
		// onMounted 後再次觸發渲染
		forceRender();
	}, []);

	return (
		<div
			className="mermaid-wrapper w-full py-4"
			style={{
				marginBottom: '2rem',
				maxWidth: '100%',
				overflowX: 'auto',
				backgroundColor: '#f9f9f9',
				padding: '1rem',
				borderRadius: '0.25rem',
			}}
		>
			<MDXMermaid
				chart={chart as string}
				config={{
					mermaid: { theme: 'forest' },
					output: 'svg',
				}}
			/>
		</div>
	);
};

export default Mermaid;
