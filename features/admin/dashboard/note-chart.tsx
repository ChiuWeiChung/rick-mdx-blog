'use client';

import { CartesianGrid, XAxis, Bar, BarChart } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { NotebookIcon } from 'lucide-react';
import { type NoteChart } from '@/actions/overview/types';
import { format } from 'date-fns';

const chartConfig = {
  count: { label: '筆記數量', icon: NotebookIcon, color: 'var(--color-primary)' },
} satisfies ChartConfig;

function NoteChart(props: { data: NoteChart[] }) {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
      <BarChart accessibilityLayer data={props.data} margin={{ top: 130, left: 20, right: 20 }}>
        <defs>
          <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-count)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-count)" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={40}
          tickFormatter={(value: string) => {
            return format(new Date(value), 'yyyy-MM');
          }}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
        <Bar dataKey="count" fill={`var(--color-count)`} />
      </BarChart>
    </ChartContainer>
  );
}

export default NoteChart;
