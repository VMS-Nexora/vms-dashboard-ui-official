// src/context/VMSProvider.tsx

import { VMSConfig } from '@/types/vms';
import React, { ReactNode, useEffect, useState } from 'react';
import { VMSContext } from './VMSContext';

interface VMSProviderProps {
  children: ReactNode;
}

export const VMSProvider: React.FC<VMSProviderProps> = ({ children }) => {
  const [config, setConfig] = useState<VMSConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/baseConfig.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: VMSConfig = await response.json();
        setConfig(data);
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

    fetchConfig();
  }, []);

  return (
    <VMSContext.Provider value={{ vmsConfig: config, loading, error }}>
      {children}
    </VMSContext.Provider>
  );
};
