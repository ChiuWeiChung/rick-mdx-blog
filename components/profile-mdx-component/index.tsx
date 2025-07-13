import React from 'react';
import { CommonProps } from './types';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function createMdxComponents() {
  return {
    // 改進 html 區塊顯示
    // pre: ({ children }: { children: React.ReactElement; className?: string }) => {
    //   if (
    //     React.isValidElement(children) &&
    //     children.props &&
    //     typeof children.props === 'object' &&
    //     'className' in children.props
    //   ) {
    //     const className = (children.props.className as string) || '';

    //     // 處理 Mermaid 圖表
    //     if (isMermaidSyntax(className) && 'children' in children.props) {
    //       return <Mermaid chart={children.props.children as string} />;
    //     }

    //     // 處理其他程式碼塊
    //     if (className.startsWith('language-') && 'children' in children.props) {
    //       const language = getLanguageFromClassName(className);
    //       const codeContent = children.props.children as string;
    //       return <CodeBlock language={language} code={codeContent} />;
    //     }
    //   }

    //   // 預設的 pre 渲染
    //   return (
    //     <pre className="my-4 w-full overflow-auto rounded-md bg-gray-100 p-4 text-black shadow-sm">
    //       {children}
    //     </pre>
    //   );
    // },

    // 改進標題樣式
    // h1: (props: CommonProps) => {
    //   const blockId = `block-${counter++}`;
    //   return <h1 {...props} data-block-id={blockId} />;
    // },
    wrapper: (props: CommonProps) => {
      return (
        <main className="container mx-auto max-w-5xl px-4 py-8">
          <article className="prose prose-sm sm:prose-base md:prose-lg max-w-none">
            {props.children}
          </article>
        </main>
      );
    },

    h2: (props: CommonProps) => {
      const childrenText = props.children as string;
      return <h2 {...props} id={childrenText} />;
    },
    h3: (props: CommonProps) => {
      const childrenText = props.children as string;
      return <h3 {...props} id={childrenText} />;
    },
    // // 改進段落和列表樣式
    // p: (props: CommonProps) => {
    //   const blockId = `block-${counter++}`;
    //   return <p {...props} data-block-id={blockId} />;
    // },
    // ul: (props: CommonProps) => <ul className="list-disc pl-5 my-3" {...props} />,
    // ol: (props: CommonProps) => <ol className="list-decimal pl-5 my-3" {...props} />,
    // // 為表格添加滾動支持
    // table: (props: CommonProps) => (
    //   <div className="overflow-x-auto w-full my-4">
    //     <table className="w-full border-collapse" {...props} />
    //   </div>
    // ),
    img: (props: CommonProps & { alt: string; title: string; src: string }) => {
      // lg => 10 rem
      // md => 2 rem
      // sm => 1 rem
      const size = props.title.includes('lg')
        ? '10rem'
        : props.title.includes('md')
          ? '2rem'
          : '1rem';
      return (
        <div className={cn('relative !my-0 inline-block')} style={{ width: size, height: size }}>
          <Image
            {...props}
            title={props.title}
            alt={props.alt}
            className={cn('!my-0 object-contain')}
            src={props.src}
            fill
            sizes={size}
            priority
          />
        </div>
      );
    },
    li: (props: CommonProps) => {
      return <li {...props} />;
    },
    code: (props: CommonProps) => (
      <code className="bg-secondary text-primary rounded px-1" {...props} />
    ),
    blockquote: (props: CommonProps) => (
      <blockquote
        className="bg-secondary text-primary my-4 rounded-lg border-l-2 px-4 py-2"
        {...props}
      />
    ),
    // a: (props: CommonProps) => <a className="text-blue-500 hover:text-blue-700" {...props} />,
  };
}
