'use client';

import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Alert,
  Space,
  Divider,
  Tag,
  message
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MedicineBoxOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone
} from '@ant-design/icons';
import { useAuth } from '@/lib/context/AuthContext';

const { Title, Text } = Typography;

interface LoginFormData {
  username: string;
  password: string;
}

// Demo credentials for easy testing
const demoCredentials = [
  { username: 'admin', password: 'admin123', role: 'Administrator', color: 'red' },
  { username: 'dr.sarah', password: 'doctor123', role: 'Doctor', color: 'blue' },
  { username: 'nurse.mary', password: 'nurse123', role: 'Nurse', color: 'green' },
  { username: 'reception', password: 'reception123', role: 'Receptionist', color: 'orange' },
  { username: 'pharmacist', password: 'pharmacy123', role: 'Pharmacist', color: 'purple' },
  { username: 'cashier', password: 'cashier123', role: 'Cashier', color: 'cyan' }
];

export default function LoginForm() {
  const [form] = Form.useForm();
  const { login, isLoading } = useAuth();
  const [error, setError] = useState<string>('');

  const handleLogin = async (values: LoginFormData) => {
    setError('');
    try {
      const success = await login(values.username, values.password);
      if (!success) {
        setError('Invalid username or password. Please try again.');
      } else {
        message.success('Login successful!');
      }
    } catch {
      setError('An error occurred during login. Please try again.');
    }
  };

  const handleDemoLogin = (username: string, password: string) => {
    form.setFieldsValue({ username, password });
    handleLogin({ username, password });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: '500px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          borderRadius: '12px'
        }}
        styles={{ body: { padding: '40px' } }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <MedicineBoxOutlined style={{ 
            fontSize: '48px', 
            color: '#0066cc', 
            marginBottom: '16px' 
          }} />
          <Title level={2} style={{ margin: 0, color: '#262626' }}>
            City General Hospital
          </Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            Integrated Hospital Management System
          </Text>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert
            message="Login Failed"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: '24px' }}
          />
        )}

        {/* Login Form */}
        <Form
          form={form}
          name="login"
          onFinish={handleLogin}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter your username"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your password"
              size="large"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              size="large"
              style={{
                width: '100%',
                height: '48px',
                fontSize: '16px',
                background: '#0066cc',
                borderColor: '#0066cc'
              }}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </Form.Item>
        </Form>

        <Divider>
          <Text type="secondary">Demo Accounts</Text>
        </Divider>

        {/* Demo Credentials */}
        <Space direction="vertical" style={{ width: '100%' }} size="small">
          <Text type="secondary" style={{ fontSize: '12px', textAlign: 'center', display: 'block' }}>
            Click on any role below to auto-fill credentials:
          </Text>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
            {demoCredentials.map((cred) => (
              <Tag
                key={cred.username}
                color={cred.color}
                style={{ 
                  cursor: 'pointer', 
                  padding: '4px 8px',
                  fontSize: '12px'
                }}
                onClick={() => handleDemoLogin(cred.username, cred.password)}
              >
                {cred.role}
              </Tag>
            ))}
          </div>
        </Space>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            HMS v2.0 • Secure & Compliant • © 2025 City General Hospital
          </Text>
        </div>
      </Card>
    </div>
  );
}