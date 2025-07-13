import React from 'react';
import PortfolioEditor from '@/features/admin/portfolios/portfolios-editor';
import { getPortfolioById } from '@/actions/portfolios';
import { Portfolio } from '@/actions/portfolios/types';

interface PortfolioEditorPageProps {
  searchParams: Promise<{
    portfolioId?: string;
  }>;
}

const PortfolioEditorPage = async ({ searchParams }: PortfolioEditorPageProps) => {
  const { portfolioId } = await searchParams;
  let portfolio: Portfolio | null | undefined = undefined;
  if (portfolioId) {
    portfolio = await getPortfolioById(Number(portfolioId));
    if (!portfolio) throw new Error('Portfolio not found');
  }

  return <PortfolioEditor portfolio={portfolio} />;
};

export default PortfolioEditorPage;
