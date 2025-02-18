/* eslint-disable @typescript-eslint/no-explicit-any */
import { menuItems } from '@/configs/sidebar.config';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Layout, Menu } from 'antd';
import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const { Sider, Content } = Layout;

const GlobalLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Previous functions remain the same...
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
    const menuItem = findMenuItem(menuItems, key);
    if (menuItem && !menuItem.children) {
      navigate(getItemPath(menuItems, key));
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

  return (
    <Layout className="h-screen">
      <Sider
        trigger={null}
        collapsible
        breakpoint="lg"
        collapsedWidth="0"
        collapsed={collapsed}
        className="bg-white shadow-md"
        width={200}>
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          defaultOpenKeys={findOpenKeys(location.pathname)}
          items={menuItems}
          className="border-r-0 h-full"
          onClick={onMenuClick}
        />
      </Sider>
      <Layout className="relative">
        {/* Fixed header */}
        <div className="sticky top-0 z-10 bg-white shadow-sm h-14 px-4 flex items-center">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden sm:inline">John Doe</span>
            <span className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
              JD
            </span>
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
