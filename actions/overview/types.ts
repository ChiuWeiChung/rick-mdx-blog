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
  }).nullable(),
  lastUpdatedNote: z.object({
    createdAt: z.string(),
    updatedAt: z.string(),
    title: z.string(),
  }).nullable(),
});

/** 取得概要資訊的 response type */
type Overview = z.infer<typeof overviewSchema>;

/** 搜尋筆記統計資料的 request schema */
const queryNoteChartSchema = z
  .object({
    startDate: z.number(), 
    endDate: z.number(),
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
  startDate: z.coerce.number().default(new Date('2020-02-02').getTime()), // 預設為 2020-02-02
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
