import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Notebook,
  Flame,
  Tag,
  FileText,
  Activity,
  Sigma,
  ChartSplineIcon,
  BarChart3Icon,
  TrendingUp,
  Calendar,
  ConstructionIcon,
} from 'lucide-react';
import NoteChart from '@/features/admin/dashboard/note-chart';
import QuerySearchForm from '@/features/admin/dashboard/search-form';
import { coerceQueryNoteChartSchema, QueryNoteChart } from '@/actions/overview/types';
import { getNoteChartData, getOverviewInfo } from '@/actions/overview';
import { formatDistanceToNow } from 'date-fns';
import { zhTW } from 'date-fns/locale';

// const mockStats = {
//   totalPosts: 45,
//   totalCategories: 8,
//   totalTags: 23,
//   totalImages: 156,
//   recentPosts: 12,
//   monthlyViews: 2840,
// };

// const mockRecentActivity = [
//   { action: '發布了新文章', item: 'React 18 新特性介紹', time: '2 小時前', type: 'post' },
//   { action: '建立了新標籤', item: 'TypeScript', time: '1 天前', type: 'tag' },
//   { action: '更新了文章', item: 'Next.js 完整指南', time: '2 天前', type: 'post' },
// ];

interface AdminHomePageProps {
  searchParams?: Promise<QueryNoteChart>;
}

const AdminHomePage = async (props: AdminHomePageProps) => {
  const searchParams = await props.searchParams;
  const queryRequest = coerceQueryNoteChartSchema.parse(searchParams);
  const data = await getNoteChartData(queryRequest);
  const stats = await getOverviewInfo();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">DASHBOARD</h1>
        <p className="text-muted-foreground">歡迎回來 Rick&apos;s DevNote 管理系統</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-3 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>最近活動</span>
            </CardTitle>
            <CardDescription>最新的系統操作記錄</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <FileText className="text-primary h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  最近新增文章
                  <span className="text-muted-foreground">
                    &ldquo;{stats.lastCreatedNote.title}&rdquo;
                  </span>
                </p>
                <p className="text-muted-foreground text-xs">
                  {formatDistanceToNow(new Date(stats.lastCreatedNote.createdAt), {
                    addSuffix: true,
                    locale: zhTW,
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <FileText className="text-neutral-800 h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  最近更新文章
                  <span className="text-muted-foreground">
                    &ldquo;{stats.lastUpdatedNote.title}&rdquo;
                  </span>
                </p>
                <p className="text-muted-foreground text-xs">
                  {formatDistanceToNow(new Date(stats.lastUpdatedNote.updatedAt), {
                    addSuffix: true,
                    locale: zhTW,
                  })}
                </p>
              </div>
            </div>
            {/* ))} */}
          </CardContent>
        </Card>

        <Card className="col-span-3 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sigma className="h-5 w-5" />
              <span>數量統計</span>
            </CardTitle>
            <CardDescription>總文章數、類別數量、標籤數量</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Notebook className="text-muted-foreground h-4 w-4" />
              <p className="text-muted-foreground text-xs">總文章數</p>
              <div className="ml-auto text-2xl font-bold">{stats.noteCount}</div>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="text-muted-foreground h-4 w-4" />
              <p className="text-muted-foreground text-xs">類別數量</p>
              <div className="ml-auto text-2xl font-bold">{stats.categoryCount}</div>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="text-muted-foreground h-4 w-4" />
              <p className="text-muted-foreground text-xs">標籤數量</p>
              <div className="ml-auto text-2xl font-bold">{stats.tagCount}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3 lg:col-span-1 opacity-60 bg-secondary relative">
            <div className="flex items-center justify-center text-2xl font-bold text-amber-500 absolute top-0 left-0 w-full h-full">
              開發中
              <ConstructionIcon className="h-8 w-8 text-center" />
            </div>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3Icon className="h-5 w-5" />
              <span>瀏覽量統計</span>
            </CardTitle>
            <CardDescription>本週網站統計數據</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm">週瀏覽量</span>
              </div>
              <span className="text-2xl font-bold">--</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-purple-500" />
                <span className="text-sm">近期文章</span>
              </div>
              <span className="text-2xl font-bold">--</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-3 lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ChartSplineIcon className="h-5 w-5" />
            <span>筆記新增趨勢</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <QuerySearchForm defaultValues={queryRequest} />
          <NoteChart data={data} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminHomePage;
