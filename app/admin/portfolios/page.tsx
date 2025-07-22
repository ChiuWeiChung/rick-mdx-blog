import PortfolioTable from '@/features/admin/portfolios/data-table';
import { getPortfolios } from '@/actions/portfolios';
import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import PageHeader from '@/components/page-header';


const PortfoliosPage = async () => {
  const { data, totalCount } = await getPortfolios();

  return (
    <>
      <PageHeader>作品集管理</PageHeader>
      {/* 新增 */}
      <Link href={`/admin/portfolios/editor`} className="w-fit self-end">
        <Button>
          <Plus />
          新增作品
        </Button>
      </Link>
      {/* 表格 */}
      <PortfolioTable data={data} totalCount={totalCount} />
    </>
  );
};

export default PortfoliosPage;
