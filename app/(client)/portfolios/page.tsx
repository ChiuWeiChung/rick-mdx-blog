import PageWrapper from '@/components/page-wrapper';
import { getPortfolios } from '@/actions/portfolios';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ExternalLinkIcon, ForwardIcon } from 'lucide-react';
import { format } from 'date-fns';
import FeatureCard from '@/components/feature-card';
import { Portfolio } from '@/actions/portfolios/types';
import { getOrigin } from '@/lib/router';

export default async function PortfoliosPage() {
  const { data } = await getPortfolios();
  const origin = await getOrigin();

  const renderDescription = (startDate: number, endDate: number | null) => {
    const formattedStartDate = format(new Date(startDate), 'yyyy/MM/dd');
    const formattedEndDate = endDate ? format(new Date(endDate), 'yyyy/MM/dd') : '至今';
    return `${formattedStartDate} - ${formattedEndDate}`;
  };

  const renderFooter = (portfolio: Portfolio) => (
    <div className="flex w-full items-center gap-4">
      <Link className="w-full" href={portfolio.githubUrl} target="_blank" rel="noopener noreferrer">
        <Button variant="outline" className="w-full">
          <ExternalLinkIcon />
          GitHub
        </Button>
      </Link>
      <Link className="w-full" href={`/portfolios/${portfolio.id}`}>
        <Button className="w-full">
          <ForwardIcon />
          查看詳情
        </Button>
      </Link>
    </div>
  );

  return (
    <PageWrapper>
      <h1 className="text-4xl font-bold">作品集</h1>
      <p className="text-muted-foreground max-w-xl rounded-lg border bg-white p-4 text-left text-lg">
        本頁展示的專案是我平常工作之餘開發的 Side
        Projects，內容和在職期間之公司專案無關，不涉及任何營業機密。
        若您對我在職時做過的專案有興趣，歡迎再找我聊聊！
      </p>
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {data.map(portfolio => (
          <FeatureCard
            key={portfolio.id}
            className="min-w-[22rem]"
            title={portfolio.projectName}
            imageUrl={
              portfolio.coverPath
              ? `${origin}/api/image?key=${portfolio.coverPath}`
              : undefined
            }
            description={renderDescription(portfolio.startDate, portfolio.endDate)}
            content={<p className="whitespace-pre-line text-gray-600">{portfolio.description}</p>}
            footer={renderFooter(portfolio)}
          />
        ))}
      </div>
    </PageWrapper>
  );
}
