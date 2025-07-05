import { type MutationFunction } from '@tanstack/react-query';
import { z } from 'zod/v4';

export type Handler = <T, U = unknown>(
  serverAction: (args: T) => U | Promise<U>,
  args: T,
  logKey: unknown
) => Promise<U>;

export type HandleMutationRes = <T = unknown, U = unknown>(
  serverAction: MutationFunction<U, T>
) => MutationFunction<U, T>;

export const mutationResponseSchema = z.object({
  success: z.boolean().describe('是否成功'),
  message: z.string().describe('錯誤訊息'),
});