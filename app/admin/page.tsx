import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
	Notebook,
	Flame,
	Tag,
	Image,
	Plus,
	BarChart3,
	FileText,
	Activity,
	TrendingUp,
	Calendar,
	User,
} from 'lucide-react';
import Link from 'next/link';
import { auth } from '@/auth';
import { notFound } from 'next/navigation';

const AdminHomePage = async () => {
	const session = await auth();

	if (!session) notFound();
	// Mock data - in a real app, this would come from your database
	const stats = {
		totalPosts: 45,
		totalCategories: 8,
		totalTags: 23,
		totalImages: 156,
		recentPosts: 12, 
		monthlyViews: 2840,
		weeklyPosts: 4,
	};

	const quickActions = [
		{
			title: '新增筆記',
			description: '建立新的部落格文章',
			icon: Plus,
			href: '/admin/editor-page',
			variant: 'default' as const,
		},
		{
			title: '管理類別',
			description: '組織和分類你的內容',
			icon: Flame,
			href: '#',
			variant: 'outline' as const,
		},
		{
			title: '管理標籤',
			description: '編輯和整理標籤系統',
			icon: Tag,
			href: '#',
			variant: 'outline' as const,
		},
		{
			title: '圖片庫',
			description: '管理媒體資源',
			icon: Image,
			href: '#',
			variant: 'outline' as const,
		},
	];

	const mockRecentActivity = [
		{ action: '發布了新文章', item: 'React 18 新特性介紹', time: '2 小時前', type: 'post' },
		{ action: '上傳了圖片', item: 'hero-banner.jpg', time: '4 小時前', type: 'image' },
		{ action: '建立了新標籤', item: 'TypeScript', time: '1 天前', type: 'tag' },
		{ action: '更新了文章', item: 'Next.js 完整指南', time: '2 天前', type: 'post' },
	];

	return (
		<div className="space-y-6 p-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">DASHBOARD</h1>
					<p className="text-muted-foreground">歡迎回來 Rick&apos;s DevNote 管理系統</p>
				</div>
				<div className="mr-4 flex items-center gap-2 text-lg">
					<User className="bg-primary mr-1 rounded-full text-white" />
					<span className="font-bold">{session.user?.name}</span>
				</div>
			</div>

			{/* Stats Grid */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">總文章數</CardTitle>
						<Notebook className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.totalPosts}</div>
						<p className="text-muted-foreground text-xs">
							<span className="text-green-600">+{stats.weeklyPosts}</span> 本週新增
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">類別數量</CardTitle>
						<Flame className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.totalCategories}</div>
						<p className="text-muted-foreground text-xs">涵蓋所有主題領域</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">標籤總數</CardTitle>
						<Tag className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.totalTags}</div>
						<p className="text-muted-foreground text-xs">幫助內容分類</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">圖片資源</CardTitle>
						<Image className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.totalImages}</div>
						<p className="text-muted-foreground text-xs">媒體資源庫</p>
					</CardContent>
				</Card>
			</div>

			{/* Quick Actions */}
			<div className="space-y-4">
				<h2 className="text-xl font-semibold">快速操作</h2>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					{quickActions.map((action, index) => (
						<Card key={index} className="transition-all hover:shadow-md">
							<CardHeader className="pb-2">
								<div className="flex items-center space-x-2">
									<action.icon className="text-primary h-5 w-5" />
									<CardTitle className="text-base">{action.title}</CardTitle>
								</div>
								<CardDescription className="text-sm">{action.description}</CardDescription>
							</CardHeader>
							<CardContent className="pt-2">
								<Link href={action.href}>
									<Button variant={action.variant} className="w-full">
										開始使用
									</Button>
								</Link>
							</CardContent>
						</Card>
					))}
				</div>
			</div>

			{/* Recent Activity & Performance */}
			<div className="grid gap-6 md:grid-cols-2">
				{/* Recent Activity */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center space-x-2">
							<Activity className="h-5 w-5" />
							<span>最近活動</span>
						</CardTitle>
						<CardDescription>最新的系統操作記錄</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{mockRecentActivity.map((activity, index) => (
							<div key={index} className="flex items-center space-x-3">
								<div className="flex-shrink-0">
									{activity.type === 'post' && <FileText className="h-4 w-4 text-blue-500" />}
									{activity.type === 'image' && <Image className="h-4 w-4 text-green-500" />}
									{activity.type === 'tag' && <Tag className="h-4 w-4 text-purple-500" />}
								</div>
								<div className="min-w-0 flex-1">
									<p className="truncate text-sm font-medium">
										{activity.action}{' '}
										<span className="text-muted-foreground">&ldquo;{activity.item}&rdquo;</span>
									</p>
									<p className="text-muted-foreground text-xs">{activity.time}</p>
								</div>
							</div>
						))}
					</CardContent>
				</Card>

				{/* Performance Overview */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center space-x-2">
							<BarChart3 className="h-5 w-5" />
							<span>瀏覽量統計</span>
						</CardTitle>
						<CardDescription>本月網站統計數據</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-2">
								<TrendingUp className="h-4 w-4 text-green-500" />
								<span className="text-sm">月度瀏覽量</span>
							</div>
							<span className="text-2xl font-bold">{stats.monthlyViews.toLocaleString()}</span>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-2">
								<Calendar className="h-4 w-4 text-purple-500" />
								<span className="text-sm">近期文章</span>
							</div>
							<span className="text-2xl font-bold">{stats.recentPosts}</span>
						</div>

						<div className="pt-2">
							<Button variant="outline" className="w-full">
								查看詳細分析
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default AdminHomePage;
