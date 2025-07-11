'use client'; // Error boundaries must be Client Components

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  const handleReset = () => {
    reset();
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const renderErrorMessage = () => {
    if (!error.message) return null;
    return error.message.split(',').map(item => {
      return <div key={item}>{item}, </div>;
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-2xl">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">系統發生錯誤</CardTitle>
            <CardDescription className="mt-2 text-gray-600">
              很抱歉，這個功能還在施工當中。
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Details */}
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="mb-3 flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4 text-red-600" />
                <h3 className="font-medium text-red-800">錯誤詳情</h3>
              </div>
              <div className="space-y-3 text-red-700">
                <div>
                  <span className="text-sm font-medium">錯誤訊息：</span>
                  <div className="mt-1 rounded border bg-red-100 p-3 font-mono text-sm break-all text-red-800">
                    {renderErrorMessage()}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium">發生時間：</span>
                  <div className="mt-1 text-sm text-red-700">
                    {new Date().toLocaleString('zh-TW')}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <Button onClick={handleReset} className="h-11 flex-1" size="lg">
                <RefreshCw className="mr-2 h-4 w-4" />
                重新整理
              </Button>
              <Button onClick={handleGoHome} variant="outline" className="h-11 flex-1" size="lg">
                <Home className="mr-2 h-4 w-4" />
                返回首頁
              </Button>
            </div>

            {/* Additional Help */}
            <div className="border-t border-gray-200 pt-4 text-center">
              <p className="text-sm text-gray-500">非常抱歉，這個功能還在施工當中。</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
