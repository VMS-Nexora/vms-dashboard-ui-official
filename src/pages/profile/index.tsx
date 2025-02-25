/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  Descriptions,
  Divider,
  Form,
  Input,
  List,
  Modal,
  Progress,
  Statistic,
  Tabs,
  Timeline,
  message,
} from 'antd';
import {
  CheckCircleOutlined,
  FileDoneOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { TabPane } = Tabs;

// Sample user data
const initialUserData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'Administrator',
  phone: '+1 (123) 456-7890',
  avatar: '', // URL or base64 string for avatar
  bio: 'Passionate about creating seamless visitor experiences and efficient management systems.',
  authorities: [
    { key: 'manageVisitors', label: 'Manage Visitors', level: 90 },
    { key: 'approveRequests', label: 'Approve Requests', level: 80 },
    { key: 'accessReports', label: 'Access Reports', level: 70 },
    { key: 'manageSettings', label: 'Manage Settings', level: 85 },
  ],
  activity: [
    { time: '2025-02-20 09:00', event: 'Logged in' },
    { time: '2025-02-20 09:15', event: 'Approved visitor entry' },
    { time: '2025-02-20 10:00', event: 'Updated settings' },
    { time: '2025-02-20 10:30', event: 'Generated monthly report' },
  ],
  stats: {
    visitorsManaged: 124,
    approvals: 98,
    reportsGenerated: 35,
  },
};

const ProfilePage: React.FC = () => {
  const [userData, setUserData] = useState(initialUserData);
  const [pwdModalVisible, setPwdModalVisible] = useState(false);

  // Handler for updating profile information
  const onProfileFinish = (values: any) => {
    setUserData((prev) => ({ ...prev, ...values }));
    message.success('Profile updated successfully!');
  };

  // Handler for password change
  const onPasswordFinish = (values: any) => {
    message.success('Password changed successfully!');
    setPwdModalVisible(false);
  };

  return (
    <div className="h-[80vh] flex flex-col">
      {/* Main container: two columns */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Column: Profile Summary */}
        <div className="w-full md:w-1/3 p-4 overflow-y-auto">
          <Card
            className="h-full"
            bodyStyle={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}>
            <div className="flex justify-center mb-4">
              <Avatar
                size={100}
                icon={<UserOutlined />}
                src={userData.avatar || undefined}
              />
            </div>
            <Divider
              orientation="center"
              className="m-0">
              General Information
            </Divider>
            <div className="flex-1 mt-4 overflow-y-auto">
              <Descriptions
                column={1}
                size="small"
                bordered>
                <Descriptions.Item label="Name">
                  {userData.name}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {userData.email}
                </Descriptions.Item>
                <Descriptions.Item label="Role">
                  {userData.role}
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  {userData.phone}
                </Descriptions.Item>
              </Descriptions>
            </div>
            <Divider className="my-4" />
            <p className="text-center italic">{userData.bio}</p>
            <Button
              type="primary"
              className="mt-4"
              block
              onClick={() => setPwdModalVisible(true)}>
              Change Password
            </Button>
          </Card>
        </div>

        {/* Right Column: Tabs for Authorities, Statistics, Activity, and Edit Profile */}
        <div className="w-full md:w-2/3 p-4 overflow-y-auto">
          <Card
            className="h-full"
            style={{ height: '100%', padding: 0 }}>
            <Tabs
              defaultActiveKey="1"
              className="h-full">
              <TabPane
                tab="Authorities"
                key="1"
                className="h-full">
                <div className="h-full overflow-y-auto p-4">
                  <List
                    itemLayout="horizontal"
                    dataSource={userData.authorities}
                    renderItem={(auth) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <SettingOutlined
                              style={{ fontSize: '24px', color: '#1890ff' }}
                            />
                          }
                          title={auth.label}
                          description={
                            <div className="flex items-center">
                              <span className="mr-2">Competency:</span>
                              <Progress
                                percent={auth.level}
                                size="small"
                                status="active"
                                className="flex-1"
                              />
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </div>
              </TabPane>
              <TabPane
                tab="Statistics"
                key="2"
                className="h-full">
                <div className="p-4 h-full overflow-y-auto">
                  <div className="flex flex-wrap -mx-2">
                    <div className="w-full sm:w-1/3 px-2 mb-4">
                      <Card className="text-center h-full">
                        <Statistic
                          title="Visitors Managed"
                          value={userData.stats.visitorsManaged}
                          prefix={<FileDoneOutlined />}
                        />
                      </Card>
                    </div>
                    <div className="w-full sm:w-1/3 px-2 mb-4">
                      <Card className="text-center h-full">
                        <Statistic
                          title="Approvals"
                          value={userData.stats.approvals}
                          prefix={<CheckCircleOutlined />}
                        />
                      </Card>
                    </div>
                    <div className="w-full sm:w-1/3 px-2 mb-4">
                      <Card className="text-center h-full">
                        <Statistic
                          title="Reports Generated"
                          value={userData.stats.reportsGenerated}
                          prefix={<FileDoneOutlined />}
                        />
                      </Card>
                    </div>
                  </div>
                </div>
              </TabPane>
              <TabPane
                tab="Recent Activity"
                key="3"
                className="h-full">
                <div className="p-4 h-full overflow-y-auto">
                  <Timeline>
                    {userData.activity.map((act, index) => (
                      <Timeline.Item key={index}>
                        <strong>{act.event}</strong>
                        <br />
                        <small>{act.time}</small>
                      </Timeline.Item>
                    ))}
                  </Timeline>
                </div>
              </TabPane>
              <TabPane
                tab="Edit Profile"
                key="4"
                className="h-full overflow-y-auto">
                <div className="p-4">
                  <Card
                    title="Update Profile Information"
                    bordered={false}>
                    <Form
                      layout="vertical"
                      initialValues={{
                        name: userData.name,
                        email: userData.email,
                        phone: userData.phone,
                        bio: userData.bio,
                      }}
                      onFinish={onProfileFinish}>
                      <Form.Item
                        label="Name"
                        name="name"
                        rules={[
                          {
                            required: true,
                            message: 'Please input your name!',
                          },
                        ]}>
                        <Input />
                      </Form.Item>
                      <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                          {
                            required: true,
                            type: 'email',
                            message: 'Please input a valid email!',
                          },
                        ]}>
                        <Input />
                      </Form.Item>
                      <Form.Item
                        label="Phone"
                        name="phone">
                        <Input />
                      </Form.Item>
                      <Form.Item
                        label="Bio"
                        name="bio">
                        <Input.TextArea rows={3} />
                      </Form.Item>
                      <Form.Item>
                        <Button
                          type="primary"
                          htmlType="submit"
                          block>
                          Update Profile
                        </Button>
                      </Form.Item>
                    </Form>
                  </Card>
                </div>
              </TabPane>
            </Tabs>
          </Card>
        </div>
      </div>

      {/* Change Password Modal */}
      <Modal
        title="Change Password"
        visible={pwdModalVisible}
        onCancel={() => setPwdModalVisible(false)}
        footer={null}
        destroyOnClose>
        <Form
          layout="vertical"
          onFinish={onPasswordFinish}>
          <Form.Item
            label="Current Password"
            name="currentPassword"
            rules={[
              {
                required: true,
                message: 'Please input your current password!',
              },
            ]}>
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              { required: true, message: 'Please input your new password!' },
            ]}>
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Confirm New Password"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Please confirm your new password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('The two passwords do not match!')
                  );
                },
              }),
            ]}>
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block>
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfilePage;
