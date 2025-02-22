/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ApartmentOutlined,
  HistoryOutlined,
  HomeOutlined,
  IdcardOutlined,
  KeyOutlined,
  SafetyOutlined,
  ScheduleOutlined,
  ShopOutlined,
  TeamOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { ReactNode } from 'react';
import DashboardPage from '../pages/dashboard';
import AppointmentsPage from '../pages/appointments';
import AccessLogsPage from '../pages/access-logs';
import UserManagement from '../pages/user-manage';
import { AllVisitorsPage } from '@/pages/visitors';
import SecurityAlertsPage from '@/pages/security-alerts';

// Define the type for our configuration items
interface AppConfigItem {
  key: string;
  icon: ReactNode;
  label: string;
  element?: ReactNode;
  children?: AppConfigItem[];
  path?: string;
}

// Helper function to generate paths
const generatePath = (key: string, parentKey?: string): string => {
  return parentKey ? `${parentKey}/${key}` : `/${key}`;
};

// Function to process config items and add paths
const processConfigItems = (
  items: AppConfigItem[],
  parentPath: string = ''
): AppConfigItem[] => {
  return items.map((item) => {
    const currentPath = generatePath(item.key, parentPath);
    return {
      ...item,
      path: currentPath,
      children: item.children
        ? processConfigItems(item.children, currentPath)
        : undefined,
    };
  });
};

// Base configuration
export const baseConfigs: AppConfigItem[] = [
  {
    key: 'dashboard',
    icon: <HomeOutlined />,
    label: 'Dashboard',
    element: <DashboardPage />,
  },

  {
    key: 'visitors',
    icon: <IdcardOutlined />,
    label: 'Visitors',
    children: [
      {
        key: 'all-visitors',
        icon: <IdcardOutlined />,
        label: 'All Visitors',

        element: <AllVisitorsPage />,
      },
      {
        key: 'access-log',
        icon: <HistoryOutlined />,
        label: 'Access Logs',
        element: <AccessLogsPage />,
      },
    ],
  },
  {
    key: 'appointments',
    icon: <ScheduleOutlined />,
    label: 'Appointments',
    element: <AppointmentsPage />,
  },

  {
    key: 'security-alerts',
    icon: <SafetyOutlined />,
    label: 'Security Alerts',
    element: <SecurityAlertsPage />,
  },
  {
    key: 'system-management',
    icon: <ApartmentOutlined />,
    label: 'System Manage',
    children: [
      {
        key: 'user-management',
        icon: <TeamOutlined />,
        label: 'User Manage',
        element: <UserManagement />,
      },
      {
        key: 'role-management',
        icon: <KeyOutlined />,
        label: 'Role Manage',
        element: <div>Role Management Page</div>,
      },
      {
        key: 'departments',
        icon: <ShopOutlined />,
        label: 'Departments',
        element: <div>Departments Page</div>,
      },
      {
        key: 'cameras',
        icon: <VideoCameraOutlined />,
        label: 'Cameras',
        element: <div>Cameras Page</div>,
      },
    ],
  },
];

// Process the configuration to add paths
export const appConfigsElements = processConfigItems(baseConfigs);

// Helper function to get menu items (for Antd Menu)
export const getMenuItems = (configs: AppConfigItem[]): any[] => {
  return configs.map((config) => ({
    key: config.key,
    icon: config.icon,
    label: config.label,
    children: config.children ? getMenuItems(config.children) : undefined,
  }));
};

// Helper function to get all routes flat array
export const getAllRoutes = (configs: AppConfigItem[]): AppConfigItem[] => {
  const routes: AppConfigItem[] = [];

  const extractRoutes = (items: AppConfigItem[]) => {
    items.forEach((item) => {
      if (item.element) {
        routes.push(item);
      }
      if (item.children) {
        extractRoutes(item.children);
      }
    });
  };

  extractRoutes(configs);
  return routes;
};

// Helper to find default child route
export const getDefaultChildRoute = (key: string): string | undefined => {
  const findItem = (items: AppConfigItem[]): AppConfigItem | undefined => {
    for (const item of items) {
      if (item.key === key) return item;
      if (item.children) {
        const found = findItem(item.children);
        if (found) return found;
      }
    }
  };

  const item = findItem(appConfigsElements);
  if (item?.children?.length) {
    return item.children[0].path;
  }
  return undefined;
};
