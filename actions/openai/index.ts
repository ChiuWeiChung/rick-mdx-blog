'use server';

import OpenAI from 'openai';

// 建立 OpenAI 客戶端實例
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // 僅適用於開發環境
});

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatResponse {
  message: string;
  error?: string;
}

// 定義系統訊息，限制 AI 的功能範圍
const SYSTEM_MESSAGE: ChatMessage = {
  role: 'system',
  content: `你是一個專業的文字處理助手，只能協助用戶處理以下特定的文字編輯任務：

1. **加長內容**：擴展、延伸或豐富用戶提供的文字內容
2. **縮短內容**：精簡、濃縮或摘要用戶提供的文字內容
3. **變更語氣**：改變文字的語調、風格或表達方式（如正式/非正式、友善/嚴肅等）
4. **使用更直白的語言**：將複雜或技術性的內容轉換為簡單易懂的表達
5. **修正文字和文法錯誤**：糾正拼寫、語法、標點符號等錯誤

重要規則：
- 只能處理上述五種文字處理任務
- 用戶必須提供要處理的文字內容
- 如果用戶提出其他要求（如回答問題、提供資訊、創作內容、翻譯等），請禮貌地拒絕並提醒用戶您的功能範圍
- 如果用戶沒有提供要處理的文字內容，請要求用戶提供

輸出格式要求：
- **直接輸出處理後的文字內容，不要加任何前綴說明**
- 不要使用「修正後的文字如下：」、「加長後的內容：」、「縮短後的內容：」等前綴文字
- 不要在結尾加上任何說明或總結
- 僅輸出最終的文字結果

語言使用規範：
- **務必使用繁體中文回應**，絕對避免簡體中文
- 專有名詞（如 JavaScript、HTML、CSS、API、Docker、Proxy、Tree、Hash、Node 等技術術語）保持英文呈現
- 所有中文字詞統一使用繁體中文字形
- 標點符號使用全形中文標點符號

請始終保持專業和友善的態度，並明確告知用戶您的功能限制。`,
};

/**
 * 處理 OpenAI API 錯誤並返回用戶友好的錯誤訊息
 */
function handleOpenAIError(error: unknown): string {
  console.error('OpenAI API 錯誤:', error);

  // 檢查是否是 OpenAI 的 APIError
  if (error && typeof error === 'object' && 'status' in error) {
    const apiError = error as { status: number; message?: string };
    switch (apiError.status) {
      case 401:
        return '❌ API 金鑰無效或已過期。請檢查您的 OpenAI API 金鑰設置。';
      case 429:
        return '⚠️ API 配額已用完或請求頻率過高。請檢查您的 OpenAI 帳戶配額、計費設置，或稍後再試。';
      case 500:
        return '🔧 OpenAI 服務器暫時無法使用，請稍後再試。';
      case 503:
        return '🔧 OpenAI 服務暫時不可用，請稍後再試。';
      default:
        return `❌ API 錯誤 (${apiError.status}): ${apiError.message || '未知錯誤'}`;
    }
  }

  // 檢查網路錯誤
  if (
    error &&
    typeof error === 'object' &&
    'code' in error &&
    (error as { code: string }).code === 'NETWORK_ERROR'
  ) {
    return '網路連線錯誤，請檢查您的網路連線。';
  }

  // 檢查是否是 Error 實例
  if (error instanceof Error) {
    if (error.message?.includes('fetch')) {
      return '網路連線錯誤，請檢查您的網路連線。';
    }

    // 檢查 API 金鑰是否未設置
    if (error.message?.includes('API key') || !process.env.OPENAI_API_KEY) {
      return '請設置有效的 OpenAI API 金鑰。';
    }

    return error.message;
  }

  // 預設錯誤訊息
  return '發生未知錯誤，請稍後再試。';
}

/**
 * 發送聊天訊息到 OpenAI API
 * @param messages 聊天訊息陣列
 * @param model 使用的 OpenAI 模型 (預設: gpt-4o-mini)
 * @returns Promise<ChatResponse>
 */
export async function sendChatMessage(
  messages: ChatMessage[],
  model: string = 'gpt-4o-mini'
): Promise<ChatResponse> {
  try {
    // 檢查 API 金鑰是否存在
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('請在 .env 文件中設置 VITE_OPENAI_API_KEY');
    }

    // 在用戶訊息前添加系統訊息
    const messagesWithSystem = [SYSTEM_MESSAGE, ...messages];

    const completion = await openai.chat.completions.create({
      model: model,
      messages: messagesWithSystem,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const responseMessage = completion.choices[0]?.message?.content;

    if (!responseMessage) {
      throw new Error('未收到 AI 回覆');
    }

    return {
      message: responseMessage,
    };
  } catch (error) {
    const errorMessage = handleOpenAIError(error);

    return {
      message: '',
      error: errorMessage,
    };
  }
}

/**
 * 簡單的單次問答函式
 * @param prompt 使用者輸入的問題
 * @param model 使用的 OpenAI 模型
 * @returns Promise<ChatResponse>
 */
export async function askQuestion(
  prompt: string,
  model: string = 'gpt-4o-mini'
): Promise<ChatResponse> {
  const messages: ChatMessage[] = [
    {
      role: 'user',
      content: prompt,
    },
  ];

  return await sendChatMessage(messages, model);
}
