import { getProfile } from '@/actions/profile';
import { getMarkdownContent, getMarkdownResource } from '@/actions/s3/markdown';
import { createMdxComponents } from '@/components/profile-mdx-component';
import { MDXRemote } from 'next-mdx-remote-client/rsc';
import { unstable_cache } from 'next/cache';
import { notFound } from 'next/navigation';
import React from 'react';

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
  //   const resource = await getMarkdownResource(profile.profilePath);
  //   const markdown = await getMarkdownContent(resource);
  return (
    <main className="container mx-auto max-w-5xl px-4 py-8">
      <article className="prose prose-sm sm:prose-base md:prose-lg max-w-none">
        <MDXRemote source={markdown} components={createMdxComponents()} />
      </article>
    </main>
  );
}
