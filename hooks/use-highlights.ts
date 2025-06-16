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

type OnClickHighlight = (data: { id: string; note?: string }, event: MouseEvent) => void;

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
			if (el) {
				highlightTextInBlock(el, blockHighlights, onClickHighlight);
			}
		}
	}, [highlights, onClickHighlight]);
}
