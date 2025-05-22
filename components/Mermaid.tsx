'use client';

import { Mermaid as MDXMermaid } from 'mdx-mermaid/Mermaid';
import { useEffect } from 'react';
import { useState } from 'react';

interface MermaidProps {
  chart: string;
}

// 簡單的 Mermaid 組件，直接使用 mdx-mermaid/Mermaid
const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const [, setCount] = useState(0);

  // NOTE: 為了解決了一個惱人的 bug：Mermaid 圖表在首次渲染後會跑版，因此透過強制渲染兩次作為 workaround。
  useEffect(() => {
    // 第一次渲染後觸發兩次更新
    setCount(1);
    setTimeout(() => setCount(2), 0); // 下一輪 event loop 更新
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
