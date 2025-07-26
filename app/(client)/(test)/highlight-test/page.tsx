'use client';

import { useState } from 'react';
import { HighlightData } from '@/hooks/use-highlights';
import Highlighter from '@/components/highlighter';

const HighlightTestPage = () => {
  const [highlights, setHighlights] = useState<HighlightData[]>([
    {
      id: '1',
      blockId: 'block-1',
      startOffset: 5,
      endOffset: 15,
    }
  ]);

  const handleHighlightCreate = (data: Omit<HighlightData, 'id'>) => {
    const newHighlight: HighlightData = {
      ...data,
      id: `highlight-${Date.now()}`
    };
    
    setHighlights(prev => [...prev, newHighlight]);
    console.log('新增了 highlight:', newHighlight);
  };

  const handleHighlightEdit = (id: string, note: string) => {
    console.log('✅ 更新註解:', { id, note });
    
    setHighlights(prev => {
      const updated = prev.map(highlight => 
        highlight.id === id 
          ? { ...highlight, note }
          : highlight
      );
      return updated;
    });
  };

  const handleHighlightDelete = (id: string) => {
    setHighlights(prev => prev.filter(highlight => highlight.id !== id));
    console.log('刪除了 highlight:', id);
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Highlight 功能測試</h1>
      
      <div className="mb-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">使用說明：</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>新增 Highlight：</strong>選取文字後彈出 Popover，選取的文字會保持反白效果</li>
          <li><strong>必填註解：</strong><span className="text-red-500">必須填寫註解</span>才能創建 highlight</li>
          <li><strong>編輯 Highlight：</strong>點擊已存在的 highlight (黃色背景) 可編輯註解或刪除</li>
          <li><strong>即時更新：</strong>更新註解後，點擊同一個 highlight 會顯示最新的註解內容</li>
          <li><strong>選取保持：</strong>選取的文字會保持反白狀態，直到確認創建或取消操作</li>
          <li><strong>快捷鍵：</strong>Ctrl+Enter 提交，Esc 取消</li>
          <li><strong>調試：</strong>打開瀏覽器的開發者工具查看 console 輸出</li>
        </ul>
      </div>

      <div className="space-y-6">
        <div 
          data-block-id="block-1" 
          className="p-6 border rounded-lg bg-white shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-3">測試區塊 1</h3>
          <p className="text-gray-700 leading-relaxed">
            這是第一個測試段落。你可以選取這段文字中的任何部分來測試 highlight 功能。
            當你選取文字時，選取的文字會保持反白效果，同時彈出 Popover 要求你輸入註解。
            點擊黃色的 highlight 文字可以編輯或刪除。
          </p>
        </div>

        <div 
          data-block-id="block-2" 
          className="p-6 border rounded-lg bg-white shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-3">測試區塊 2</h3>
          <p className="text-gray-700 leading-relaxed">
            這是第二個測試段落，包含更多的內容。選取的文字會一直保持反白狀態，
            讓你清楚看到哪些文字即將被 highlight。所有的 highlight 都必須包含註解，
            這樣可以讓你記錄更多關於選取文字的想法和筆記。
          </p>
        </div>

        <div 
          data-block-id="block-3" 
          className="p-6 border rounded-lg bg-white shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-3">測試區塊 3</h3>
          <p className="text-gray-700 leading-relaxed">
            最後一個測試段落。選取文字後會看到藍色的選取反白效果持續顯示，
            點擊任何黃色的 highlight 文字，會彈出編輯界面讓你修改註解或刪除整個 highlight。
            更新註解後，再次點擊同一個 highlight 會顯示最新的註解內容，無需重新整理頁面。
          </p>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">當前 Highlights ({highlights.length})</h3>
        <div className="space-y-2">
          {highlights.map((highlight) => (
            <div key={highlight.id} className="p-2 bg-white rounded border text-sm">
              <div><strong>ID:</strong> {highlight.id}</div>
              <div><strong>Block:</strong> {highlight.blockId}</div>
              <div><strong>Range:</strong> {highlight.startOffset} - {highlight.endOffset}</div>
            </div>
          ))}
        </div>
      </div>

      <Highlighter 
        highlights={highlights} 
        onHighlightCreate={handleHighlightCreate}
        onHighlightEdit={handleHighlightEdit}
        onHighlightDelete={handleHighlightDelete}
      />
    </div>
  );
};

export default HighlightTestPage; 