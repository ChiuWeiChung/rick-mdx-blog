/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import {
  defaultShouldDehydrateQuery,
  type Mutation,
  MutationCache,
  type Query,
  QueryCache,
  type QueryClientConfig,
  QueryClientProvider,
} from '@tanstack/react-query';
import { type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { getQueryClient } from './utils';
import { useAlertModal } from '@/hooks/use-alert-modal';

export default function Providers({ children }: { children: ReactNode }) {
  const { openAlertModal } = useAlertModal();
  const router = useRouter();

  const errorHandler = async (
    error: Error,
    _query?: Query<unknown, unknown, unknown>,
    _mutation?: Mutation<unknown, unknown>,
    _variables?: unknown
  ) => {
    openAlertModal({
      status: 'error',
      description: error.message,
      confirmText: '確認',
    });
  };

  const queryErrorHandler = (error: Error, query: Query<unknown, unknown, unknown>) => {
    void errorHandler(error, query);
  };

  const mutationErrorHandler = (
    error: Error,
    variables: unknown,
    _context: unknown,
    mutation: Mutation<unknown, unknown>
  ) => {
    void errorHandler(error, undefined, mutation, variables);
  };

  const config: QueryClientConfig = {
    defaultOptions: {
      queries: {
        retry: 0,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
      },
      mutations: { retry: false },
      dehydrate: {
        // include pending queries in dehydration
        shouldDehydrateQuery: query => {
          return defaultShouldDehydrateQuery(query) || query.state.status === 'pending';
        },
      },
    },
    queryCache: new QueryCache({ onError: queryErrorHandler }),
    mutationCache: new MutationCache({ onError: mutationErrorHandler }),
  };
  const queryClient = getQueryClient(config);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
