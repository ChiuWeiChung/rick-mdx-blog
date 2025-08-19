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
        <PageWrapper className="max-w-8xl">
          <article className="prose prose-sm sm:prose-base max-w-none">
            {props.children}
          </article>
        </PageWrapper>
      );
    },
    p: (props: CommonProps) => {
      if (typeof props.children === 'string') return <p {...props} />;
      return props.children;
    },
    img: (props: CommonProps & { alt: string; title: string; src: string }) => {
      if (props.title.includes('portrait')) {
        return (
          <figure className="shape-outside-circle relative float-left mr-8 mb-4 h-24 w-24 overflow-hidden rounded-full md:h-40 md:w-40 lg:h-42 lg:w-42">
            <Image
              src={props.src}
              alt={props.alt}
              className="block h-full w-auto scale-[1.1] transition-all duration-500 group-hover:scale-100"
              priority
              fill
              sizes="100%"
            />
          </figure>
        );
      }
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
      return <table {...props} className="w-full table-fixed" />;
    },
  };
}
