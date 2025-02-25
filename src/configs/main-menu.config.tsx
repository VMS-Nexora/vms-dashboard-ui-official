import { AllVisitorsPage } from '@/pages/visitors';
import { AppConfigItem } from '@/types/app-config-item';
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
import AccessLogsPage from '../pages/access-logs';
import AppointmentsPage from '../pages/appointments';
import DashboardPage from '../pages/dashboard';
import UserManagement from '../pages/user-manage';

// Base configuration
export const baseConfigs: AppConfigItem[] = [
  {
    key: 'dashboard',
    icon: <HomeOutlined />,
    label: 'Dashboard',
    element: <DashboardPage />,
    display: true,
  },

  {
    key: 'visitors',
    icon: <IdcardOutlined />,
    label: 'Visitors',
    display: true,
    children: [
      {
        key: 'all-visitors',
        icon: <IdcardOutlined />,
        label: 'All Visitors',
        display: true,
        element: <AllVisitorsPage />,
      },
      {
        key: 'access-log',
        icon: <HistoryOutlined />,
        label: 'Access Logs',
        display: true,
        element: <AccessLogsPage />,
      },
    ],
  },
  {
    key: 'appointments',
    icon: <ScheduleOutlined />,
    label: 'Appointments',
    display: true,
    element: <AppointmentsPage />,
  },

  {
    key: 'security-alerts',
    icon: <SafetyOutlined />,
    label: 'Security Alerts',
    display: true,

    element: <div>Security Alerts Page</div>,
  },

  {
    key: 'system-management',
    icon: <ApartmentOutlined />,
    label: 'System Manage',
    display: true,
    children: [
      {
        key: 'user-management',
        icon: <TeamOutlined />,
        label: 'User Manage',
        display: true,
        element: <UserManagement />,
      },
      {
        key: 'role-management',
        icon: <KeyOutlined />,
        label: 'Role Manage',
        display: true,
        element: <div>Role Management Page</div>,
      },
      {
        key: 'departments',
        icon: <ShopOutlined />,
        label: 'Departments',
        display: true,
        element: <div>Departments Page</div>,
      },
      {
        key: 'cameras',
        icon: <VideoCameraOutlined />,
        label: 'Cameras',
        display: true,
        element: <div>Cameras Page</div>,
      },
    ],
  },
];
