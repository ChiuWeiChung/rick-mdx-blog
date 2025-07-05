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
	onClickHighlight?: (data: { id: string; note?: string }, event: MouseEvent) => void
) {
	const walker = document.createTreeWalker(blockElement, NodeFilter.SHOW_TEXT);
	const textNodes: Text[] = [];
	while (walker.nextNode()) {
		textNodes.push(walker.currentNode as Text);
	}

	const offsetTotal = 0;

	highlights.forEach(({ id, startOffset, endOffset, note }) => {
		let startNode: Text | null = null,
			endNode: Text | null = null;
		let startOffsetInNode = 0,
			endOffsetInNode = 0;
		let offset = offsetTotal;

		for (const node of textNodes) {
			const len = node.textContent?.length ?? 0;

			if (!startNode && offset + len >= startOffset) {
				startNode = node;
				startOffsetInNode = startOffset - offset;
			}

			if (!endNode && offset + len >= endOffset) {
				endNode = node;
				endOffsetInNode = endOffset - offset;
				break;
			}

			offset += len;
		}

		if (startNode && endNode) {
			const range = document.createRange();
			range.setStart(startNode, startOffsetInNode);
			range.setEnd(endNode, endOffsetInNode);

			const span = document.createElement('span');
			span.className = 'highlight';
			span.style.backgroundColor = 'yellow';
			span.dataset.id = id;
			span.dataset.note = note ?? '';

			span.addEventListener('click', e => {
				e.stopPropagation();
				if (onClickHighlight) {
					onClickHighlight({ id, note }, e as MouseEvent);
				}
			});

			try {
				range.surroundContents(span);
			} catch (err) {
				console.warn('無法 Highlight：', err);
			}
		}
	});
}
