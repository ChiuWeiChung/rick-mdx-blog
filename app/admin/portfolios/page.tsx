import PortfolioTable from '@/features/admin/portfolios/data-table';
import { getPortfolios } from '@/actions/portfolios';
import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';


const PortfoliosPage = async () => {
  // const searchParams = await props.searchParams;
  // const queryRequest = queryTagSchema.parse(searchParams ?? {});
  // const { data, totalCount } = await getTagWithNoteCount(queryRequest);
  const { data, totalCount } = await getPortfolios();


  return (
    <div className="relative mx-4 flex flex-col gap-4">
      <h1 className="border-b-2 border-neutral-200 pb-2 text-3xl font-bold">作品集管理</h1>

      <Link href={`/admin/portfolios/editor`} className="w-fit self-end">
        <Button>
          <Plus />
          新增作品
        </Button>
      </Link>
      {/* 表格 */}
      <PortfolioTable data={data} totalCount={totalCount} />
    </div>
  );
};

export default PortfoliosPage;
