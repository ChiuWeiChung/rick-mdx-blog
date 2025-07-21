export interface HighlightData {
	id: string;
	blockId: string;
	startOffset: number;
	endOffset: number;
	note?: string;
}

export function highlightTextInBlock(
	blockElement: HTMLElement,
	highlights: HighlightData[],
	onClickHighlight?: (data: { id: string; blockId: string; startOffset: number; endOffset: number }, event: MouseEvent) => void
) {
	// 先獲取完整的原始文字內容（不包含HTML標記）
	const originalText = getPlainTextContent(blockElement);
	
	// 清理所有現有的highlight，重建純文字內容
	clearHighlightsAndRebuildText(blockElement, originalText);
	
	// 如果沒有highlights要創建，直接返回
	if (highlights.length === 0) {
		return;
	}
	
	// 按照 startOffset 排序 highlights，確保按順序處理
	const sortedHighlights = [...highlights].sort((a, b) => a.startOffset - b.startOffset);
	
	// 驗證所有 highlights 的偏移量是否有效
	const validHighlights = sortedHighlights.filter(highlight => {
		const { startOffset, endOffset } = highlight;
		if (startOffset < 0 || endOffset < 0 || startOffset >= endOffset || endOffset > originalText.length) {
			console.warn('無效的 highlight 偏移量:', highlight);
			return false;
		}
		return true;
	});
	
	// 檢查是否有重疊的 highlights
	for (let i = 0; i < validHighlights.length - 1; i++) {
		const current = validHighlights[i];
		const next = validHighlights[i + 1];
		if (current.endOffset > next.startOffset) {
			console.warn('發現重疊的 highlights:', { current, next });
		}
	}
	
	// 重新創建所有 highlights
	createHighlightsInOrder(blockElement, originalText, validHighlights, onClickHighlight);
}

// 獲取元素的純文字內容，不包含HTML標記
function getPlainTextContent(element: HTMLElement): string {
	const walker = document.createTreeWalker(
		element,
		NodeFilter.SHOW_TEXT,
		{
			acceptNode: (node) => {
				return node.nodeValue && node.nodeValue.trim().length > 0 
					? NodeFilter.FILTER_ACCEPT 
					: NodeFilter.FILTER_REJECT;
			}
		}
	);
	
	let text = '';
	let node;
	while (node = walker.nextNode()) {
		text += node.nodeValue || '';
	}
	return text;
}

// 清理所有highlights並重建純文字內容
function clearHighlightsAndRebuildText(blockElement: HTMLElement, originalText: string) {
	// 移除所有子節點
	while (blockElement.firstChild) {
		blockElement.removeChild(blockElement.firstChild);
	}
	
	// 重新添加純文字內容
	const textNode = document.createTextNode(originalText);
	blockElement.appendChild(textNode);
}

// 按順序創建所有highlights
function createHighlightsInOrder(
	blockElement: HTMLElement, 
	originalText: string, 
	highlights: HighlightData[],
	onClickHighlight?: (data: { id: string; blockId: string; startOffset: number; endOffset: number }, event: MouseEvent) => void
) {
	// 創建文字片段和highlight元素的陣列
	const elements: (Text | HTMLSpanElement)[] = [];
	let lastOffset = 0;
	
	highlights.forEach(({ id, blockId, startOffset, endOffset }) => {
		// 添加highlight前的普通文字
		if (lastOffset < startOffset) {
			const beforeText = originalText.substring(lastOffset, startOffset);
			if (beforeText) {
				elements.push(document.createTextNode(beforeText));
			}
		}
		
		// 創建highlight元素
		const highlightText = originalText.substring(startOffset, endOffset);
		if (highlightText.trim()) {
			const highlightSpan = document.createElement('span');
			highlightSpan.className = 'highlight';
			highlightSpan.dataset.id = id;
			highlightSpan.textContent = highlightText;
			
			// 添加點擊事件
			highlightSpan.addEventListener('click', (e) => {
				e.stopPropagation();
				if (onClickHighlight) {
					onClickHighlight({ id, blockId, startOffset, endOffset }, e as MouseEvent);
				}
			});
			
			elements.push(highlightSpan);
		}
		
		lastOffset = endOffset;
	});
	
	// 添加最後的普通文字
	if (lastOffset < originalText.length) {
		const afterText = originalText.substring(lastOffset);
		if (afterText) {
			elements.push(document.createTextNode(afterText));
		}
	}
	
	// 清空容器並添加所有元素
	while (blockElement.firstChild) {
		blockElement.removeChild(blockElement.firstChild);
	}
	
	elements.forEach(element => {
		blockElement.appendChild(element);
	});
}
