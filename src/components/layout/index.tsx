/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseConfigs } from '@/configs/main-menu.config';
import {
  LoginOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Layout, Menu } from 'antd';
import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
const { Sider, Content } = Layout;

const GlobalLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Previous helper functions
  const findOpenKeys = (path: string) => {
    const pathParts = path.split('/').filter(Boolean);
    if (pathParts.length > 1) {
      return [pathParts[0]];
    }
    return [];
  };

  const selectedKeys = (() => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    if (pathParts.length) {
      return [pathParts[pathParts.length - 1]];
    }
    return ['dashboard'];
  })();

  const onMenuClick = ({ key }: { key: string }) => {
    const menuItem = findMenuItem(baseConfigs, key);
    if (menuItem && !menuItem.children) {
      navigate(getItemPath(baseConfigs, key));
    }
  };

  const findMenuItem = (items: any[], key: string): any => {
    for (const item of items) {
      if (item.key === key) {
        return item;
      }
      if (item.children) {
        const found = findMenuItem(item.children, key);
        if (found) return found;
      }
    }
    return null;
  };

  const getItemPath = (
    items: any[],
    targetKey: string,
    parentPath = ''
  ): string => {
    for (const item of items) {
      if (item.key === targetKey) {
        return `${parentPath}/${item.key}`;
      }
      if (item.children) {
        const childPath = getItemPath(
          item.children,
          targetKey,
          `${parentPath}/${item.key}`
        );
        if (childPath !== '') return childPath;
      }
    }
    return '';
  };

  const userMenu = (
    <Menu
      onClick={({ key }) => {
        if (key === 'profile') {
          navigate('/profile');
        }
        if (key === 'logout') {
          // Handle logout logic here (e.g., clear tokens, redirect to login)
          navigate('/login');
        }
      }}
      items={[
        { key: 'profile', label: 'Profile', icon: <UserOutlined /> },
        {
          key: 'logout',
          label: 'Logout',
          icon: <LoginOutlined />,
          danger: true,
        },
      ]}
    />
  );

  return (
    <Layout className="h-screen">
      <Sider
        trigger={null}
        collapsible
        breakpoint="lg"
        collapsedWidth="0"
        collapsed={collapsed}
        style={{ backgroundColor: '#fff' }}
        className="fixed h-full z-20"
        width={200}>
        <div className="flex items-center justify-center bg-white py-1 max-h-[60px]">
          {!collapsed && (
            <div className="flex flex-col items-center">
              <span className="font-bold text-xl bg-gradient-to-r from-[#2A3F9D] to-[#4A5FFF] bg-clip-text text-transparent">
                NEXORA
              </span>
              <span className="text-xs text-gray-500">Visitor management</span>
            </div>
          )}
        </div>
        <div className="h-[calc(100vh-58px)] overflow-y-auto">
          <Menu
            mode="inline"
            selectedKeys={selectedKeys}
            defaultOpenKeys={findOpenKeys(location.pathname)}
            items={baseConfigs}
            className="border-r-0 h-full"
            onClick={onMenuClick}
          />
        </div>
      </Sider>
      <Layout className="relative">
        {/* Fixed header */}
        <div className="sticky top-0 z-10 bg-white shadow-sm h-14 px-4 flex items-center max-h-[80px] py-2">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
          <div className="ml-auto flex items-center gap-2">
            <Dropdown
              overlay={userMenu}
              trigger={['click']}>
              <div className="flex items-center gap-2 cursor-pointer">
                <span className="hidden sm:inline">John Doe</span>
                <span className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
                  JD
                </span>
              </div>
            </Dropdown>
          </div>
        </div>

        {/* Scrollable content */}
        <Content className="overflow-auto bg-[#f7fafc]">
          <div className="p-4">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default GlobalLayout;
