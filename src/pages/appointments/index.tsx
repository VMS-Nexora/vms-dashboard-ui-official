/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/AppointmentsPage.tsx
import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  DatePicker,
  Modal,
  Form,
  Select,
  Popconfirm,
  message,
  Card,
  Space,
  Badge,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { Appointment, Guest } from './types';
import {
  createAppointment,
  deleteAppointment,
  fetchAppointments,
  fetchGuests,
  updateAppointment,
} from './mock-apis';
import { InviteModal } from './items';

const { RangePicker } = DatePicker;
const { Option } = Select;

const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null]
  >([null, null]);

  useEffect(() => {
    fetchData();
    loadGuests();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchAppointments();
      setAppointments(data);
    } catch (error) {
      message.error('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const loadGuests = async () => {
    try {
      const data = await fetchGuests();
      setGuests(data);
    } catch (error) {
      message.error('Failed to fetch guests');
    }
  };

  const handleAdd = () => {
    form.resetFields();
    setEditingId(null);
    setModalVisible(true);
  };

  const handleEdit = (record: Appointment) => {
    form.setFieldsValue({
      ...record,
      guestId: record.guest?.id,
      date: dayjs(record.date),
      time: dayjs(record.time, 'HH:mm'),
    });
    setEditingId(record.id);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAppointment(id);
      message.success('Appointment deleted successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to delete appointment');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
        time: values.time.format('HH:mm'),
      };

      if (editingId) {
        await updateAppointment(editingId, formattedValues);
        message.success('Appointment updated successfully');
      } else {
        await createAppointment(formattedValues);
        message.success('Appointment created successfully');
      }

      setModalVisible(false);
      fetchData();
    } catch (error) {
      message.error('Form submission failed');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, any> = {
      scheduled: { status: 'processing', text: 'Scheduled' },
      completed: { status: 'success', text: 'Completed' },
      cancelled: { status: 'error', text: 'Cancelled' },
      noshow: { status: 'default', text: 'No Show' },
    };

    const config = statusMap[status] || statusMap.scheduled;
    return (
      <Badge
        status={config.status}
        text={config.text}
      />
    );
  };

  const columns = [
    {
      title: 'Guest Name',
      dataIndex: ['guest', 'name'],
      key: 'guestName',
      render: (text: string, record: Appointment) => (
        <span className="font-medium">{record.guest?.name || 'N/A'}</span>
      ),
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value: string | number | boolean, record: Appointment) =>
        record.guest?.name
          .toLowerCase()
          .includes(String(value).toLowerCase()) ||
        record.purpose.toLowerCase().includes(String(value).toLowerCase()),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD'),
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Purpose',
      dataIndex: 'purpose',
      key: 'purpose',
      responsive: ['md'],
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusBadge(status),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Appointment) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            type="text"
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this appointment?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No">
            <Button
              icon={<DeleteOutlined />}
              type="text"
              danger
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleDateRangeChange = (dates: any) => {
    setDateRange(dates);
  };

  const filteredAppointments = appointments.filter((app) => {
    if (dateRange[0] && dateRange[1]) {
      const appDate = dayjs(app.date);
      return appDate.isAfter(dateRange[0]) && appDate.isBefore(dateRange[1]);
    }
    return true;
  });

  return (
    <div>
      <Card
        className="shadow-sm"
        title={
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div className="flex items-center">
              <h1 className="text-xl font-bold mr-4 flex items-center">
                <CalendarOutlined className="mr-2" />
                Appointments
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full lg:w-auto gap-2">
              <Input
                placeholder="Search guest or purpose"
                onChange={(e) => handleSearch(e.target.value)}
                prefix={<SearchOutlined />}
                className="w-full sm:w-60"
              />
              <RangePicker
                onChange={handleDateRangeChange}
                className="w-full sm:w-auto"
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
                className="w-full sm:w-auto">
                Invite
              </Button>
            </div>
          </div>
        }>
        <Table
          columns={columns as any}
          dataSource={filteredAppointments}
          rowKey="id"
          size="small"
          loading={loading}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} appointments`,
          }}
          scroll={{ x: 'max-content', y: 'calc(100vh - 18rem)' }}
        />
      </Card>

      <InviteModal
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
        }}
      />
    </div>
  );
};

export default AppointmentsPage;
