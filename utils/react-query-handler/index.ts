import { mutationResponseSchema, type HandleMutationRes, type Handler } from './types';

/**
 * React Query Handler
 * 這樣可以確保開發過程中能清楚追蹤所有 API 呼叫的流程和資料。
 */

// Log Style 設定 - 用於在 console 中以不同顏色區分各種類型的日誌
const logStyles = {
  base: 'color: black; display: inline-block; width: 120px;',
  Request: 'background: #6fa8dc;', // 藍色背景表示請求
  Response: 'background: #93c47d;', // 綠色背景表示回應
  'Client Error': 'background: #CC0000;', // 紅色背景表示客戶端錯誤
  'Server Error': 'background: #CC0000;', // 紅色背景表示伺服器錯誤
};

/**
 * 帶樣式的日誌函數
 * 以特定顏色和樣式將訊息輸出到 console
 */
const logWithStyle = (type: keyof typeof logStyles, message: unknown) => {
  const style = `${logStyles.base} ${logStyles[type]}`;
  console.log(`%c ${type}: `, style, message);
};

/**
 * 共用的處理邏輯
 * 這是 queryHandler 和 mutationHandler 的核心邏輯
 * 記錄請求、執行伺服器動作、記錄回應或錯誤
 */
const handler: Handler = async (serverAction, args, logKey) => {
  try {
    logWithStyle('Request', logKey);
    const result = await serverAction(args);
    logWithStyle('Response', result);

    const mutationResponse = mutationResponseSchema.safeParse(result);
    // 如果解析成功，但 API Response 結果失敗，則拋出錯誤
    if (mutationResponse.success && !mutationResponse.data.success) {
      throw new Error(mutationResponse.data.message);
    }

    return result;
  } catch (error) {
    logWithStyle('Server Error', error);
    throw new Error(error instanceof Error ? error.message : '系統異常');
  }
};

/**
 * 讓 mutation 可以帶入 serverAction 的參數，並且在 mutation 執行時，會自動帶入 serverAction 的參數
 * 用於處理資料變更類的 API 呼叫，例如：新增、更新、刪除資料
 * 使用範例:
 * const createTodoMutation = useMutation(
 *   mutationHandler(createTodo)
 * );
 */
export const mutationHandler: HandleMutationRes = serverAction => {
  return async args => {
    return await handler(serverAction, args, args);
  };
};
