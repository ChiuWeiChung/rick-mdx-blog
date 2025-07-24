import { Prompt } from "@/enums/prompt";

export const generatePrompt = (prompt: Prompt, suffix?: string) => {
  switch (prompt) {
    case Prompt.expand:
      return '請加長內容';
    case Prompt.shorten:
      return '請縮短內容';
    case Prompt.tone:
      return `請變更語氣為${suffix ?? ''}`;
    case Prompt.simplify:
      return '請使用更直白的語言';
    case Prompt.correct:
      return '請修正文字和文法錯誤';
    default:
      return '';
  }
};
