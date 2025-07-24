import { getProfile } from '@/actions/profile';
import { getMarkdownContent, getMarkdownResource } from '@/actions/s3/markdown';
import { createMdxComponents } from '@/components/mdx-component/profile-module';
import { EvaluateOptions, MDXRemote } from 'next-mdx-remote-client/rsc';
import { unstable_cache } from 'next/cache';
import { notFound } from 'next/navigation';
import React from 'react';
import remarkGfm from 'remark-gfm';

export default async function page() {
  const profile = await getProfile();
  if (!profile) return notFound();

  const getMarkdownContentWithUnstableCache = unstable_cache(
    async (filePath: string) => {
      const resource = await getMarkdownResource(filePath);
      const markdown = await getMarkdownContent(resource);
      return markdown;
    },
    [profile.profilePath],
    {
      tags: ['profile'],
    }
  );

  const markdown = await getMarkdownContentWithUnstableCache(profile.profilePath);
  const options: EvaluateOptions = {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
    },
    // parseFrontmatter: true,
    // scope: {
    //   readingTime: calculateSomeHow(source),
    // },
    // vfileDataIntoScope: 'toc',
  };

  return (
        <MDXRemote source={markdown} components={createMdxComponents()} options={options} />
    // <main className="container mx-auto max-w-5xl px-4 py-8">
    //   <article className="prose prose-sm sm:prose-base md:prose-lg max-w-none">
    //   </article>
    // </main>
  );
}
