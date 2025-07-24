import { getPortfolioById } from '@/actions/portfolios';
import { Portfolio } from '@/actions/portfolios/types';
import DialogContainer from '@/components/dialog-container';
import PortfolioEditor from '@/features/admin/portfolios/portfolios-editor';

interface PortfolioEditorModalPageProps {
  searchParams: Promise<{
    portfolioId: string;
  }>;
}

export default async function PortfolioEditorModalPage({
  searchParams,
}: PortfolioEditorModalPageProps) {
  const { portfolioId } = await searchParams;
  let portfolio: Portfolio | null | undefined = undefined;
  if (portfolioId) {
    portfolio = await getPortfolioById(Number(portfolioId));
    if (!portfolio) throw new Error('Portfolio not found');
  }
  return (
    <DialogContainer
      title={portfolio ? '編輯作品集' : '新增作品集'}
      description=""
      open={true}
      goBackOnClose
    >
      <PortfolioEditor portfolio={portfolio} />
    </DialogContainer>
  );
}
