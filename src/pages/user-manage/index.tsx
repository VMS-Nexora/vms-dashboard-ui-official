/* eslint-disable @typescript-eslint/no-explicit-any */
import useUserManagement from '@/hooks/useUserMangement';
import { User } from '@/types/user';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Form, Input, Modal, Select, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';

// User Management Component
const UserManagement: React.FC = () => {
  const [searchForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [createForm] = Form.useForm();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const {
    users,
    loading,
    pagination,
    setPagination,
    getUsers,
    getUser,
    updateUser,
    deleteUsers,
    createUser,
  } = useUserManagement();

  // Load users when pagination changes
  useEffect(() => {
    getUsers();
  }, [pagination.pageSize]);

  // Handle table pagination
  const handleTableChange = (newPagination: any) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  // Edit user
  const handleEditUser = async (userId: string) => {
    const user = await getUser(userId);
    if (user) {
      setSelectedUser(user);
      editForm.setFieldsValue({
        name: user.name,
        phone_number: user.phone_number,
        email: user.email,
        gender: user.gender,
      });
      setIsEditOpen(true);
    }
  };

  // Submit edit form
  const handleEditSubmit = async () => {
    try {
      const values = await editForm.validateFields();
      if (selectedUser?.id) {
        await updateUser(selectedUser.id, values);
        setIsEditOpen(false);
        getUsers(); // Refresh the list after update
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // Submit create form
  const handleCreateSubmit = async () => {
    try {
      const values = await createForm.validateFields();
      await createUser(values);
      setIsCreateOpen(false);
      createForm.resetFields();
      getUsers(); // Refresh the list after creation
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // Delete selected users
  const handleDeleteSelected = async () => {
    if (selectedRowKeys.length > 0) {
      const success = await deleteUsers(selectedRowKeys as string[]);
      if (success) {
        setSelectedRowKeys([]);
        getUsers(); // Refresh the list after deletion
      }
    }
  };

  // Delete a single user
  const handleDeleteUser = async (userId: string) => {
    const success = await deleteUsers([userId]);
    if (success) {
      getUsers(); // Refresh the list after deletion
    }
  };

  // Search users
  const handleSearch = async () => {
    const values = await searchForm.validateFields();
    await getUsers(values);
    setIsSearchOpen(false);
  };

  const columns: ColumnsType<User> = [
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    //   key: 'id',
    //   width: 80,
    // },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
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
            gender?.toLowerCase() === 'female'
              ? 'text-red-500 bg-red-50'
              : 'text-blue-500 bg-blue-50'
          }`}>
          {gender || 'N/A'}
        </span>
      ),
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone_number',
      key: 'phone_number',
      width: 150,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
    },
    {
      title: 'Created',
      dataIndex: 'created',
      key: 'created',
      width: 170,
      render: (created: string) => new Date(created).toLocaleString(),
    },
    {
      title: 'Updated',
      dataIndex: 'updated',
      key: 'updated',
      width: 170,
      render: (updated: string) => new Date(updated).toLocaleString(),
    },
    {
      title: 'Operate',
      key: 'operate',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record.id)}>
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteUser(record.id)}>
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
          form={searchForm}
          layout="vertical">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Form.Item
              name="name"
              label="Name">
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
              name="phone_number"
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
          </div>

          <div className="flex justify-end gap-2">
            <Button
              icon={<ReloadOutlined />}
              onClick={() => searchForm.resetFields()}>
              Reset
            </Button>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}>
              Search
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        title="Edit User"
        open={isEditOpen}
        onCancel={() => setIsEditOpen(false)}
        onOk={handleEditSubmit}
        confirmLoading={loading}>
        <Form
          form={editForm}
          layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter user name' }]}>
            <Input placeholder="Enter user name" />
          </Form.Item>

          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: 'Please select gender' }]}>
            <Select
              placeholder="Select gender"
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="phone_number"
            label="Phone Number"
            rules={[{ required: true, message: 'Please enter phone number' }]}>
            <Input placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}>
            <Input placeholder="Enter email" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Create User Modal */}
      <Modal
        title="Create User"
        open={isCreateOpen}
        onCancel={() => setIsCreateOpen(false)}
        onOk={handleCreateSubmit}
        confirmLoading={loading}>
        <Form
          form={createForm}
          layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter user name' }]}>
            <Input placeholder="Enter user name" />
          </Form.Item>

          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: 'Please select gender' }]}>
            <Select
              placeholder="Select gender"
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="phone_number"
            label="Phone Number"
            rules={[{ required: true, message: 'Please enter phone number' }]}>
            <Input placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}>
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please enter password' }]}>
            <Input.Password placeholder="Enter password" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Table */}
      <div className="bg-white shadow-sm rounded-lg p-4">
        <div className="flex justify-between items-center pb-4">
          <span className="text-lg font-medium">User List</span>
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsCreateOpen(true)}>
              Add
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => getUsers()}>
              Refresh
            </Button>
            <Button
              icon={<DeleteOutlined />}
              danger
              disabled={selectedRowKeys.length === 0}
              onClick={handleDeleteSelected}>
              Delete Selected
            </Button>
            <Button
              icon={<SearchOutlined />}
              onClick={() => setIsSearchOpen(true)}
            />
          </Space>
        </div>
        <Table
          rowKey="id"
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          loading={loading}
          size="small"
          columns={columns}
          dataSource={users}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 'max-content', y: 'calc(100vh - 18rem)' }}
        />
      </div>
    </div>
  );
};

export default UserManagement;
