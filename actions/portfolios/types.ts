import { z } from 'zod/v4';

export const portfolioSchema = z.object({
  id: z.number(),
  project_name: z.string().min(1, { message: '專案名稱不能為空' }),
  githubUrl: z.string().min(1, { message: 'Github 連結不能為空' }),
  readmeUrl: z.string().min(1, { message: 'Readme 連結不能為空' }),
  startDate: z.date(),
  endDate: z.date().nullable(),
});

export type Portfolio = z.infer<typeof portfolioSchema>;