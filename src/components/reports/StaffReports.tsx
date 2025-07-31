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
  Space,
  Alert,
  Spin,
  Rate,
  Avatar,
  Badge
} from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  TrophyOutlined,
  StarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { StaffPerformance, DateRange } from '@/lib/store/reportsStore';

const { Title, Text } = Typography;

interface StaffReportsProps {
  data: StaffPerformance | null;
  loading: boolean;
  dateRange?: DateRange;
  onRefresh?: () => void;
}

export default function StaffReports({ 
  data, 
  loading 
}: StaffReportsProps) {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text>Generating staff reports...</Text>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <Alert
        message="No staff data available"
        description="Please refresh to generate staff performance reports."
        type="warning"
        showIcon
      />
    );
  }

  // Top performers table columns
  const performersColumns = [
    {
      title: 'Staff',
      key: 'staff',
      render: (record: { name: string; department: string }) => (
        <Space>
          <Avatar style={{ backgroundColor: '#1890ff' }}>
            {record.name.split(' ').map((n: string) => n[0]).join('')}
          </Avatar>
          <div>
            <div style={{ fontWeight: 'bold' }}>{record.name}</div>
            <Text type="secondary">{record.department}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Patients Served',
      dataIndex: 'patientsServed',
      key: 'patientsServed',
      sorter: (a: { patientsServed: number }, b: { patientsServed: number }) => a.patientsServed - b.patientsServed,
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => (
        <Space>
          <Rate disabled allowHalf value={rating} style={{ fontSize: '14px' }} />
          <Text>{rating.toFixed(1)}</Text>
        </Space>
      ),
      sorter: (a: { rating: number }, b: { rating: number }) => a.rating - b.rating,
    },
    {
      title: 'Performance',
      key: 'performance',
      render: (record: { rating: number }) => {
        const score = (record.rating / 5) * 100;
        return (
          <Progress
            percent={score}
            size="small"
            strokeColor={
              score >= 90 ? '#52c41a' :
              score >= 80 ? '#fadb14' :
              score >= 70 ? '#fa8c16' : '#ff4d4f'
            }
          />
        );
      },
    }
  ];

  // Department staffing data
  const departmentStaffingData = Object.entries(data.departmentStaffing).map(([dept, count]) => ({
    department: dept,
    staffCount: count,
    percentage: ((count / data.totalStaff) * 100).toFixed(1),
    utilization: Math.round(75 + Math.random() * 25) // Mock utilization data
  }));

  const departmentColumns = [
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Staff Count',
      dataIndex: 'staffCount',
      key: 'staffCount',
      sorter: (a: { staffCount: number }, b: { staffCount: number }) => a.staffCount - b.staffCount,
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
    },
    {
      title: 'Utilization',
      dataIndex: 'utilization',
      key: 'utilization',
      render: (value: number) => (
        <div>
          <Progress 
            percent={value} 
            size="small" 
            style={{ width: 80, marginRight: 8 }}
            strokeColor={
              value >= 90 ? '#52c41a' :
              value >= 80 ? '#fadb14' :
              value >= 70 ? '#fa8c16' : '#ff4d4f'
            }
          />
          <Text>{value}%</Text>
        </div>
      ),
      sorter: (a: { utilization: number }, b: { utilization: number }) => a.utilization - b.utilization,
    }
  ];

  return (
    <div>
      {/* Key Staff Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Staff"
              value={data.totalStaff}
              valueStyle={{ color: '#1890ff' }}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Active Staff"
              value={data.activeStaff}
              valueStyle={{ color: '#52c41a' }}
              prefix={<UserOutlined />}
            />
            <div style={{ marginTop: 4 }}>
              <Text type="secondary">
                {((data.activeStaff / data.totalStaff) * 100).toFixed(1)}% active
              </Text>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Staff Utilization"
              value={data.staffUtilization}
              suffix="%"
              precision={1}
              valueStyle={{ color: '#722ed1' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Avg Performance"
              value={data.topPerformers.reduce((sum, p) => sum + p.rating, 0) / data.topPerformers.length}
              suffix="/5"
              precision={1}
              valueStyle={{ color: '#fa8c16' }}
              prefix={<StarOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Top Performers */}
        <Col span={24}>
          <Card 
            title={
              <Space>
                <TrophyOutlined style={{ color: '#fadb14' }} />
                <span>Top Performing Staff</span>
              </Space>
            }
          >
            <Table
              dataSource={data.topPerformers}
              columns={performersColumns}
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>

        {/* Department Staffing */}
        <Col span={12}>
          <Card title="Department Staffing Overview" style={{ height: 500 }}>
            <Table
              dataSource={departmentStaffingData}
              columns={departmentColumns}
              pagination={false}
              size="small"
              scroll={{ y: 320 }}
            />
          </Card>
        </Col>

        {/* Staff Performance Summary */}
        <Col span={12}>
          <Card title="Performance Summary" style={{ height: 500 }}>
            <div style={{ padding: 20 }}>
              {/* Performance Distribution */}
              <div style={{ marginBottom: 24 }}>
                <Title level={5}>Performance Distribution</Title>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text>Excellent (4.5-5.0)</Text>
                    <Progress
                      percent={35}
                      strokeColor="#52c41a"
                      style={{ marginLeft: 16 }}
                    />
                  </div>
                  <div>
                    <Text>Good (4.0-4.5)</Text>
                    <Progress
                      percent={45}
                      strokeColor="#fadb14"
                      style={{ marginLeft: 16 }}
                    />
                  </div>
                  <div>
                    <Text>Average (3.5-4.0)</Text>
                    <Progress
                      percent={15}
                      strokeColor="#fa8c16"
                      style={{ marginLeft: 16 }}
                    />
                  </div>
                  <div>
                    <Text>Below Average (&lt;3.5)</Text>
                    <Progress
                      percent={5}
                      strokeColor="#ff4d4f"
                      style={{ marginLeft: 16 }}
                    />
                  </div>
                </Space>
              </div>

              {/* Key Metrics */}
              <div>
                <Title level={5}>Key Insights</Title>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Card size="small" style={{ backgroundColor: '#f6ffed' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '18px', marginRight: 8 }} />
                      <div>
                        <Text strong>High Patient Satisfaction</Text>
                        <br />
                        <Text type="secondary">Average rating: {(data.topPerformers.reduce((sum, p) => sum + p.rating, 0) / data.topPerformers.length).toFixed(1)}/5</Text>
                      </div>
                    </div>
                  </Card>

                  <Card size="small" style={{ backgroundColor: '#fff7e6' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <TrophyOutlined style={{ color: '#fa8c16', fontSize: '18px', marginRight: 8 }} />
                      <div>
                        <Text strong>Top Department</Text>
                        <br />
                        <Text type="secondary">Emergency - 98% efficiency</Text>
                      </div>
                    </div>
                  </Card>

                  <Card size="small" style={{ backgroundColor: '#f0f5ff' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <TeamOutlined style={{ color: '#1890ff', fontSize: '18px', marginRight: 8 }} />
                      <div>
                        <Text strong>Staff Retention</Text>
                        <br />
                        <Text type="secondary">95% retention rate</Text>
                      </div>
                    </div>
                  </Card>
                </Space>
              </div>
            </div>
          </Card>
        </Col>

        {/* Recent Achievements */}
        <Col span={24}>
          <Card title="Recent Achievements & Recognition">
            <Row gutter={16}>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center', borderColor: '#52c41a' }}>
                  <Badge.Ribbon text="This Month" color="green">
                    <div style={{ padding: 20 }}>
                      <TrophyOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: 8 }} />
                      <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Dr. Sarah Johnson</div>
                      <Text type="secondary">Highest Patient Satisfaction</Text>
                      <div style={{ marginTop: 8 }}>
                        <Rate disabled value={4.8} style={{ fontSize: '14px' }} />
                      </div>
                    </div>
                  </Badge.Ribbon>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center', borderColor: '#1890ff' }}>
                  <Badge.Ribbon text="This Month" color="blue">
                    <div style={{ padding: 20 }}>
                      <StarOutlined style={{ fontSize: '32px', color: '#1890ff', marginBottom: 8 }} />
                      <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Nurse Mary Wilson</div>
                      <Text type="secondary">Most Patients Served</Text>
                      <div style={{ marginTop: 8 }}>
                        <Text strong>156 patients</Text>
                      </div>
                    </div>
                  </Badge.Ribbon>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center', borderColor: '#fadb14' }}>
                  <Badge.Ribbon text="This Month" color="gold">
                    <div style={{ padding: 20 }}>
                      <CheckCircleOutlined style={{ fontSize: '32px', color: '#fadb14', marginBottom: 8 }} />
                      <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Emergency Team</div>
                      <Text type="secondary">Best Department Efficiency</Text>
                      <div style={{ marginTop: 8 }}>
                        <Text strong>98% efficiency</Text>
                      </div>
                    </div>
                  </Badge.Ribbon>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}