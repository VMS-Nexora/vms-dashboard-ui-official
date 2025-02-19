/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Button, Checkbox, DatePicker, Form, Input, Modal, Select } from 'antd';

interface InviteModalProps {
  open: boolean;
  onCancel: () => void;
  onOk?: (values: any) => void;
}

const buildings = [
  { value: 'building1', label: 'Building 1' },
  { value: 'building2', label: 'Building 2' },
  { value: 'building3', label: 'Building 3' },
];

const floors = [
  { value: 'floor1', label: 'Floor 1' },
  { value: 'floor2', label: 'Floor 2' },
  { value: 'floor3', label: 'Floor 3' },
];

const meetingRooms = [
  { value: 'room1', label: 'Meeting Room 1' },
  { value: 'room2', label: 'Meeting Room 2' },
  { value: 'room3', label: 'Meeting Room 3' },
];

const hosts = [
  { value: 'host1', label: 'John Doe' },
  { value: 'host2', label: 'Jane Smith' },
  { value: 'host3', label: 'Alice Johnson' },
];

const typeMeeting = [
  { value: 'Contractor', label: 'Contractor' },
  { value: 'Job candidate', label: 'Job candidate' },
  { value: 'Intern', label: 'Intern' },
];

export function InviteModal({ open, onCancel }: InviteModalProps) {
  const [form] = Form.useForm();

  return (
    <Modal
      title="Create Invitation"
      open={open}
      onCancel={onCancel}
      centered
      footer={[
        <Button
          key="cancel"
          onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="ok"
          type="primary"
          onClick={form.submit}>
          OK
        </Button>,
      ]}
      width={700} // Increased width for better desktop layout
    >
      <Form
        form={form}
        layout="vertical">
        <Form.Item
          label="Subject"
          name="subject"
          rules={[{ required: true, message: 'Please input the subject' }]}>
          <Input placeholder="Meeting" />
        </Form.Item>

        <Form.Item
          label="Time"
          name="time"
          rules={[{ required: true, message: 'Please input the time' }]}>
          <DatePicker.RangePicker
            className="w-full"
            showTime={{ format: 'HH:mm' }}
            format="DD-MM-YYYY HH:mm"
          />
        </Form.Item>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input name' }]}>
            <Input placeholder="Input name" />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[{ required: true, message: 'Please input phone number' }]}>
            <Input placeholder="099898123" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="guess@gmail.com" />
          </Form.Item>

          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: 'Please select type' }]}>
            <Select options={typeMeeting} />
          </Form.Item>
        </div>

        <Form.Item>
          <Checkbox>Send invitation via Email</Checkbox>
        </Form.Item>

        {/* Grid for Location Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="Building"
            name="building"
            rules={[{ required: true, message: 'Please select a building' }]}>
            <Select options={buildings} />
          </Form.Item>

          <Form.Item
            label="Floor"
            name="floor">
            <Select options={floors} />
          </Form.Item>

          <Form.Item
            label="Meeting Room"
            name="meetingRoom">
            <Select options={meetingRooms} />
          </Form.Item>

          <Form.Item
            label="Host"
            required
            rules={[{ required: true, message: 'Please select host' }]}
            name="host">
            <Select options={hosts} />
          </Form.Item>
        </div>

        <Form.Item>
          <Checkbox>Send notification when visitors check-in</Checkbox>
        </Form.Item>

        {/* Single Full-Width Remark Input */}
        <Form.Item
          label="Remark"
          name="remark">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
