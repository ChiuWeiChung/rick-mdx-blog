import { z } from 'zod/v4';

const portfolioSchema = z.object({
  id: z.number(),
  projectName: z.string().min(1, { message: '專案名稱不能為空' }),
  githubUrl: z.string().min(1, { message: 'Github 連結不能為空' }),
  readmeUrl: z.string().min(1, { message: 'Readme 連結不能為空' }),
  startDate: z.number({ message: '請選擇開始日期' }).describe('開始日期'),
  endDate: z.number().nullable().describe('結束日期'),
});

type Portfolio = z.infer<typeof portfolioSchema>;

const portfolioKeys = portfolioSchema.keyof().enum;

// =============================== 新增 ===============================

const createPortfolioSchema = portfolioSchema.omit({ id: true }).refine(
  data => {
    if (data.startDate && data.endDate && data.startDate > data.endDate) return false;

    return true;
  },
  {
    message: '開始日不能大於結束日',
    path: ['startDate'],
  }
);

type CreatePortfolioRequest = z.infer<typeof createPortfolioSchema>;

export {
  // portfolio schema
  portfolioSchema,
  type Portfolio,
  portfolioKeys,

  // 新增 portfolio schema
  createPortfolioSchema,
  type CreatePortfolioRequest,
};
