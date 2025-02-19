/* eslint-disable @typescript-eslint/no-explicit-any */

import { EyeOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import { Button, Card, Col, Flex, Row, Select, Space, Table } from 'antd';
import React, { useState } from 'react';
import {
  generateMockVisitors,
  mockHosts,
  mockOffices,
  Visitor,
} from './mock-data';

const { Option } = Select;

const AllVisitorsPage: React.FC = () => {
  const mockVisitors: Visitor[] = generateMockVisitors(50);

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

  const filteredVisitors = mockVisitors.filter((visitor) => {
    return (
      (!filters.office || visitor.officeId === filters.office) &&
      (!filters.department || visitor.departmentId === filters.department) &&
      (!filters.host || visitor.hostId === filters.host)
    );
  });

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
      render: () => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
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
            <></>
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
    </div>
  );
};

export default AllVisitorsPage;
