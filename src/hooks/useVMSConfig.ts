// src/hooks/useVMSConfig.ts

import { VMSContext, VMSContextProps } from '@/contexts/vms/VMSContext';
import { useContext } from 'react';

export const useVMSConfig = (): VMSContextProps => {
  const context = useContext(VMSContext);
  if (context === undefined) {
    throw new Error('useVMSConfig must be used within a VMSProvider');
  }
  return context;
};
