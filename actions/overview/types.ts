import { addMonths } from 'date-fns';
import { z } from 'zod/v4';

/** 取得概要資訊的 response schema */
const overviewSchema = z.object({
  noteCount: z.number(),
  categoryCount: z.number(),
  tagCount: z.number(),
  lastCreatedNote: z.object({
    createdAt: z.string(),
    updatedAt: z.string(),
    title: z.string(),
  }),
  lastUpdatedNote: z.object({
    createdAt: z.string(),
    updatedAt: z.string(),
    title: z.string(),
  })
});

/** 取得概要資訊的 response type */
type Overview = z.infer<typeof overviewSchema>;

/** 搜尋筆記統計資料的 request schema */
const queryNoteChartSchema = z
  .object({
    startDate: z.number().default(addMonths(new Date(), -12).getTime()), // 預設為 11 個月前
    endDate: z.number().default(Date.now()),
  })
  .check(ctx => {
    if (ctx.value.startDate && ctx.value.endDate && ctx.value.startDate > ctx.value.endDate) {
      ctx.issues.push({
        code: 'custom',
        message: '開始不能大於結束',
        input: ctx.value.startDate,
        path: ['startDate'],
      });
    }
  });

const coerceQueryNoteChartSchema = z.object({
  startDate: z.coerce.number().default(addMonths(new Date(), -12).getTime()), // 預設為 11 個月前,
  endDate: z.coerce.number().default(Date.now()),
});

/** 搜尋筆記統計資料的 request type */
type QueryNoteChart = z.infer<typeof queryNoteChartSchema>;

/** 搜尋筆記統計資料的 request schema 的 key */
const queryNoteChartKeys = queryNoteChartSchema.keyof().enum;

/** 筆記統計資料的 response schema */
const noteChartSchema = z.object({
  month: z.string(),
  count: z.number(),
});

/** 筆記統計資料的 response type */
type NoteChart = z.infer<typeof noteChartSchema>;

export {
  // 概要資訊
  type Overview,
  overviewSchema,
  coerceQueryNoteChartSchema,

  // 查詢筆記統計資料
  type QueryNoteChart,
  queryNoteChartSchema,
  queryNoteChartKeys,

  // 筆記統計資料
  type NoteChart,
  noteChartSchema,
};
