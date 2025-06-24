import {
  type MutationFunction,
  type QueryFunction,
  type QueryKey,
} from '@tanstack/react-query';

export type Handler = <T, U = unknown>(
  serverAction: (args: T) => U | Promise<U>,
  args: T | (T & { client?: any; signal?: any }),
  logKey: unknown,
) => Promise<U>;

export type HandleQueryRes = <TQueryFnData, TQueryKey extends QueryKey>(
  serverAction: QueryFunction<TQueryFnData, TQueryKey>,
) => QueryFunction<TQueryFnData, TQueryKey>;

export type HandleMutationRes = <T = unknown, U = unknown>(
  serverAction: MutationFunction<U, T>,
) => MutationFunction<U, T>;
