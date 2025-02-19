/* eslint-disable @typescript-eslint/no-explicit-any */

// VisitorsPage.tsx
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
  message,
} from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import {
  generateMockVisitors,
  mockHosts,
  mockOffices,
  Visitor,
} from './mock-data';

const { Option } = Select;

const VisitorsPage: React.FC = () => {
  const mockVisitors: Visitor[] = generateMockVisitors(50);
  const [visitors, setVisitors] = useState<Visitor[]>(mockVisitors);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    office: null,
    department: null,
    host: null,
  });

  // Filter handlers
  const handleFilterChange = (type: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const filteredVisitors = visitors.filter((visitor) => {
    return (
      (!filters.office || visitor.officeId === filters.office) &&
      (!filters.department || visitor.departmentId === filters.department) &&
      (!filters.host || visitor.hostId === filters.host)
    );
  });

  // CRUD Operations
  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: Visitor) => {
    setEditingId(record.id);
    form.setFieldsValue({
      ...record,
      checkIn: record.checkIn ? dayjs(record.checkIn) : null,
      checkOut: record.checkOut ? dayjs(record.checkOut) : null,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this visitor?',
      content: 'This action cannot be undone.',
      okButtonProps: { style: { backgroundColor: '#646CFF' } },
      onOk: () => {
        setVisitors((prev) => prev.filter((visitor) => visitor.id !== id));
        message.success('Visitor deleted successfully');
      },
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      const newVisitor: Visitor = {
        ...values,
        id: editingId || visitors.length + 1,
        checkIn: values.checkIn.toDate(),
        checkOut: values.checkOut?.toDate() || null,
      };

      if (editingId) {
        setVisitors((prev) =>
          prev.map((visitor) =>
            visitor.id === editingId ? newVisitor : visitor
          )
        );
        message.success('Visitor updated successfully');
      } else {
        setVisitors((prev) => [...prev, newVisitor]);
        message.success('Visitor added successfully');
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('An error occurred');
      console.error(error);
    }
  };

  const columns: TableProps<Visitor>['columns'] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Office',
      dataIndex: 'officeId',
      key: 'office',
      render: (officeId) => mockOffices.find((o) => o.id === officeId)?.name,
    },
    {
      title: 'Department',
      dataIndex: 'departmentId',
      key: 'department',
      render: (deptId) => {
        const dept = mockOffices
          .flatMap((o) => o.departments)
          .find((d) => d.id === deptId);
        return dept?.name;
      },
    },
    {
      title: 'Host',
      dataIndex: 'hostId',
      key: 'host',
      render: (hostId) => mockHosts.find((h) => h.id === hostId)?.name,
    },
    {
      title: 'Check In',
      dataIndex: 'checkIn',
      key: 'checkIn',
      render: (date) => new Date(date).toLocaleString(),
      sorter: (a, b) => a.checkIn.getTime() - b.checkIn.getTime(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span
          className={`px-2 py-1 rounded ${
            status === 'active'
              ? 'bg-green-100 text-green-800'
              : status === 'completed'
              ? 'bg-gray-100 text-gray-800'
              : 'bg-red-100 text-red-800'
          }`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            className="text-red-600 hover:text-red-800"
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-2 max-h-[calc(100vh-5.5rem)] overflow-y-hidden">
      <Card
        className=""
        size="small">
        <Row
          gutter={16}
          className="">
          <Col span={8}>
            <Select
              placeholder="Select Office"
              className="w-full"
              onChange={(value) => handleFilterChange('office', value)}
              allowClear>
              {mockOffices.map((office) => (
                <Option
                  key={office.id}
                  value={office.id}>
                  {office.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={8}>
            <Select
              placeholder="Select Department"
              className="w-full"
              onChange={(value) => handleFilterChange('department', value)}
              allowClear>
              {mockOffices
                .flatMap((o) => o.departments)
                .map((dept) => (
                  <Option
                    key={dept.id}
                    value={dept.id}>
                    {dept.name}
                  </Option>
                ))}
            </Select>
          </Col>
          <Col span={8}>
            <Select
              placeholder="Select Host"
              className="w-full"
              onChange={(value) => handleFilterChange('host', value)}
              allowClear>
              {mockHosts.map((host) => (
                <Option
                  key={host.id}
                  value={host.id}>
                  {host.name}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>

      <Card
        className="shadow-sm"
        title={
          <Flex
            align="center"
            justify="space-between">
            <div>All Visitors</div>
            <>
              <Button
                type="primary"
                style={{ maxHeight: '32px' }}
                onClick={handleAdd}>
                Add Visitor
              </Button>
            </>
          </Flex>
        }>
        <Table
          columns={columns}
          dataSource={filteredVisitors}
          rowKey="id"
          scroll={{ x: 'max-content', y: 'calc(100vh - 20rem)' }}
          size="small"
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} appointments`,
          }}
          className="w-full"
        />
      </Card>
      <Modal
        title={`${editingId ? 'Edit' : 'Add'} Visitor`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input visitor name!' }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input visitor email!' },
              { type: 'email', message: 'Please input a valid email!' },
            ]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              { required: true, message: 'Please input visitor phone!' },
            ]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="purpose"
            label="Purpose"
            rules={[
              { required: true, message: 'Please input visit purpose!' },
            ]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="officeId"
            label="Office"
            rules={[{ required: true, message: 'Please select an office!' }]}>
            <Select>
              {mockOffices.map((office) => (
                <Option
                  key={office.id}
                  value={office.id}>
                  {office.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="departmentId"
            label="Department"
            rules={[
              { required: true, message: 'Please select a department!' },
            ]}>
            <Select>
              {mockOffices
                .flatMap((o) => o.departments)
                .map((dept) => (
                  <Option
                    key={dept.id}
                    value={dept.id}>
                    {dept.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="hostId"
            label="Host"
            rules={[{ required: true, message: 'Please select a host!' }]}>
            <Select>
              {mockHosts.map((host) => (
                <Option
                  key={host.id}
                  value={host.id}>
                  {host.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="idType"
            label="ID Type"
            rules={[{ required: true, message: 'Please select ID type!' }]}>
            <Select>
              <Option value="passport">Passport</Option>
              <Option value="national_id">National ID</Option>
              <Option value="drivers_license">Driver's License</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="idNumber"
            label="ID Number"
            rules={[{ required: true, message: 'Please input ID number!' }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="checkIn"
            label="Check In"
            rules={[
              { required: true, message: 'Please select check-in time!' },
            ]}>
            <DatePicker
              showTime
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            name="checkOut"
            label="Check Out">
            <DatePicker
              showTime
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            initialValue="active">
            <Select>
              <Option value="active">Active</Option>
              <Option value="completed">Completed</Option>
              <Option value="cancelled">Cancelled</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <div className="flex justify-end gap-4">
              <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                className="bg-[#646CFF]">
                {editingId ? 'Update' : 'Add'} Visitor
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VisitorsPage;
