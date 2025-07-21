# Highlight Popover 組件

一個用於文字高亮標記的 Popover 組件，支援文字選取、高亮創建和註解添加。

## 功能特色

- 🎯 **智能文字選取** - 使用 `selectionchange` 事件和 `window.getSelection()` API
- 🎨 **視覺化 Popover** - 美觀的彈出式操作界面  
- 📝 **註解支援** - 可為高亮文字添加註解
- ⌨️ **快捷鍵** - 支援 `Enter` 確認和 `Esc` 取消
- 📱 **響應式設計** - 自動調整位置避免超出視窗範圍
- 🎭 **動畫效果** - 流暢的進場動畫

## 使用方式

### 基本用法

```tsx
import { useState } from 'react';
import { HighlightData } from '@/hooks/use-highlights';
import Highlighter from '@/components/highlighter';

function MyComponent() {
  const [highlights, setHighlights] = useState<HighlightData[]>([]);

  const handleHighlightCreate = (data: Omit<HighlightData, 'id'>) => {
    const newHighlight: HighlightData = {
      ...data,
      id: `highlight-${Date.now()}`
    };
    setHighlights(prev => [...prev, newHighlight]);
  };

  return (
    <div>
      {/* 需要 highlight 功能的內容區域 */}
      <div data-block-id="content-1">
        <p>這是可以被高亮標記的文字內容...</p>
      </div>
      
      {/* Highlighter 組件 */}
      <Highlighter 
        highlights={highlights} 
        onHighlightCreate={handleHighlightCreate}
      />
    </div>
  );
}
```

### 必要條件

1. **data-block-id 屬性**：每個可高亮的區域都需要有 `data-block-id` 屬性
2. **HighlightData 接口**：確保 highlight 資料符合規定格式

```tsx
interface HighlightData {
  id: string;
  blockId: string;
  startOffset: number;
  endOffset: number;
  note?: string;
}
```

## 操作流程

1. **選取文字** - 用戶在帶有 `data-block-id` 的元素中選取文字
2. **顯示 Popover** - 系統自動計算位置並顯示操作選項
3. **選擇操作** - 用戶可選擇：
   - 直接 Highlight
   - Highlight + 添加註解
   - 取消操作
4. **創建 Highlight** - 確認後創建高亮標記

## 快捷鍵

- `Enter` - 確認創建 highlight
- `Esc` - 取消操作並關閉 Popover
- `Shift + Enter` - 在註解輸入區域內換行

## 樣式自定義

### CSS 類別

```css
.highlight {
  background-color: #fef08a; /* yellow-200 */
  border-radius: 3px;
  padding: 1px 2px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.highlight:hover {
  background-color: #fde047; /* yellow-300 */
}

.highlight.with-note {
  background-color: #bfdbfe; /* blue-200 */
}

.highlight.with-note:hover {
  background-color: #93c5fd; /* blue-300 */
}
```

## 進階配置

### Popover 位置計算

Popover 會自動根據選取文字的位置進行智能定位：

- 預設顯示在選取文字下方
- 如果下方空間不足，會顯示在上方
- 水平方向會自動調整避免超出視窗

### 事件處理

```tsx
const { createHighlight } = useHighlights(
  highlights,
  onClickHighlight,    // 點擊現有 highlight 的處理
  onTextSelected,      // 文字被選取時的處理
  onCreateHighlight    // 創建新 highlight 的處理
);
```

## 測試頁面

可以通過 `/highlight-test` 路由訪問測試頁面來體驗完整功能。

## 技術細節

- 使用 `TreeWalker` API 遍歷文字節點
- 精確計算文字偏移量位置
- 支援跨文字節點的範圍選取
- 使用 `Range` API 進行精確的文字定位 