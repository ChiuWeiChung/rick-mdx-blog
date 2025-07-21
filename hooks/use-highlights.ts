'use client';

import { useEffect, useCallback, useRef } from 'react';
import { highlightTextInBlock } from '@/lib/highlight';

export interface HighlightData {
	id: string;
	blockId: string;
	startOffset: number;
	endOffset: number;
	note?: string;
}

export type OnClickHighlight = (data: { id: string; blockId: string; startOffset: number; endOffset: number }, event: MouseEvent) => void;

export interface SelectionData {
	blockId: string;
	startOffset: number;
	endOffset: number;
	selectedText: string;
	range: Range;
}

export type OnTextSelected = (data: SelectionData) => void;
export type OnCreateHighlight = (data: Omit<HighlightData, 'id'>) => void;

/**
 * highlight 文字
 * @param highlights highlight 文字資料
 * @param onClickHighlight 點擊 highlight 文字的 callback，callback 的參數為 highlight 文字資料
 * @param onTextSelected 文字被選取時的 callback，可用於顯示 popover
 * @param onCreateHighlight 創建新 highlight 的 callback
 */
export function useHighlights(
	highlights: HighlightData[], 
	onClickHighlight?: OnClickHighlight,
	onTextSelected?: OnTextSelected,
	onCreateHighlight?: OnCreateHighlight
) {
	// 追蹤最後選取時間
	const lastSelectionTimeRef = useRef(0);

	// 找到包含指定 node 的 block 元素
	const findBlockElement = useCallback((node: Node): HTMLElement | null => {
		let current = node.nodeType === Node.TEXT_NODE ? node.parentElement : node as HTMLElement;
		
		while (current) {
			if (current.hasAttribute('data-block-id')) {
				return current;
			}
			current = current.parentElement;
		}
		
		return null;
	}, []);

	// 計算文字在 block 元素中的 offset
	const calculateTextOffset = useCallback((blockElement: HTMLElement, targetNode: Node, targetOffset: number): number => {
		const walker = document.createTreeWalker(
			blockElement, 
			NodeFilter.SHOW_TEXT,
			{
				acceptNode: (node) => {
					// 確保文字節點在指定的 block 元素內
					const nodeBlock = findBlockElement(node);
					return nodeBlock === blockElement ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
				}
			}
		);
		
		let totalOffset = 0;
		let currentNode;
		
		while (currentNode = walker.nextNode()) {
			if (currentNode === targetNode) {
				return totalOffset + targetOffset;
			}
			totalOffset += currentNode.textContent?.length || 0;
		}
		
		// 如果沒有找到目標節點，返回當前累計的 offset
		return totalOffset;
	}, [findBlockElement]);

	// 處理文字選取
	const handleSelectionChange = useCallback(() => {
		const selection = window.getSelection();
		if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
			return;
		}

		const range = selection.getRangeAt(0);
		const startContainer = range.startContainer;
		const endContainer = range.endContainer;
		
		// 確保選取範圍在同一個 block 元素內
		const startBlock = findBlockElement(startContainer);
		const endBlock = findBlockElement(endContainer);
		
		if (!startBlock || !endBlock || startBlock !== endBlock) {
			console.warn('❌ 選取範圍必須在同一個 block 元素內');
			// 延遲清除，避免打斷正在進行的選取
			setTimeout(() => {
				const currentSelection = window.getSelection();
				if (currentSelection && !currentSelection.isCollapsed) {
					const currentRange = currentSelection.getRangeAt(0);
					const currentStartBlock = findBlockElement(currentRange.startContainer);
					const currentEndBlock = findBlockElement(currentRange.endContainer);
					
					// 只有當前選取仍然跨區塊時才清除
					if (currentStartBlock !== currentEndBlock) {
						currentSelection.removeAllRanges();
					}
				}
			}, 300);
			return;
		}

		const blockId = startBlock.getAttribute('data-block-id');
		if (!blockId) {
			console.warn('❌ 找不到 block ID');
			return;
		}

		// 計算選取文字的 offset
		const startOffset = calculateTextOffset(startBlock, startContainer, range.startOffset);
		const endOffset = calculateTextOffset(startBlock, endContainer, range.endOffset);
		const selectedText = selection.toString().trim();

		// 忽略空選取或只有空白字符的選取
		if (!selectedText || selectedText.length === 0) {
			return;
		}

		console.log('✅ 文字選取成功:', selectedText);
		
		if (onTextSelected) {
			onTextSelected({
				blockId,
				startOffset,
				endOffset,
				selectedText,
				range: range.cloneRange()
			});
		} else {
			console.warn('❌ onTextSelected callback 不存在');
		}

		// 更新最後選取時間
		lastSelectionTimeRef.current = Date.now();
	}, [findBlockElement, calculateTextOffset, onTextSelected]);

	// 創建 highlight 的方法
	const createHighlight = useCallback((selectionData: SelectionData, note?: string) => {
		if (onCreateHighlight) {
			onCreateHighlight({
				blockId: selectionData.blockId,
				startOffset: selectionData.startOffset,
				endOffset: selectionData.endOffset,
				note
			});
		}
		
		// 清除選取
		window.getSelection()?.removeAllRanges();
	}, [onCreateHighlight]);

	// 監聽 selectionchange 事件 (簡化 debounce)
	useEffect(() => {
		let timeoutId: NodeJS.Timeout;
		
		const debouncedHandler = () => {
			clearTimeout(timeoutId);
			// 增加 debounce 時間到 500ms，確保用戶有足夠時間完成選取
			timeoutId = setTimeout(() => {
				handleSelectionChange();
			}, 500);
		};
		
		document.addEventListener('selectionchange', debouncedHandler);
		
		return () => {
			document.removeEventListener('selectionchange', debouncedHandler);
			clearTimeout(timeoutId);
		};
	}, [handleSelectionChange]);

	// 原有的 highlight 顯示邏輯
	useEffect(() => {
		// group by blockId
		const blockMap = new Map<string, HighlightData[]>();

		for (const h of highlights) {
			if (!blockMap.has(h.blockId)) {
				blockMap.set(h.blockId, []);
			}
			blockMap.get(h.blockId)!.push(h);
		}

		// apply highlight per block
		// 所有數據（包括 note）都保存在 React state 中，DOM 只存儲 id
		for (const [blockId, blockHighlights] of blockMap.entries()) {
			const el = document.querySelector<HTMLElement>(`[data-block-id="${blockId}"]`);
			if (el) {
				highlightTextInBlock(el, blockHighlights, onClickHighlight);
			}
		}
	}, [highlights, onClickHighlight]);

	return {
		createHighlight
	};
}
