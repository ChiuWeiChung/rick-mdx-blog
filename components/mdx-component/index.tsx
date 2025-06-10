import React from "react";
import { getLanguageFromClassName, isMermaidSyntax } from '@/utils/mdx-utils';
import dynamic from "next/dynamic";
import { Loader } from "lucide-react";
import { CommonProps } from "./types";



// 使用動態導入來加載客戶端元件
const Mermaid = dynamic(() => import('@/components/mermaid'), { 
  ssr: !!false,
  loading: () => <Loader className="animate-spin text-primary mx-auto  w-12 h-12" />
});

const CodeBlock = dynamic(() => import('@/components/code-block'), {
  ssr: !!false,
  loading: () => <Loader className="animate-spin text-primary mx-auto  w-12 h-12" />
});


export const mdxComponents = {
  // 改進 html 區塊顯示
  pre: ({ children }: { children: React.ReactElement; className?: string }) => {
    if (React.isValidElement(children) && children.props && typeof children.props === 'object' && 'className' in children.props) {
      const className = (children.props.className as string) || '';

      // 處理 Mermaid 圖表
      if (isMermaidSyntax(className) && 'children' in children.props) {
        return <Mermaid chart={children.props.children as string} />;
      }

      // 處理其他程式碼塊
      if (className.startsWith('language-') && 'children' in children.props) {
        const language = getLanguageFromClassName(className);
        const codeContent = children.props.children as string;
        return <CodeBlock language={language} code={codeContent} />;
      }
    }

    // 預設的 pre 渲染
    return <pre className="bg-gray-100 text-black p-4 rounded-md shadow-sm overflow-auto w-full my-4">{children}</pre>;
  },

  // 改進標題樣式
  // h1: (props: CommonProps) => <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />,
  // h2: (props: CommonProps) => <h2 className="text-xl font-bold mt-6 mb-3" {...props} />,
  // h3: (props: CommonProps) => <h3 className="text-lg font-bold mt-4 mb-2" {...props} />,
  // // 改進段落和列表樣式
  // p: (props: CommonProps) => <p className="my-3" {...props} />,
  // ul: (props: CommonProps) => <ul className="list-disc pl-5 my-3" {...props} />,
  // ol: (props: CommonProps) => <ol className="list-decimal pl-5 my-3" {...props} />,
  // // 為表格添加滾動支持
  // table: (props: CommonProps) => (
  //   <div className="overflow-x-auto w-full my-4">
  //     <table className="w-full border-collapse" {...props} />
  //   </div>
  // ),
  code: (props: CommonProps) => <code className="bg-secondary text-primary px-1 rounded" {...props} />,
  blockquote: (props: CommonProps) => <blockquote className="border-l-2 rounded-lg bg-secondary text-primary px-4 py-2 my-4" {...props} />,
  // a: (props: CommonProps) => <a className="text-blue-500 hover:text-blue-700" {...props} />,
};
