import { TenantConfig } from '@/types/tenant';
import { createContext } from 'react';

export interface TenantContextProps {
  config: TenantConfig | null;
  loading: boolean;
  error: string | null;
  tenantPrefix: string | null;
}

export const TenantContext = createContext<TenantContextProps | undefined>(
  undefined
);
