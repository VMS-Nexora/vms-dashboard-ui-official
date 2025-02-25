import { DataProviderContext } from '@/contexts/data/DataContext';
import { useContext } from 'react';

export const useDataProvider = () => {
  const context = useContext(DataProviderContext);

  if (context === undefined) {
    throw new Error(
      'useDataProvider must be used within an DataProviderContext'
    );
  }
  return context;
};
