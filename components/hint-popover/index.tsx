'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverAnchor } from '@/components/ui/popover';
import { WandSparklesIcon, ChevronDownIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMutation } from '@tanstack/react-query';
import { mutationHandler } from '@/utils/react-query-handler';
import { askQuestion } from '@/actions/openai';
import { Prompt } from '@/enums/prompt';
import { generatePrompt } from './utils';
import SpinnerLoader from '../spinner-loader';
import { useWindowSelection } from '@/hooks/use-window-selection';
import { toast } from 'sonner';

export default function HintPopover() {
  const [hint, setHint] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [anchorPosition, setAnchorPosition] = useState({ x: 0, y: 0 });
  const { selection, clearSelection } = useWindowSelection({ boundarySelector: '.mdxeditor' });

  // 管理 Popover 開關狀態和位置
  useEffect(() => {
    if (selection?.range && !hint) {
      // 新建模式：使用選取範圍位置
      const rect = selection.range.getBoundingClientRect();
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;

      const x = rect.left + scrollX + rect.width / 2;
      const y = rect.bottom + scrollY;

      setAnchorPosition({ x, y });
      setHint(''); // 新建時清空註解
      setIsOpen(true);
    } 
  }, [selection, hint]);

  const askMutation = useMutation({
    mutationFn: mutationHandler(askQuestion),
    meta: { ignoreLoadingMask: true },
  });

  const handleProcess = (prompt: Prompt, suffix?: string) => {
    return async () => {
      const promptMessage = generatePrompt(prompt, suffix);
      if (promptMessage && selection?.text) {
        const result = await askMutation.mutateAsync(`${promptMessage}：${selection.text}`);
        if (!result.error) setHint(result.message);
      }
    };
  };

  // 處理取消
  const handleCancel = () => {
    setIsOpen(false);
    setHint('');
    // 取消時清除選取
    window.getSelection()?.removeAllRanges();
    clearSelection();
  };

  // 處理 Popover 狀態變化
  const handleOpenChange = (open: boolean) => {
    if (!open) handleCancel();
  };

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
        className="w-fit max-w-[28rem]"
        side="bottom"
        align="center"
        sideOffset={8}
        onOpenAutoFocus={e => e.preventDefault()}
      >
        {/* 操作按鈕 */}
        <WandSparklesIcon className="text-primary-foreground absolute -top-2 -right-2 h-4 w-4 rounded-full bg-neutral-700" />
        <div className="text-primary grid grid-cols-4 items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleProcess(Prompt.expand)}>
            加長
          </Button>
          <Button variant="outline" size="sm" onClick={handleProcess(Prompt.shorten)}>
            縮短
          </Button>
          <Button variant="outline" size="sm" onClick={handleProcess(Prompt.correct)}>
            文法修正
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                語氣調整
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleProcess(Prompt.tone, '專業')}>專業</DropdownMenuItem>
              <DropdownMenuItem onClick={handleProcess(Prompt.tone, '隨性')}>隨性</DropdownMenuItem>
              <DropdownMenuItem onClick={handleProcess(Prompt.tone, '幽默')}>幽默</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* AI 輸出區域 */}
        {askMutation.isPending && <SpinnerLoader className="h-10 w-10" />}
        {hint && (
          <div className="border-border mx-auto my-2 flex flex-col gap-2 rounded-md border bg-neutral-800 p-2 text-sm">
            <p className="text-primary-foreground font-bold">生成提示：</p>
            <p className="text-primary-foreground">{hint}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                toast.success('已複製到剪貼簿');
                navigator.clipboard.writeText(hint);
              }}
            >
              複製
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
