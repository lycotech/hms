'use client';

import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Table,
  Tag,
  Button,
  Space,
  Statistic,
  Typography,
  Divider,
  Progress,
  List,
  Avatar,
  Tabs,
  Badge,
  Alert,
  Modal,
  Form,
  Switch,
  Descriptions
} from 'antd';
// Removed unused Dayjs import
import {
  DashboardOutlined,
  TeamOutlined,
  MoneyCollectOutlined,
  MedicineBoxOutlined,
  UserOutlined,
  LineChartOutlined,
  SettingOutlined,
  ExportOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  AlertOutlined,
  FileTextOutlined,
  EyeOutlined,
  PrinterOutlined,
  BankOutlined,
  HeartOutlined
} from '@ant-design/icons';
// Store hooks available for future use

const { Title, Text } = Typography;

// Mock admin data
const mockSystemStats = {
  totalPatients: 1247,
  activePatients: 89,
  totalRevenue: 2547000,
  pendingPayments: 185000,
  totalConsultations: 3421,
  totalPrescriptions: 2891,
  activeStaff: 45,
  departments: 8,
  bedOccupancy: 78,
  availableBeds: 120,
  systemUptime: 99.8,
  lastBackup: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
};

const mockRecentActivity = [
  {
    id: 1,
    type: 'patient_registration',
    description: 'New patient registered: Fatima Ibrahim',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    status: 'success',
    user: 'Reception Desk 1'
  },
  {
    id: 2,
    type: 'payment_received',
    description: 'Payment received: ₦25,000 for consultation',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    status: 'success',
    user: 'Cashier 2'
  },
  {
    id: 3,
    type: 'prescription_dispensed',
    description: 'Prescription dispensed: PRES-001',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    status: 'success',
    user: 'Pharmacy'
  },
  {
    id: 4,
    type: 'system_alert',
    description: 'Low stock alert: Paracetamol below threshold',
    timestamp: new Date(Date.now() - 90 * 60 * 1000),
    status: 'warning',
    user: 'System'
  }
];

const mockDepartmentStats = [
  { name: 'Reception', patients: 23, avgWaitTime: 8, staff: 4, status: 'active' },
  { name: 'Screening', patients: 15, avgWaitTime: 12, staff: 3, status: 'active' },
  { name: 'Consultation', patients: 12, avgWaitTime: 25, staff: 8, status: 'active' },
  { name: 'Pharmacy', patients: 18, avgWaitTime: 6, staff: 5, status: 'active' },
  { name: 'Cashier', patients: 9, avgWaitTime: 5, staff: 3, status: 'active' },
  { name: 'Laboratory', patients: 7, avgWaitTime: 15, staff: 4, status: 'active' },
  { name: 'Radiology', patients: 4, avgWaitTime: 30, staff: 3, status: 'maintenance' },
  { name: 'Emergency', patients: 2, avgWaitTime: 2, staff: 6, status: 'active' }
];

