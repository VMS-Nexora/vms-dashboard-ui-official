import {
  TenantContext,
  TenantContextProps,
} from '@/contexts/tenant/TenantContext';
import { useContext } from 'react';

export const useTenant = (): TenantContextProps => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
