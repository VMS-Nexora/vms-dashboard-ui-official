import { VMSConfig } from '@/types/vms';
import { createContext } from 'react';

export interface VMSContextProps {
  vmsConfig: VMSConfig | null;
  loading: boolean;
  error: string | null;
}

export const VMSContext = createContext<VMSContextProps | undefined>(undefined);