const mockFinancialData = {
  todayRevenue: 125000,
  weeklyRevenue: 875000,
  monthlyRevenue: 3250000,
  pendingPayments: 185000,
  completedPayments: 156,
  pendingCount: 23,
  topServices: [
    { name: 'General Consultation', revenue: 450000, count: 89 },
    { name: 'Laboratory Tests', revenue: 320000, count: 156 },
    { name: 'Pharmacy', revenue: 280000, count: 234 },
    { name: 'Specialist Consultation', revenue: 650000, count: 45 },
    { name: 'Emergency Care', revenue: 180000, count: 12 }
  ]
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showUserModal, setShowUserModal] = useState(false);
  const [showSystemModal, setShowSystemModal] = useState(false);

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString('en-US')}`;
  };

  const departmentColumns = [
    {
      title: 'Department',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: typeof mockDepartmentStats[0]) => (
        <div>
          <Text strong>{name}</Text>
          <br />
          <Badge 
            status={record.status === 'active' ? 'success' : record.status === 'maintenance' ? 'warning' : 'error'} 
            text={record.status.charAt(0).toUpperCase() + record.status.slice(1)}
          />
        </div>
      ),
    },
    {
      title: 'Current Patients',
      dataIndex: 'patients',
      key: 'patients',
      render: (count: number) => (
        <Badge count={count} style={{ backgroundColor: '#52c41a' }} />
      ),
    },
    {
      title: 'Staff on Duty',
      dataIndex: 'staff',
      key: 'staff',
      render: (count: number) => (
        <Text><TeamOutlined className="mr-1" />{count}</Text>
      ),
    },
    {
      title: 'Avg Wait Time',
      dataIndex: 'avgWaitTime',
      key: 'avgWaitTime',
      render: (time: number) => (
        <Text>
          <ClockCircleOutlined className="mr-1" />
          {time} min
        </Text>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Space>
          <Button size="small" icon={<EyeOutlined />}>View</Button>
          <Button size="small" icon={<SettingOutlined />}>Manage</Button>
        </Space>
      ),
    },
  ];

  const revenueColumns = [
    {
      title: 'Service',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (amount: number) => <Text strong>{formatCurrency(amount)}</Text>,
    },
    {
      title: 'Transactions',
      dataIndex: 'count',
      key: 'count',
      render: (count: number) => <Badge count={count} style={{ backgroundColor: '#1890ff' }} />,
    },
    {
      title: 'Growth',
      key: 'growth',
      render: () => (
        <Text style={{ color: '#52c41a' }}>
          <LineChartOutlined className="mr-1" />
          +12.5%
        </Text>
      ),
    },
  ];

  const activityIcon = (type: string) => {
    switch (type) {
      case 'patient_registration': return <UserOutlined style={{ color: '#1890ff' }} />;
      case 'payment_received': return <MoneyCollectOutlined style={{ color: '#52c41a' }} />;
      case 'prescription_dispensed': return <MedicineBoxOutlined style={{ color: '#722ed1' }} />;
      case 'system_alert': return <AlertOutlined style={{ color: '#faad14' }} />;
      default: return <FileTextOutlined />;
    }
  };

  return (
    <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <Title level={2}>
            <DashboardOutlined className="mr-2" />
            Administration Dashboard
          </Title>
          <Text type="secondary">
            System overview, reports, and hospital management
          </Text>
        </div>

        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          items={[
            {
              label: 'System Overview',
              key: 'overview',
              children: (
                <div>
                  {/* Key Metrics */}
            <Row gutter={16} style={{ marginBottom: '24px' }}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Total Patients"
                    value={mockSystemStats.totalPatients}
                    prefix={<UserOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                  <div style={{ marginTop: '8px' }}>
                    <Text type="secondary">Active: {mockSystemStats.activePatients}</Text>
                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Monthly Revenue"
                    value={mockSystemStats.totalRevenue}
                    prefix={<MoneyCollectOutlined />}
                    formatter={(value) => formatCurrency(Number(value))}
                    valueStyle={{ color: '#52c41a' }}
                  />
                  <div style={{ marginTop: '8px' }}>
                    <Text type="secondary">Pending: {formatCurrency(mockSystemStats.pendingPayments)}</Text>
                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Total Consultations"
                    value={mockSystemStats.totalConsultations}
                    prefix={<HeartOutlined />}
                    valueStyle={{ color: '#722ed1' }}
                  />
                  <div style={{ marginTop: '8px' }}>
                    <Text type="secondary">Prescriptions: {mockSystemStats.totalPrescriptions}</Text>
                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="System Uptime"
                    value={mockSystemStats.systemUptime}
                    suffix="%"
                    prefix={<CheckCircleOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                  <div style={{ marginTop: '8px' }}>
                    <Text type="secondary">Last backup: {mockSystemStats.lastBackup.toLocaleTimeString()}</Text>
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Department Status */}
            <Row gutter={16} style={{ marginBottom: '24px' }}>
              <Col span={16}>
                <Card 
                  title="Department Status" 
                  extra={
                    <Space>
                      <Button icon={<ReloadOutlined />}>Refresh</Button>
                      <Button icon={<ExportOutlined />}>Export</Button>
                    </Space>
                  }
                >
                  <Table
                    dataSource={mockDepartmentStats}
                    columns={departmentColumns}
                    pagination={false}
                    size="small"
                    rowKey="name"
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card title="Recent Activity" className="mb-4">
                  <List
                    dataSource={mockRecentActivity}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar icon={activityIcon(item.type)} />}
                          title={
                            <div>
                              <Text style={{ fontSize: '12px' }}>{item.description}</Text>
                              <br />
                              <Text type="secondary" style={{ fontSize: '10px' }}>
                                {item.timestamp.toLocaleTimeString()} - {item.user}
                              </Text>
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Card>

                <Card title="System Health">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <Text>CPU Usage</Text>
                      <Progress percent={45} size="small" />
                    </div>
                    <div>
                      <Text>Memory Usage</Text>
                      <Progress percent={67} size="small" status="active" />
                    </div>
                    <div>
                      <Text>Storage</Text>
                      <Progress percent={32} size="small" />
                    </div>
                    <div>
                      <Text>Network</Text>
                      <Progress percent={89} size="small" />
                    </div>
                  </Space>
                </Card>
              </Col>
            </Row>

            {/* Quick Actions */}
            <Card title="Quick Actions">
              <Row gutter={16}>
                <Col span={6}>
                  <Card size="small" style={{ textAlign: 'center' }}>
                    <Button 
                      type="primary" 
                      size="large" 
                      icon={<TeamOutlined />}
                      block
                      onClick={() => setShowUserModal(true)}
                    >
                      Manage Users
                    </Button>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card size="small" style={{ textAlign: 'center' }}>
                    <Button 
                      size="large" 
                      icon={<SettingOutlined />}
                      block
                      onClick={() => setShowSystemModal(true)}
                    >
                      System Settings
                    </Button>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card size="small" style={{ textAlign: 'center' }}>
                    <Button 
                      size="large" 
                      icon={<ExportOutlined />}
                      block
                    >
                      Generate Reports
                    </Button>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card size="small" style={{ textAlign: 'center' }}>
                    <Button 
                      size="large" 
                      icon={<BankOutlined />}
                      block
                    >
                      Backup System
                    </Button>
                  </Card>
                </Col>
              </Row>
            </Card>
                </div>
              )
            },
            {
              label: 'Financial Reports',
              key: 'financial',
              children: (
                <div>
                  <Row gutter={16} style={{ marginBottom: '24px' }}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Today's Revenue"
                    value={mockFinancialData.todayRevenue}
                    formatter={(value) => formatCurrency(Number(value))}
                    valueStyle={{ color: '#52c41a' }}
                    prefix={<MoneyCollectOutlined />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Weekly Revenue"
                    value={mockFinancialData.weeklyRevenue}
                    formatter={(value) => formatCurrency(Number(value))}
                    valueStyle={{ color: '#1890ff' }}
                    prefix={<LineChartOutlined />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Completed Payments"
                    value={mockFinancialData.completedPayments}
                    valueStyle={{ color: '#722ed1' }}
                    prefix={<CheckCircleOutlined />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Pending Payments"
                    value={mockFinancialData.pendingCount}
                    valueStyle={{ color: '#faad14' }}
                    prefix={<ClockCircleOutlined />}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={16}>
                <Card 
                  title="Revenue by Service" 
                  extra={
                    <Space>
                      <Button icon={<ExportOutlined />}>Export</Button>
                    </Space>
                  }
                >
                  <Table
                    dataSource={mockFinancialData.topServices}
                    columns={revenueColumns}
                    pagination={false}
                    size="small"
                    rowKey="name"
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card title="Payment Insights" className="mb-4">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <Text>Average Transaction</Text>
                      <br />
                      <Text strong style={{ fontSize: '18px' }}>{formatCurrency(8500)}</Text>
                    </div>
                    <Divider />
                    <div>
                      <Text>Peak Hours</Text>
                      <br />
                      <Text strong>10:00 AM - 2:00 PM</Text>
                    </div>
                    <Divider />
                    <div>
                      <Text>Most Popular Service</Text>
                      <br />
                      <Text strong>General Consultation</Text>
                    </div>
                  </Space>
                </Card>

                <Alert
                  message="Outstanding Payments"
                  description={`${formatCurrency(mockFinancialData.pendingPayments)} in pending payments require follow-up.`}
                  type="warning"
                  showIcon
                  style={{ marginBottom: '16px' }}
                />

                <Button type="primary" block icon={<PrinterOutlined />}>
                  Generate Financial Report
                </Button>
              </Col>
            </Row>
                </div>
              )
            },
            {
              label: 'Patient Analytics',
              key: 'analytics',
              children: (
                <div>
                  <Row gutter={16} style={{ marginBottom: '24px' }}>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="New Registrations Today"
                    value={12}
                    prefix={<UserOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                  <Progress percent={75} size="small" style={{ marginTop: '8px' }} />
                  <Text type="secondary" style={{ fontSize: '12px' }}>Target: 16 patients</Text>
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Average Wait Time"
                    value={18}
                    suffix="min"
                    prefix={<ClockCircleOutlined />}
                    valueStyle={{ color: '#faad14' }}
                  />
                  <Progress percent={60} size="small" style={{ marginTop: '8px' }} status="active" />
                  <Text type="secondary" style={{ fontSize: '12px' }}>Target: 15 minutes</Text>
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Patient Satisfaction"
                    value={4.7}
                    suffix="/ 5.0"
                    prefix={<TrophyOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                  <Progress percent={94} size="small" style={{ marginTop: '8px' }} />
                  <Text type="secondary" style={{ fontSize: '12px' }}>Based on 156 reviews</Text>
                </Card>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Card title="Patient Demographics">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text>Age 0-18</Text>
                        <Text strong>23%</Text>
                      </div>
                      <Progress percent={23} size="small" />
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text>Age 19-35</Text>
                        <Text strong>34%</Text>
                      </div>
                      <Progress percent={34} size="small" />
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text>Age 36-55</Text>
                        <Text strong>28%</Text>
                      </div>
                      <Progress percent={28} size="small" />
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text>Age 55+</Text>
                        <Text strong>15%</Text>
                      </div>
                      <Progress percent={15} size="small" />
                    </div>
                  </Space>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="Common Conditions">
                  <List
                    dataSource={[
                      { name: 'Hypertension', count: 156, trend: '+5%' },
                      { name: 'Diabetes', count: 89, trend: '+2%' },
                      { name: 'Upper Respiratory Infections', count: 234, trend: '-8%' },
                      { name: 'Malaria', count: 67, trend: '-12%' },
                      { name: 'Gastroenteritis', count: 45, trend: '+15%' }
                    ]}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          title={item.name}
                          description={`${item.count} cases this month`}
                        />
                        <Text style={{ color: item.trend.startsWith('+') ? '#f5222d' : '#52c41a' }}>
                          {item.trend}
                        </Text>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
                </div>
              )
            }
          ]}
        />

        {/* User Management Modal */}
        <Modal
          title="User Management"
          open={showUserModal}
          onCancel={() => setShowUserModal(false)}
          footer={null}
          width={800}
        >
          <Tabs 
            defaultActiveKey="users"
            items={[
              {
                label: 'Active Users',
                key: 'users',
                children: (
                  <div>
                    <Button type="primary" icon={<UserOutlined />} style={{ marginBottom: '16px' }}>
                Add New User
              </Button>
              <Table
                dataSource={[
                  { id: 1, name: 'Dr. Sarah Johnson', role: 'Doctor', department: 'General Practice', status: 'active', lastLogin: '2 hours ago' },
                  { id: 2, name: 'Nurse Mary Williams', role: 'Nurse', department: 'Screening', status: 'active', lastLogin: '30 minutes ago' },
                  { id: 3, name: 'John Cashier', role: 'Cashier', department: 'Billing', status: 'active', lastLogin: '1 hour ago' }
                ]}
                columns={[
                  { title: 'Name', dataIndex: 'name', key: 'name' },
                  { title: 'Role', dataIndex: 'role', key: 'role' },
                  { title: 'Department', dataIndex: 'department', key: 'department' },
                  { 
                    title: 'Status', 
                    dataIndex: 'status', 
                    key: 'status',
                    render: (status: string) => (
                      <Tag color={status === 'active' ? 'green' : 'red'}>{status}</Tag>
                    )
                  },
                  { title: 'Last Login', dataIndex: 'lastLogin', key: 'lastLogin' },
                  {
                    title: 'Actions',
                    key: 'actions',
                    render: () => (
                      <Space>
                        <Button size="small">Edit</Button>
                        <Button size="small" danger>Suspend</Button>
                      </Space>
                    )
                  }
                ]}
                pagination={false}
                size="small"
              />
                  </div>
                )
              },
              {
                label: 'Permissions',
                key: 'permissions',
                children: (
                  <div>
                    <Alert
                message="Role-based Access Control"
                description="Manage permissions for different user roles and departments."
                type="info"
                style={{ marginBottom: '16px' }}
              />
              <div>Coming soon...</div>
                  </div>
                )
              }
            ]}
          />
        </Modal>

        {/* System Settings Modal */}
        <Modal
          title="System Settings"
          open={showSystemModal}
          onCancel={() => setShowSystemModal(false)}
          footer={[
            <Button key="cancel" onClick={() => setShowSystemModal(false)}>
              Cancel
            </Button>,
            <Button key="save" type="primary">
              Save Settings
            </Button>
          ]}
          width={600}
        >
          <Form layout="vertical">
            <Descriptions title="Hospital Information" bordered>
              <Descriptions.Item label="Hospital Name" span={3}>
                City General Hospital
              </Descriptions.Item>
              <Descriptions.Item label="License Number" span={3}>
                HOS-2024-001
              </Descriptions.Item>
              <Descriptions.Item label="Phone" span={3}>
                +234-xxx-xxx-xxxx
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text>Enable SMS Notifications</Text>
                <Switch defaultChecked />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text>Auto Backup (Daily)</Text>
                <Switch defaultChecked />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text>Patient Portal Access</Text>
                <Switch />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text>Online Appointment Booking</Text>
                <Switch />
              </div>
            </Space>
          </Form>
        </Modal>
      </div>
  );
}