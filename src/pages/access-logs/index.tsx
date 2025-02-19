/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Card,
  DatePicker,
  Divider,
  Drawer,
  Image,
  Input,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import { Building, Camera, Search, User } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { mockVisitorData } from './mock-data';

interface VisitorRecord {
  id: string;
  name: string;
  imageUrl: string;
  registrationImage: string;
  company: string;
  status: 'entering' | 'exiting' | 'suspicious';
  captureTime: string;
  checkInTime?: string;
  checkOutTime?: string;
  office: string;
  purpose: string;
  hostName: string;
  idNumber: string;
  contactNumber: string;
  temperature?: number;
  accessLevel: 'guest' | 'contractor' | 'employee' | 'vip';
  cameraLocation: string;
  notes?: string;
}

interface FilterState {
  search: string;
  office: string | null;
  company: string | null;
  dateRange: any;
  status: string | null;
  accessLevel: string | null;
}

// Extract unique offices and companies from mock data
const officesOptions = Array.from(
  new Set(mockVisitorData.map((record) => record.office))
).map((office) => ({ value: office, label: office }));

const companiesOptions = Array.from(
  new Set(mockVisitorData.map((record) => record.company))
).map((company) => ({ value: company, label: company }));

const AccessLogsPage: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    office: null,
    company: null,
    dateRange: null,
    status: null,
    accessLevel: null,
  });
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<VisitorRecord | null>(
    null
  );

  const getStatusColor = (status: VisitorRecord['status']): string => {
    const colors = {
      entering: 'green',
      exiting: 'blue',
      suspicious: 'red',
    };
    return colors[status];
  };

  const columns = useMemo(
    () => [
      {
        title: 'Visitor',
        dataIndex: 'name',
        key: 'name',
        render: (text: string, record: VisitorRecord) => (
          <div className="flex items-center space-x-3">
            <div>
              <div className="font-medium text-gray-900">{text}</div>
              <div className=" text-gray-500 flex items-center gap-1">
                <User className="w-3 h-3" />
                {record.idNumber}
              </div>
            </div>
          </div>
        ),
      },
      {
        title: 'Organization',
        dataIndex: 'company',
        key: 'company',
        render: (text: string) => (
          <div>
            <Tag color="purple">
              <div className="flex items-center gap-1">
                <Building className="w-3 h-3" />
                {text}
              </div>
            </Tag>
          </div>
        ),
      },
      {
        title: 'Image capture',
        dataIndex: 'image',
        key: 'images',
        render: (text: string, record: VisitorRecord) => (
          <div>
            <Image
              src={record.imageUrl}
              alt={text}
              height={40}
              width={40}
              className="rounded-lg object-cover border-2 border-gray-100"
            />
          </div>
        ),
      },
      {
        title: 'Capture Time',
        dataIndex: 'captureTime',
        key: 'captureTime',
        render: (text: string) => (
          <div className="flex flex-col">
            <span className="font-medium">
              {new Date(text).toLocaleTimeString()}
            </span>
            <span className=" text-gray-500">
              {new Date(text).toLocaleDateString()}
            </span>
          </div>
        ),
      },
      {
        title: 'Destination Office',
        dataIndex: 'office',
        key: 'office',
        render: (text: string) => (
          <Tag
            color="blue"
            className="">
            <div className="flex items-center gap-1">
              <Building className="w-3 h-3" />
              {text}
            </div>
          </Tag>
        ),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status: VisitorRecord['status']) => (
          <Tag
            color={getStatusColor(status)}
            className="uppercase">
            {status}
          </Tag>
        ),
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_: any, record: VisitorRecord) => (
          <Space>
            <Button
              type="link"
              onClick={() => showDrawer(record)}
              className="flex items-center gap-1">
              View Details
            </Button>
          </Space>
        ),
      },
    ],
    []
  );

  const showDrawer = (record: VisitorRecord) => {
    setSelectedRecord(record);
    setDrawerVisible(true);
  };

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredData = useMemo(() => {
    return mockVisitorData.filter((record) => {
      if (
        filters.search &&
        !record.name.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      if (filters.office && record.office !== filters.office) {
        return false;
      }
      if (filters.company && record.company !== filters.company) {
        return false;
      }
      if (filters.status && record.status !== filters.status) {
        return false;
      }
      if (filters.accessLevel && record.accessLevel !== filters.accessLevel) {
        return false;
      }
      // Add date range filter logic
      return true;
    });
  }, [filters]);

  return (
    <div className="grid grid-cols-1 gap-2 max-h-[calc(100vh-5.5rem)] overflow-y-hidden">
      <Card
        size="small"
        className="shadow-sm"
        title="Filters">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            prefix={<Search className="w-4 h-4 text-gray-400" />}
            placeholder="Search visitor or ID"
            value={filters.search}
            onChange={(e: any) => handleFilterChange('search', e.target.value)}
            className="w-full"
          />

          <Select
            allowClear
            placeholder="Select Office"
            className="w-full"
            value={filters.office}
            onChange={(value: any) => handleFilterChange('office', value)}
            options={officesOptions}
          />

          <Select
            allowClear
            placeholder="Organization Type"
            className="w-full"
            value={filters.company}
            onChange={(value: any) => handleFilterChange('company', value)}
            options={companiesOptions}
          />

          <DatePicker.RangePicker
            className="w-full"
            onChange={(value: any) => handleFilterChange('dateRange', value)}
          />
        </div>
      </Card>

      <Card
        size="small"
        className="shadow-sm">
        <Table
          columns={columns}
          dataSource={filteredData}
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

      <Drawer
        title={
          <div className="flex items-center gap-3">
            <Camera className="w-5 h-5 text-blue-500" />
            <span>Visitor Details</span>
          </div>
        }
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={480}>
        {selectedRecord && (
          <div className="space-y-6">
            <div className="flex items-center gap-6 p-4 bg-white shadow-md rounded-lg">
              <div className="flex-1">
                <Typography.Title
                  level={4}
                  className="text-gray-900">
                  {selectedRecord.name}
                </Typography.Title>
                <p className="text-gray-500 ">{selectedRecord.company}</p>
              </div>
              <div className="flex flex-col items-center">
                <Image
                  height={90}
                  width={90}
                  src={selectedRecord.registrationImage}
                  alt="Registration Photo"
                  className="rounded-lg object-cover shadow-sm border"
                />
                <p className=" text-gray-500 mt-2">Registration Photo</p>
              </div>
            </div>

            <Divider />

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className=" text-gray-500">Capture Time</label>
                  <p className="font-medium">
                    {new Date(selectedRecord.captureTime).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className=" text-gray-500">Temperature</label>
                  <p className="font-medium">{selectedRecord.temperature}°C</p>
                </div>
              </div>

              <div>
                <label className=" text-gray-500">Camera Location</label>
                <p className="font-medium">{selectedRecord.cameraLocation}</p>
              </div>

              <div>
                <label className=" text-gray-500">Destination Office</label>
                <p className="font-medium">{selectedRecord.office}</p>
              </div>

              <div>
                <label className=" text-gray-500">Purpose</label>
                <p className="font-medium">{selectedRecord.purpose}</p>
              </div>

              <div>
                <label className=" text-gray-500">Host</label>
                <p className="font-medium">{selectedRecord.hostName}</p>
              </div>

              <div>
                <label className=" text-gray-500">Contact</label>
                <p className="font-medium">{selectedRecord.contactNumber}</p>
              </div>

              {selectedRecord.notes && (
                <div>
                  <label className=" text-gray-500">Notes</label>
                  <p className="font-medium">{selectedRecord.notes}</p>
                </div>
              )}
            </div>

            <Divider />
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default AccessLogsPage;
