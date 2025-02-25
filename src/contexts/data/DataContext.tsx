import { TDataProvider } from '@/utils/pocketbase/data.type';
import { createContext } from 'react';

interface DataProviderContextType {
  dataProvider: TDataProvider;
}

export const DataProviderContext = createContext<
  DataProviderContextType | undefined
>(undefined);
