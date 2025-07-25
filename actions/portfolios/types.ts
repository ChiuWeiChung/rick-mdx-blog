import { z } from 'zod/v4';

const portfolioSchema = z.object({
  id: z.number(),
  projectName: z.string().min(1, { message: '專案名稱不能為空' }),
  githubUrl: z.url('Github 連結格式不正確'),
  readmeUrl: z.url('Readme 連結格式不正確'),
  startDate: z.number({ message: '請選擇開始日期' }).describe('開始日期'),
  endDate: z.number().nullable().describe('結束日期'),
  coverPath: z.string().nullable(),
  description: z.string().nullable(),
});

type Portfolio = z.infer<typeof portfolioSchema>;

const portfolioKeys = portfolioSchema.keyof().enum;

// =============================== 新增 ===============================

const createPortfolioSchema = portfolioSchema.extend({
  coverFile: z.instanceof(File).nullable(),
}).omit({ id: true }).refine(
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
const createPortfolioKeys = createPortfolioSchema.keyof().enum;

export {
  // portfolio schema
  portfolioSchema,
  type Portfolio,
  portfolioKeys,

  // 新增 portfolio schema
  createPortfolioSchema,
  type CreatePortfolioRequest,
  createPortfolioKeys,
};
