import { VMSConfig } from '@/types/vms';
import React, { ReactNode, useEffect, useState } from 'react';
import { VMSContext } from './VMSContext';
import PocketBaseProvider from '@/utils/pocketbase';
import { Spin } from 'antd';
import useSWR from 'swr';
import { LoadingOutlined } from '@ant-design/icons';

interface VMSProviderProps {
  children: ReactNode;
}

const fetchConfig = async (): Promise<VMSConfig> => {
  const response = await fetch('/baseConfig.json');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const VMSProvider: React.FC<VMSProviderProps> = ({ children }) => {
  const { data: config, error } = useSWR('/baseConfig.json', fetchConfig);
  const [dataInstance, setDataInstance] = useState<PocketBaseProvider | null>(
    null
  );

  useEffect(() => {
    if (config) {
      setDataInstance(new PocketBaseProvider(config.database?.url));
    }
  }, [config]);

  if (!config || !dataInstance) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin
          indicator={<LoadingOutlined spin />}
          size="large"
        />
      </div>
    );
  }

  return (
    <VMSContext.Provider
      value={{ vmsConfig: config, dataInstance, loading: !config, error }}>
      {children}
    </VMSContext.Provider>
  );
};
