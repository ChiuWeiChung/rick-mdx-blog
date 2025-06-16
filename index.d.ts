import type { Row, RowData } from '@tanstack/react-table';
import type { QueryKey } from '@tanstack/react-query';
import type { Option } from './components/select/types';
import type { AuthPermission } from './enums/auth';

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    onDataEdit?: (request: TData) => void;
    onDataDelete?: (request: TData) => void;
    onModalOpen?: (values: TData) => void;
    assignRowClassName?: (values: Row<TData>) => string;
    editable?: boolean;
    extra?: unknown;
    permission?: AuthPermission[];
  }
  interface ColumnMeta {
    filterVariant?: 'text' | 'select' | 'number' | 'double';
    options?: Option[];
    showToolTip?: boolean;
  }
}


interface ToastMessage {
  title: string;
  description?: string;
}

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      invalidateQueryKeys?: QueryKey;
      successMessage?: ToastMessage;
      errorMessage?: ToastMessage;
    };
  }
}