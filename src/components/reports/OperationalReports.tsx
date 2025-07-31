'use client';

import React from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Progress,
  Typography,
  Alert,
  Spin,
  Rate
} from 'antd';
import {
  UserOutlined,
  ClockCircleOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { OperationalMetrics, DateRange } from '@/lib/store/reportsStore';

const { Text } = Typography;

interface OperationalReportsProps {
  data: OperationalMetrics | null;
  loading: boolean;
  dateRange?: DateRange;
  onRefresh?: () => void;
}

export default function OperationalReports({ 
  data, 
  loading 
}: OperationalReportsProps) {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text>Generating operational reports...</Text>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <Alert
        message="No operational data available"
        description="Please select a date range and refresh to generate reports."
        type="warning"
        showIcon
      />
    );
  }

  // Department efficiency table columns
  const efficiencyColumns = [
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Patients Served',
      dataIndex: 'patientsServed',
      key: 'patientsServed',
      sorter: (a: { patientsServed: number }, b: { patientsServed: number }) => a.patientsServed - b.patientsServed,
    },
    {
      title: 'Avg Wait Time',
      dataIndex: 'averageWaitTime',
      key: 'averageWaitTime',
      render: (value: number) => `${value} min`,
      sorter: (a: { averageWaitTime: number }, b: { averageWaitTime: number }) => a.averageWaitTime - b.averageWaitTime,
    },
    {
      title: 'Efficiency Score',
      dataIndex: 'efficiency',
      key: 'efficiency',
      render: (value: number) => (
        <div>
          <Progress 
            percent={value} 
            size="small" 
            style={{ width: 100, marginRight: 8 }}
            strokeColor={
              value >= 95 ? '#52c41a' :
              value >= 90 ? '#fadb14' :
              value >= 80 ? '#fa8c16' : '#ff4d4f'
            }
          />
          <Text>{value}%</Text>
        </div>
      ),
      sorter: (a: { efficiency: number }, b: { efficiency: number }) => a.efficiency - b.efficiency,
    }
  ];

  // Patient distribution data
  const patientDistributionData = Object.entries(data.patientsByDepartment).map(([dept, count]) => ({
    department: dept,
    patients: count,
    percentage: ((count / data.totalPatients) * 100).toFixed(1)
  }));

  const distributionColumns = [
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Patients',
      dataIndex: 'patients',
      key: 'patients',
      sorter: (a: { patients: number }, b: { patients: number }) => a.patients - b.patients,
    },
    {
      title: 'Distribution',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (value: string) => (
        <div>
          <Progress 
            percent={parseFloat(value)} 
            showInfo={false} 
            size="small" 
            style={{ width: 60, marginRight: 8 }}
          />
          <Text>{value}%</Text>
        </div>
      ),
    }
  ];

  return (
    <div>
      {/* Key Operational Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={4}>
          <Card>
            <Statistic
              title="Total Patients"
              value={data.totalPatients}
              valueStyle={{ color: '#1890ff' }}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="New Patients"
              value={data.newPatients}
              valueStyle={{ color: '#52c41a' }}
              prefix={<TeamOutlined />}
            />
            <div style={{ marginTop: 4 }}>
              <Text type="secondary">
                {((data.newPatients / data.totalPatients) * 100).toFixed(1)}% of total
              </Text>
            </div>
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Avg Wait Time"
              value={data.averageWaitTime}
              suffix="min"
              valueStyle={{ color: '#fa8c16' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Avg Service Time"
              value={data.averageServiceTime}
              suffix="min"
              valueStyle={{ color: '#722ed1' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="No-Show Rate"
              value={data.noShowRate}
              suffix="%"
              precision={1}
              valueStyle={{ color: '#cf1322' }}
              prefix={<AlertOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: '#999', marginBottom: 8 }}>
                Patient Satisfaction
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                {data.patientSatisfactionScore.toFixed(1)}
              </div>
              <Rate 
                disabled 
                allowHalf 
                value={data.patientSatisfactionScore} 
                style={{ fontSize: '16px' }}
              />
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Department Efficiency */}
        <Col span={24}>
          <Card title="Department Efficiency Analysis">
            <Table
              dataSource={data.departmentEfficiency}
              columns={efficiencyColumns}
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>

        {/* Patient Distribution */}
        <Col span={12}>
          <Card title="Patient Distribution by Department" style={{ height: 400 }}>
            <Table
              dataSource={patientDistributionData}
              columns={distributionColumns}
              pagination={false}
              size="small"
              scroll={{ y: 280 }}
            />
          </Card>
        </Col>

        {/* Hourly Patient Flow */}
        <Col span={12}>
          <Card title="Hourly Patient Flow" style={{ height: 400 }}>
            <div style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', height: 200, marginBottom: 20 }}>
                {data.hourlyPatientFlow.map((hour) => {
                  const maxCount = Math.max(...data.hourlyPatientFlow.map(h => h.count));
                  const height = (hour.count / maxCount) * 180;
                  
                  return (
                    <div key={hour.hour} style={{ textAlign: 'center', flex: 1 }}>
                      <div
                        style={{
                          height,
                          backgroundColor: '#1890ff',
                          margin: '0 2px',
                          borderRadius: '4px 4px 0 0',
                          display: 'flex',
                          alignItems: 'end',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}
                        title={`${hour.hour}:00 - ${hour.count} patients`}
                      >
                        {height > 20 ? hour.count : ''}
                      </div>
                      <div style={{ fontSize: '12px', marginTop: 4 }}>
                        {hour.hour}:00
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <Text type="secondary">
                  Peak hours: 15:00-16:00 ({Math.max(...data.hourlyPatientFlow.map(h => h.count))} patients)
                </Text>
              </div>
            </div>
          </Card>
        </Col>

        {/* Daily Patient Trends */}
        <Col span={24}>
          <Card title="Daily Patient Flow Trends">
            <div style={{ height: 250, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', height: 150, marginBottom: 20 }}>
                {data.dailyPatientFlow.slice(-10).map((day) => {
                  const maxCount = Math.max(...data.dailyPatientFlow.map(d => d.count));
                  const height = (day.count / maxCount) * 120;
                  
                  return (
                    <div key={day.date} style={{ textAlign: 'center', flex: 1 }}>
                      <div
                        style={{
                          height,
                          backgroundColor: '#52c41a',
                          margin: '0 4px',
                          borderRadius: '4px 4px 0 0',
                          display: 'flex',
                          alignItems: 'end',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '11px',
                          fontWeight: 'bold'
                        }}
                        title={`${day.date}: ${day.count} patients`}
                      >
                        {height > 15 ? day.count : ''}
                      </div>
                      <div style={{ fontSize: '10px', marginTop: 4 }}>
                        {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <Row gutter={16} style={{ textAlign: 'center' }}>
                <Col span={8}>
                  <Statistic
                    title="Average Daily Patients"
                    value={Math.round(data.dailyPatientFlow.reduce((sum, day) => sum + day.count, 0) / data.dailyPatientFlow.length)}
                    valueStyle={{ fontSize: '18px' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Peak Day"
                    value={Math.max(...data.dailyPatientFlow.map(d => d.count))}
                    valueStyle={{ fontSize: '18px', color: '#52c41a' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Capacity Utilization"
                    value={85}
                    suffix="%"
                    valueStyle={{ fontSize: '18px', color: '#1890ff' }}
                  />
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}