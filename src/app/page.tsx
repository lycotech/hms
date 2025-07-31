'use client';

import React from 'react';
import { Row, Col, Card, Statistic, Progress, List, Badge, Tag } from 'antd';
import { 
  UserOutlined, 
  TeamOutlined, 
  DollarCircleOutlined, 
  MedicineBoxOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import HospitalLayout from '@/components/layout/HospitalLayout';

export default function Dashboard() {
  // Mock data for dashboard
  const stats = {
    totalPatients: 245,
    patientsToday: 42,
    waitingPatients: 15,
    inConsultation: 8,
    completedToday: 19,
    totalRevenue: 1250000,
    revenueToday: 180000,
    pendingPayments: 5,
    prescriptionsPending: 12,
    prescriptionsDispensed: 28
  };

  const recentPatients = [
    { name: 'Adaobi Nwosu', time: '10:30 AM', status: 'waiting', queue: 1 },
    { name: 'Ibrahim Mohammed', time: '10:45 AM', status: 'consultation', queue: 2 },
    { name: 'Blessing Okoro', time: '11:00 AM', status: 'waiting', queue: 3 },
    { name: 'Olumide Adesola', time: '11:15 AM', status: 'completed', queue: 4 }
  ];

  const departmentStats = [
    { department: 'Reception', waiting: 5, inService: 2, completed: 15 },
    { department: 'Screening', waiting: 3, inService: 1, completed: 12 },
    { department: 'Doctor', waiting: 4, inService: 3, completed: 8 },
    { department: 'Pharmacy', waiting: 8, inService: 2, completed: 25 },
    { department: 'Cashier', waiting: 2, inService: 1, completed: 18 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'orange';
      case 'consultation': return 'blue';
      case 'completed': return 'green';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    // Use a simple format to avoid hydration mismatches
    return `₦${amount.toLocaleString('en-US')}`;
  };

  return (
    <HospitalLayout 
      title="Hospital Dashboard"
      breadcrumbItems={[
        { title: 'Dashboard' }
      ]}
    >
      <div className="p-6">
        {/* Key Metrics */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Patients"
                value={stats.totalPatients}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Patients Today"
                value={stats.patientsToday}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Revenue Today"
                value={stats.revenueToday}
                prefix={<DollarCircleOutlined />}
                formatter={(value) => formatCurrency(Number(value))}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Prescriptions"
                value={stats.prescriptionsDispensed}
                suffix={`/ ${stats.prescriptionsDispensed + stats.prescriptionsPending}`}
                prefix={<MedicineBoxOutlined />}
                valueStyle={{ color: '#13c2c2' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Patient Flow and Department Status */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} lg={12}>
            <Card title="Patient Flow Today" className="h-full">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Waiting</span>
                  <span className="flex items-center">
                    <ClockCircleOutlined className="text-orange-500 mr-2" />
                    {stats.waitingPatients}
                  </span>
                </div>
                <Progress 
                  percent={(stats.waitingPatients / stats.patientsToday) * 100} 
                  strokeColor="#faad14"
                  showInfo={false}
                />

                <div className="flex justify-between items-center">
                  <span>In Consultation</span>
                  <span className="flex items-center">
                    <UserOutlined className="text-blue-500 mr-2" />
                    {stats.inConsultation}
                  </span>
                </div>
                <Progress 
                  percent={(stats.inConsultation / stats.patientsToday) * 100} 
                  strokeColor="#1890ff"
                  showInfo={false}
                />

                <div className="flex justify-between items-center">
                  <span>Completed</span>
                  <span className="flex items-center">
                    <CheckCircleOutlined className="text-green-500 mr-2" />
                    {stats.completedToday}
                  </span>
                </div>
                <Progress 
                  percent={(stats.completedToday / stats.patientsToday) * 100} 
                  strokeColor="#52c41a"
                  showInfo={false}
                />
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Department Status" className="h-full">
              <List
                dataSource={departmentStats}
                renderItem={(item) => (
                  <List.Item>
                    <div className="w-full flex justify-between items-center">
                      <span className="font-medium">{item.department}</span>
                      <div className="flex space-x-4">
                        <Badge count={item.waiting} color="orange" />
                        <Badge count={item.inService} color="blue" />
                        <Badge count={item.completed} color="green" />
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>

        {/* Recent Activity and Alerts */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="Recent Patients" className="h-full">
              <List
                dataSource={recentPatients}
                renderItem={(patient) => (
                  <List.Item>
                    <div className="w-full flex justify-between items-center">
                      <div>
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-sm text-gray-500">Queue #{patient.queue} • {patient.time}</div>
                      </div>
                      <Tag color={getStatusColor(patient.status)}>
                        {patient.status}
                      </Tag>
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Alerts & Notifications" className="h-full">
              <div className="space-y-3">
                {stats.pendingPayments > 0 && (
                  <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                    <ExclamationCircleOutlined className="text-orange-500 mr-3" />
                    <div>
                      <div className="font-medium text-orange-800">Pending Payments</div>
                      <div className="text-sm text-orange-600">{stats.pendingPayments} payments awaiting processing</div>
                    </div>
                  </div>
                )}

                {stats.prescriptionsPending > 0 && (
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <MedicineBoxOutlined className="text-blue-500 mr-3" />
                    <div>
                      <div className="font-medium text-blue-800">Prescriptions Ready</div>
                      <div className="text-sm text-blue-600">{stats.prescriptionsPending} prescriptions ready for dispensing</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <CheckCircleOutlined className="text-green-500 mr-3" />
                  <div>
                    <div className="font-medium text-green-800">System Operational</div>
                    <div className="text-sm text-green-600">All departments running normally</div>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </HospitalLayout>
  );
}
