/**
 * 從 className 中提取代碼語言
 * @param className - 類似 "language-javascript" 的字符串
 * @returns 提取的語言名稱，如 "javascript"，如果沒有提取到則返回空字符串
 */
export const getLanguageFromClassName = (className: string): string => {
	const match = className.match(/language-(\w+)/);
	return match ? match[1] : '';
};

/**
 * 檢查是否為 Mermaid 語法
 * @param className - 類別名稱
 * @returns 如果是 Mermaid 語法返回 true
 */
export const isMermaidSyntax = (className: string): boolean => {
	return className === 'language-mermaid';
};
