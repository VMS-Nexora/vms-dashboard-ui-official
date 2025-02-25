import { TDataProvider } from '@/utils/pocketbase/data.type';
import React, { ReactNode } from 'react';
import { DataProviderContext } from './DataContext';

type DataProviderProviderProps = {
  children: ReactNode;
  dataProvider: TDataProvider;
};

export const DataProvider: React.FC<DataProviderProviderProps> = ({
  children,
  dataProvider,
}) => {
  return (
    <DataProviderContext.Provider value={{ dataProvider }}>
      {children}
    </DataProviderContext.Provider>
  );
};
