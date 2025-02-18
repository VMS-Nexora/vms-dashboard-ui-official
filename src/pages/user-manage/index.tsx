/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Button, Form, Input, Modal, Select, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useState } from 'react';
import { mockData } from './mock-data';

interface UserData {
  key: number;
  index: number;
  userName: string;
  gender: 'Male' | 'Female';
  nickName: string;
  phoneNumber: string;
  email: string;
  userStatus: 'Enable' | 'Disable';
}

const UserManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const columns: ColumnsType<UserData> = [
    {
      title: 'Index',
      dataIndex: 'index',
      key: 'index',
      width: 80,
    },
    {
      title: 'Name',
      dataIndex: 'nickName',
      key: 'userName',
      width: 150,
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      width: 100,
      render: (gender: string) => (
        <span
          className={`px-2 py-1 rounded ${
            gender === 'Female'
              ? 'text-red-500 bg-red-50'
              : 'text-blue-500 bg-blue-50'
          }`}>
          {gender}
        </span>
      ),
    },
    {
      title: 'Nick Name',
      dataIndex: 'nickName',
      key: 'nickName',
      width: 150,
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 150,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
    },
    {
      title: 'User Status',
      dataIndex: 'userStatus',
      key: 'userStatus',
      width: 120,
      render: (status: string) => (
        <span
          className={`px-2 py-1 rounded ${
            status === 'Enable'
              ? 'text-green-500 bg-green-50'
              : 'text-yellow-500 bg-yellow-50'
          }`}>
          {status}
        </span>
      ),
    },
    {
      title: 'Operate',
      key: 'operate',
      width: 150,
      render: () => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}>
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Search Modal */}
      <Modal
        title="Search Users"
        open={isSearchOpen}
        onCancel={() => setIsSearchOpen(false)}
        footer={null}>
        <Form
          form={form}
          layout="vertical">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Form.Item
              name="userName"
              label="Full Name">
              <Input
                placeholder="Enter user name"
                allowClear
              />
            </Form.Item>

            <Form.Item
              name="gender"
              label="Gender">
              <Select
                placeholder="Select gender"
                allowClear
                options={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                ]}
              />
            </Form.Item>

            <Form.Item
              name="nickName"
              label="Nick Name">
              <Input
                placeholder="Enter nick name"
                allowClear
              />
            </Form.Item>

            <Form.Item
              name="phoneNumber"
              label="Phone Number">
              <Input
                placeholder="Enter phone number"
                allowClear
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email">
              <Input
                placeholder="Enter email"
                allowClear
              />
            </Form.Item>

            <Form.Item
              name="userStatus"
              label="User Status">
              <Select
                placeholder="Select status"
                allowClear
                options={[
                  { value: 'enable', label: 'Enable' },
                  { value: 'disable', label: 'Disable' },
                ]}
              />
            </Form.Item>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              icon={<ReloadOutlined />}
              onClick={() => form.resetFields()}>
              Reset
            </Button>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => setIsSearchOpen(false)}>
              Search
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Table */}
      <div className="bg-white shadow-sm rounded-lg p-4">
        <div className="flex justify-between items-center pb-4">
          <span className="text-lg font-medium">User List</span>
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}>
              Add
            </Button>
            <Button icon={<ReloadOutlined />}>Refresh</Button>
            <Button icon={<SettingOutlined />}>Column Setting</Button>
            <Button
              icon={<SearchOutlined />}
              onClick={() => setIsSearchOpen(true)}
            />
          </Space>
        </div>
        <Table
          size="small"
          columns={columns as any}
          dataSource={mockData}
          scroll={{ x: 'max-content', y: 'calc(100vh - 18rem)' }}
        />
      </div>
    </div>
  );
};

export default UserManagement;
