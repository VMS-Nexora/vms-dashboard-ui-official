// src/constants.tsx
import {
  ApartmentOutlined,
  HistoryOutlined,
  HomeOutlined,
  IdcardOutlined,
  KeyOutlined,
  SafetyOutlined,
  ScheduleOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];
export const menuItems: MenuItem[] = [
  {
    key: 'dashboard',
    icon: <HomeOutlined />,
    label: 'Dashboard',
  },
  {
    key: 'visitors',
    icon: <IdcardOutlined />,
    label: 'Visitor Check-in',
  },
  {
    key: 'appointments',
    icon: <ScheduleOutlined />,
    label: 'Appointments',
  },
  {
    key: 'access-log',
    icon: <HistoryOutlined />,
    label: 'Access Logs',
  },
  {
    key: 'security-alerts',
    icon: <SafetyOutlined />,
    label: 'Security Alerts',
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
      },
      {
        key: 'role-management',
        icon: <KeyOutlined />,
        label: 'Role Manage',
      },
    ],
  },
];
