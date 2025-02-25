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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 5;

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

        if (vmsConfig && data.tenant && data.tenant.tid) {
          setTenantPrefix(`${vmsConfig.software.prefix}_${data.tenant.tid}`);
          setLoading(false);
        } else {
          // If we don't have the required data, retry after a delay
          if (retryCount < MAX_RETRIES) {
            setTimeout(() => {
              setRetryCount((prev) => prev + 1);
            }, 1000); // Wait 1 second before retrying
          } else {
            setError('Failed to get tenant prefix after multiple attempts');
            setLoading(false);
          }
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred.');
        }
        setLoading(false);
      }
    };

    fetchTenantConfig();
  }, [vmsConfig, vmsLoading, vmsError, retryCount]);

  // Render a loading indicator or nothing while waiting
  if (loading) {
    return <div></div>;
  }

  // Only render the provider when we have a valid tenantPrefix
  if (!tenantPrefix) {
    return <div>Error: {error || 'Could not retrieve tenant prefix'}</div>;
  }

  return (
    <TenantContext.Provider
      value={{
        config: tenantConfig,
        tenantPrefix, // This will never be null at this point
        loading,
        error,
      }}>
      {children}
    </TenantContext.Provider>
  );
};
