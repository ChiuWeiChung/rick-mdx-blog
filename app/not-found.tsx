import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-950">
			<div className="text-center">
				<h1 className="mb-4 text-6xl font-bold text-gray-900 dark:text-white">404</h1>
				<h2 className="mb-6 text-2xl font-semibold text-gray-700 dark:text-gray-300">找不到頁面</h2>
				<p className="mb-8 text-gray-600 dark:text-gray-400">您尋找的頁面不存在或已被移動。</p>
				<Link href="/">
					<Button variant="outline" className="px-6">
						返回首頁
					</Button>
				</Link>
			</div>
		</div>
	);
}
