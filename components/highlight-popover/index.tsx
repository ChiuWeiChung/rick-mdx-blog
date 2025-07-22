'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverAnchor } from '@/components/ui/popover';
import { X, Highlighter, MessageSquare, Edit, Trash2 } from 'lucide-react';
import { SelectionData, HighlightData } from '@/hooks/use-highlights';

interface HighlightPopoverProps {
  // 新建 highlight 時的資料
  selectionData: SelectionData | null;
  onHighlight: (data: SelectionData, note: string) => void;
  onCancel: () => void;
  
  // 編輯現有 highlight 時的資料
  editingHighlight: { data: HighlightData; position: { x: number; y: number } } | null;
  onEditHighlight: (id: string, note: string) => void;
  onDeleteHighlight: (id: string) => void;
}

export default function HighlightPopover({ 
  selectionData, 
  onHighlight, 
  onCancel,
  editingHighlight,
  onEditHighlight,
  onDeleteHighlight
}: HighlightPopoverProps) {
  const [note, setNote] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [anchorPosition, setAnchorPosition] = useState({ x: 0, y: 0 });
  // 判斷是否為編輯模式
  const isEditMode = !!editingHighlight;
  const displayData = editingHighlight || selectionData;
  // 判斷是否可以提交（註解不為空）
  const canSubmit = note.trim().length > 0;

  // 管理 Popover 開關狀態和位置
  useEffect(() => {
    if (isEditMode && editingHighlight) {
      // 編輯模式：使用點擊位置
      console.log('進入編輯模式，註解內容:', editingHighlight.data.content);
      setAnchorPosition(editingHighlight.position);
      setNote(editingHighlight.data.content || '');
      setIsOpen(true);
    } else if (selectionData?.range) {
      // 新建模式：使用選取範圍位置
      const rect = selectionData.range.getBoundingClientRect();
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;

      const x = rect.left + scrollX + rect.width / 2;
      const y = rect.bottom + scrollY;

      setAnchorPosition({ x, y });
      setNote(''); // 新建時清空註解
      setIsOpen(true);

      // 保留選取效果，不立即清除
      // 讓用戶能看到選取的文字保持反白狀態
    } else {
      setIsOpen(false);
      setNote('');
    }
  }, [selectionData, editingHighlight, isEditMode]);

  // 處理創建 highlight（強制要求註解）
  const handleCreateHighlight = () => {
    const trimmedNote = note.trim();
    if (!selectionData || !trimmedNote) return;
    onHighlight(selectionData, trimmedNote);
    setNote('');
    setIsOpen(false);
    window.getSelection()?.removeAllRanges();
  };

  // 處理編輯 highlight
  const handleEditHighlight = () => {
    const trimmedNote = note.trim();
    if (!editingHighlight || !trimmedNote) return;
    onEditHighlight(editingHighlight.data.id, trimmedNote);
    setNote('');
    setIsOpen(false);
  };

  // 處理刪除 highlight
  const handleDeleteHighlight = () => {
    if (!editingHighlight) return;
    onDeleteHighlight(editingHighlight.data.id);
    setIsOpen(false);
  };

  // 處理取消
  const handleCancel = () => {
    setIsOpen(false);
    setNote('');

    // 取消時清除選取
    window.getSelection()?.removeAllRanges();

    onCancel();
  };

  // 處理 Popover 狀態變化
  const handleOpenChange = (open: boolean) => {
    if (!open) handleCancel();
  };

  if (!displayData) return null;

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      {/* 隱藏的錨點元素，用於定位 Popover */}
      <PopoverAnchor
        style={{
          position: 'absolute',
          left: anchorPosition.x,
          top: anchorPosition.y,
          width: 1,
          height: 1,
          pointerEvents: 'none',
        }}
      />

      <PopoverContent
        className="w-80 p-4"
        side="bottom"
        align="center"
        sideOffset={8}
        onOpenAutoFocus={e => e.preventDefault()}
      >
        {/* 標題 */}
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">
            {isEditMode ? (
              <>
                <Edit className="mr-2 inline h-4 w-4" />
                編輯 Highlight
              </>
            ) : (
              <>
                <Highlighter className="mr-2 inline h-4 w-4" />
                新增 Highlight
              </>
            )}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* 選取的文字預覽 */}
        <div className="mb-4">
          <p className="mb-1 text-xs text-gray-500">選取的文字：</p>
          <div className="max-h-20 overflow-y-auto rounded bg-gray-50 p-2 text-sm text-gray-700">
            <>&ldquo;{selectionData?.selectedContent ?? '-'}&rdquo;</>
          </div>
        </div>

        {/* 註解輸入區域（必填） */}
        <div className="mb-4">
          <label className="mb-1 block text-xs text-gray-500">
            註解 <span className="text-red-500">*</span>：
          </label>
          <Textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="請輸入註解... (必填)"
            className="min-h-[80px] resize-none text-sm"
          />
          {!canSubmit && <p className="mt-1 text-xs text-red-500">註解為必填項目</p>}
        </div>

        {/* 操作按鈕 */}
        <div className="flex items-center justify-end gap-2">
          <Button
            onClick={handleCancel}
            variant="ghost"
            className="h-8 text-sm text-gray-500 hover:text-gray-700"
            size="sm"
          >
            取消
          </Button>
          {isEditMode ? (
            // 編輯模式按鈕
            <>
              <Button
                onClick={handleDeleteHighlight}
                variant="destructive"
                className="h-8 text-sm"
                size="sm"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                刪除
              </Button>
              <Button
                onClick={handleEditHighlight}
                disabled={!canSubmit}
                className="h-8 text-sm"
                size="sm"
              >
                <Edit className="mr-2 h-4 w-4" />
                更新
              </Button>
            </>
          ) : (
            // 新建模式按鈕
            <Button
              onClick={handleCreateHighlight}
              disabled={!canSubmit}
              className="h-8 text-sm"
              size="sm"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              建立
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
} 