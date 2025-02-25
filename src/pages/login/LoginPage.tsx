import { useAuth } from '@/hooks/useAuth';
import { useTenant } from '@/hooks/useTenant';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Space, Typography } from 'antd';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const { Text } = Typography;

const LoginPage: React.FC = () => {
  const { config } = useTenant();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const success = await login(values.username, values.password);
      if (success) {
        navigate(from, { replace: true });
      } else {
        // Using more styled notification
        const antdMessage = await import('antd').then((mod) => mod.message);
        antdMessage.error({
          content: 'Invalid username or password',
          style: { borderRadius: '8px' },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white p-4">
      {/* Background Design Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30">
        <div className="absolute w-96 h-96 rounded-full bg-blue-400 blur-3xl -top-20 -left-20"></div>
        <div className="absolute w-96 h-96 rounded-full bg-indigo-400 blur-3xl top-1/2 right-0"></div>
        <div className="absolute w-80 h-80 rounded-full bg-purple-400 blur-3xl bottom-0 left-1/3"></div>
      </div>

      <Card
        className="w-full max-w-md relative z-10 shadow-2xl rounded-2xl overflow-hidden border-0"
        style={{ padding: 0 }}>
        {/* Top color bar */}
        <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

        <div className="p-8">
          {/* Logo placeholder */}
          <div className="flex justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                {config ? config?.tenant?.name : 'Nexora'}
              </h1>
            </div>
          </div>

          <div className="text-center mb-8">
            <Text
              type="secondary"
              className="text-gray-500">
              Login to your visitor management account
            </Text>
          </div>

          <Form
            name="login"
            layout="vertical"
            initialValues={{ username: '', password: '' }}
            onFinish={onFinish}
            autoComplete="off"
            size="large">
            <Form.Item
              label={
                <span className="text-gray-700 font-medium">Username</span>
              }
              name="username"
              rules={[
                { required: true, message: 'Please enter your username' },
              ]}>
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Enter your username"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="text-gray-700 font-medium">Password</span>
              }
              name="password"
              rules={[
                { required: true, message: 'Please enter your password' },
              ]}>
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Enter your password"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className="h-12 rounded-lg font-medium text-base bg-gradient-to-r from-blue-500 to-indigo-600 border-0 shadow-md hover:shadow-lg transition-all">
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mt-4">
            <Space
              direction="vertical"
              size="small">
              <Text
                type="secondary"
                className="text-gray-500 text-sm">
                Forgot your password?{' '}
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-800 font-medium">
                  Reset here
                </a>
              </Text>
            </Space>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
