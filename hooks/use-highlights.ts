'use client';

import { useEffect } from 'react';
import { highlightTextInBlock } from '@/lib/highlight';

export interface HighlightData {
	id: string;
	blockId: string;
	startOffset: number;
	endOffset: number;
	note?: string;
}

export type OnClickHighlight = (data: { id: string; note?: string }, event: MouseEvent) => void;

/**
 * highlight 文字
 * @param highlights highlight 文字資料
 * @param onClickHighlight 點擊 highlight 文字的 callback，callback 的參數為 highlight 文字資料
 */
export function useHighlights(highlights: HighlightData[], onClickHighlight?: OnClickHighlight) {
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
		for (const [blockId, blockHighlights] of blockMap.entries()) {
			const el = document.querySelector<HTMLElement>(`[data-block-id="${blockId}"]`);
			console.log('el', el);
			if (el) {
				highlightTextInBlock(el, blockHighlights, onClickHighlight);
			}
		}
	}, [highlights, onClickHighlight]);
}
