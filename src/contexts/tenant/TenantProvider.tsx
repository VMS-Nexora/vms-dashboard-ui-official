// src/context/TenantProvider.tsx

import { useVMSConfig } from '@/hooks/useVMSConfig';
import { TenantConfig } from '@/types/tenant';
import React, { ReactNode, useEffect, useState } from 'react';
import { TenantContext } from './TenantContext';

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const { vmsConfig, loading: vmsLoading, error: vmsError } = useVMSConfig();
  const [tenantConfig, setTenantConfig] = useState<TenantConfig | null>(null);
  const [tenantPrefix, setTenantPrefix] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (vmsLoading) return;
    if (vmsError) {
      setError(vmsError);
      setLoading(false);
      return;
    }

    const fetchTenantConfig = async () => {
      try {
        const response = await fetch('/tenantConfig.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: TenantConfig = await response.json();
        setTenantConfig(data);

        if (vmsConfig && data.tenant) {
          setTenantPrefix(`${vmsConfig.software.prefix}_${data.tenant.tid}`);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTenantConfig();
  }, [vmsConfig, vmsLoading, vmsError]);

  return (
    <TenantContext.Provider
      value={{ config: tenantConfig, tenantPrefix, loading, error }}>
      {children}
    </TenantContext.Provider>
  );
};
