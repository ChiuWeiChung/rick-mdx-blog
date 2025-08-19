import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote-client/rsc';
import { createMdxComponents } from '@/components/mdx-component/note-module';
import remarkGfm from 'remark-gfm';
import GoBackButton from '@/components/go-back-button';

import { Metadata } from 'next';
import { getPortfolioById } from '@/actions/portfolios';
import { format } from 'date-fns';
import { getOrigin } from '@/lib/router';

interface ClientPortfoliosPageProps {
  params: Promise<{ portfolioId: string }>;
}

export async function generateMetadata(props: ClientPortfoliosPageProps): Promise<Metadata> {
  const origin = await getOrigin();
  const params = await props.params;
  const portfolio = await getPortfolioById(Number(params.portfolioId));
  const metadata: Metadata = {
    title: "Rick's DevNote - 作品集",
    description: '作品集',
    metadataBase: new URL(origin),
  };

  if (portfolio) {
    metadata.title = `作品集 - ${portfolio.projectName}`;
    metadata.description = `${portfolio.projectName}`;
  }

  return metadata;
}

export default async function ClientPortfoliosPage(props: ClientPortfoliosPageProps) {
  const params = await props.params;
  const portfolio = await getPortfolioById(Number(params.portfolioId));

  if (!portfolio) notFound();

  const result = await fetch(portfolio.readmeUrl, {
    cache: 'force-cache',
    next: { revalidate: 60 * 60 * 6 }, // 6 小時
  });
  if (!result.ok) notFound();
  const content = await result.text();

  return (
    <div className="container mx-auto m-4 bg-white/80 p-4">
      {/* router back button */}
      <div className="mb-4 flex flex-wrap items-center gap-4 border-b pb-4">
        <GoBackButton>回作品集列表</GoBackButton>
        <p className="ml-auto text-lg font-bold text-gray-500">
          期間：{format(new Date(portfolio.startDate), 'yyyy/MM/dd')} -{' '}
          {portfolio.endDate ? format(new Date(portfolio.endDate), 'yyyy/MM/dd') : '至今'}
        </p>
      </div>
      <Suspense fallback={<div className="p-4 text-center">Loading content...</div>}>
        <MDXRemote
          source={content}
          components={createMdxComponents()}
          options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
        />
      </Suspense>
    </div>
  );
}
