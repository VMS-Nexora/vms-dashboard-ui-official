import { VMSConfig } from '@/types/vms';
import { TDataProvider } from '@/utils/pocketbase/data.type';
import { createContext } from 'react';

export interface VMSContextProps {
  vmsConfig: VMSConfig | null;
  loading: boolean;
  error: string | null;
  dataInstance: TDataProvider | null;
}

export const VMSContext = createContext<VMSContextProps | undefined>(undefined);
