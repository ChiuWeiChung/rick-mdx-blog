/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Area, Bar, BarChart,AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  
} from '@/components/ui/chart';
import { NotebookIcon } from 'lucide-react';
import  { type NoteChart } from '@/actions/overview/types';
import { format } from 'date-fns';


// const mockData = [
//   {
//     month: '2024-01-01',
//     count: 100,
//   },
//   {
//     month: '2024-02-12',
//     count: 123,
//   },
//   {
//     month: '2024-03-12',
//     count: 111,
//   },
//   {
//     month: '2024-04-21',
//     count: 200,
//   },
  
//   {
//     month: '2024-05-12',
//     count: 136,
//   },
//   {
//     month: '2024-06-12',
//     count: 333,
//   },
//   {
//     month: '2024-07-12',
//     count: 311,
//   },
//   {
//     month: '2024-08-12',
//     count: 222,
//   },
//   {
//     month: '2024-09-12',
//     count: 111,
//   },
//   {
//     month: '2024-10-12',
//     count: 400,
//   },
//   {
//     month: '2024-11-12',
//     count: 111,
//   },

// ]

const chartConfig = {
  count: { label: '筆記數量', icon: NotebookIcon, color:'var(--color-primary)' },
} satisfies ChartConfig;

function NoteChart(props: { data: NoteChart[] }) {
    return (
      <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
        <AreaChart data={props.data}>
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
            minTickGap={20}
            tickFormatter={(value:string) => {
              return format(new Date(value), 'yy-MMM');
            }}
          />
          {/* <YAxis
            dataKey="count"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={20}
          /> */}
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                indicator="dot"
              />
            }
          />
          <Area
            dataKey="count"
            type="natural"
            fill="url(#fillCount)"
            stroke="var(--color-count)"
            stackId="a"
          />
          {/* <Area
            dataKey="desktop"
            type="natural"
            fill="url(#fillDesktop)"
            stroke="var(--color-desktop)"
            stackId="a"
          /> */}
        </AreaChart>
      </ChartContainer>
    );
  // return (
  //   <ChartContainer config={mockChartConfig} className="max-h-72 w-full">
  //     <BarChart accessibilityLayer data={mockData}>
  //       <CartesianGrid vertical={false} />
  //       <XAxis
  //         dataKey="date"
  //         tickLine={false}
  //         tickMargin={10}
  //         axisLine={false}
  //         tickFormatter={value => value.slice(0, 3)}
  //       />
  //       <ChartTooltip content={<ChartTooltipContent />} />
  //       <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
  //       <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
  //       {/* <Bar dataKey="count" radius={4} fill="var(--color-primary)" /> */}
  //       {/* <Bar dataKey="count" radius={4} fill="var(--chart-1)" /> */}
  //     </BarChart>
  //   </ChartContainer>
  // );
}

export default NoteChart;
