import React from 'react';
import { CommonProps } from './types';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { placeholderDataUrl } from '@/constants/placeholder';
import PageWrapper from '../page-wrapper';

export function createMdxComponents() {
  return {

    // 改進標題樣式
    // h1: (props: CommonProps) => {
    //   const blockId = `block-${counter++}`;
    //   return <h1 {...props} data-block-id={blockId} />;
    // },
    wrapper: (props: CommonProps) => {
      return (
        <PageWrapper className="max-w-5xl">
          <article className="prose prose-sm sm:prose-base md:prose-lg max-w-none">
            {props.children}
          </article>
        </PageWrapper>
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
          : '1.5rem';
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
            placeholder={placeholderDataUrl}
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
    a: (props: CommonProps) => {
      return (
        <Button variant="ghost" className="p-2" size="lg">
          <a {...props} target="_blank" rel="noopener noreferrer" />
        </Button>
      );
    },
    table: (props: CommonProps) => {
      return <table {...props} className="table-fixed w-full" />;
    },
  };
}
