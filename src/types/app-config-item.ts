import { ReactNode } from 'react';

export interface AppConfigItem {
  key: string;
  icon: ReactNode;
  label: string;
  element?: ReactNode;
  children?: AppConfigItem[];
  path?: string;
  display?: boolean;
}
