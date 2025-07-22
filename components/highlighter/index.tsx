'use client';
import { useState } from 'react';
import { HighlightData, useHighlights, SelectionData } from '@/hooks/use-highlights';
import HighlightPopover from '@/components/highlight-popover';

interface HighlighterProps {
  highlights: HighlightData[];
  onHighlightCreate?: (data: Omit<HighlightData, 'id'>) => void;
  onHighlightEdit?: (id: string, note: string) => void;
  onHighlightDelete?: (id: string) => void;
}

export default function Highlighter({
  highlights,
  onHighlightCreate,
  onHighlightEdit,
  onHighlightDelete,
}: HighlighterProps) {
  const [selectedData, setSelectedData] = useState<SelectionData | null>(null);
  const [editingHighlight, setEditingHighlight] = useState<{
    data: HighlightData;
    position: { x: number; y: number };
  } | null>(null);

  const { createHighlight } = useHighlights(
    highlights,
    // ======== onClickHighlight - 點擊現有 highlight 的處理 ========
    (data, event) => {
      console.log('點擊 highlight，進入編輯模式，ID:', data.id);
      const highlightData = highlights.find(h => h.id === data.id);

      if (highlightData) {
        // 設置編輯模式，使用最新的數據
        setEditingHighlight({
          data: highlightData, // 使用從 React state 中獲取的最新數據
          position: { x: event.clientX, y: event.clientY },
        });
        // 設置選取的文字
        setSelectedData({
          blockId: highlightData.blockId,
          startOffset: highlightData.startOffset,
          endOffset: highlightData.endOffset,
          selectedContent: highlightData.selectedContent || '',
        }); 
      }
    },
    // ======== onTextSelected - 文字被選取時的處理 ========
    selectionData => {
      setSelectedData(selectionData);
      setEditingHighlight(null); // 清除任何現有的編輯狀態
    },
    // ======== onCreateHighlight - 創建新 highlight 的處理 ========
    highlightData => {
      if (onHighlightCreate) {
        onHighlightCreate({
          ...highlightData,
          selectedContent: selectedData?.selectedContent,
        });
      }
    }
  );

  // 處理 Popover 中的 highlight 確認（新建模式 - 強制要求註解）
  const handleHighlightConfirm = (selectionData: SelectionData, note: string) => {
    createHighlight(selectionData, note);
    setSelectedData(null);
  };

  // 處理編輯 highlight
  const handleEditHighlight = (id: string, note: string) => {    
    if (onHighlightEdit) onHighlightEdit(id, note);
    setEditingHighlight(null);
  };

  // 處理刪除 highlight
  const handleDeleteHighlight = (id: string) => {
    // 立即從 DOM 中移除對應的 highlight 元素
    const highlightElement = document.querySelector(`[data-id="${id}"]`);
    if (highlightElement) {
      const parent = highlightElement.parentNode;
      if (parent) {
        // 將 highlight 元素的文字內容提取出來，替換回原本的文字節點
        const textNode = document.createTextNode(highlightElement.textContent || '');
        parent.insertBefore(textNode, highlightElement);
        parent.removeChild(highlightElement);
        
        // 合併相鄰的文字節點
        parent.normalize();
      }
    }
    
    if (onHighlightDelete) onHighlightDelete(id);
    setEditingHighlight(null);
  };

  // 處理取消操作
  const handleCancel = () => {
    setSelectedData(null);
    setEditingHighlight(null);
  };

  return (
    <HighlightPopover
      selectionData={selectedData}
      onHighlight={handleHighlightConfirm}
      onCancel={handleCancel}
      editingHighlight={editingHighlight}
      onEditHighlight={handleEditHighlight}
      onDeleteHighlight={handleDeleteHighlight}
    />
  );
}
