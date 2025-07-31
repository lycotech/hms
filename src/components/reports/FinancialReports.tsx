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
  Spin
} from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  DollarCircleOutlined,
  CreditCardOutlined,
  WalletOutlined,
  BankOutlined
} from '@ant-design/icons';
import { FinancialMetrics, DateRange } from '@/lib/store/reportsStore';

const { Text } = Typography;

interface FinancialReportsProps {
  data: FinancialMetrics | null;
  loading: boolean;
  dateRange?: DateRange;
  onRefresh?: () => void;
}

export default function FinancialReports({ 
  data, 
  loading 
}: FinancialReportsProps) {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text>Generating financial reports...</Text>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <Alert
        message="No financial data available"
        description="Please select a date range and refresh to generate reports."
        type="warning"
        showIcon
      />
    );
  }

  // Revenue breakdown chart data
  const revenueByDeptData = Object.entries(data.revenueByDepartment).map(([dept, amount]) => ({
    department: dept,
    revenue: amount,
    percentage: ((amount / data.totalRevenue) * 100).toFixed(1)
  }));

  // Payment method breakdown
  const paymentMethodData = Object.entries(data.revenueByPaymentMethod).map(([method, amount]) => ({
    method,
    amount,
    percentage: ((amount / data.totalRevenue) * 100).toFixed(1),
    icon: method === 'Cash' ? <WalletOutlined /> :
          method === 'Card' ? <CreditCardOutlined /> :
          method === 'Transfer' ? <BankOutlined /> : <DollarCircleOutlined />
  }));

  // Top services table columns
  const servicesColumns = [
    {
      title: 'Service',
      dataIndex: 'service',
      key: 'service',
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (value: number) => `₦${value.toLocaleString()}`,
      sorter: (a: { revenue: number }, b: { revenue: number }) => a.revenue - b.revenue,
    },
    {
      title: 'Transactions',
      dataIndex: 'count',
      key: 'count',
      sorter: (a: { count: number }, b: { count: number }) => a.count - b.count,
    },
    {
      title: 'Avg Value',
      key: 'avgValue',
      render: (record: { revenue: number; count: number }) => `₦${Math.round(record.revenue / record.count).toLocaleString()}`,
    }
  ];

  // Department revenue table columns
  const departmentColumns = [
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (value: number) => `₦${value.toLocaleString()}`,
      sorter: (a: { revenue: number }, b: { revenue: number }) => a.revenue - b.revenue,
    },
    {
      title: 'Share',
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
      {/* Key Financial Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={data.totalRevenue}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<DollarCircleOutlined />}
              formatter={(value) => `₦${value?.toLocaleString()}`}
            />
            <div style={{ marginTop: 8 }}>
              <ArrowUpOutlined style={{ color: '#3f8600' }} />
              <Text style={{ color: '#3f8600', marginLeft: 4 }}>
                +12.5% vs last period
              </Text>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Transactions"
              value={data.totalTransactions}
              valueStyle={{ color: '#1890ff' }}
              prefix={<CreditCardOutlined />}
            />
            <div style={{ marginTop: 8 }}>
              <ArrowUpOutlined style={{ color: '#3f8600' }} />
              <Text style={{ color: '#3f8600', marginLeft: 4 }}>
                +8.3% vs last period
              </Text>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Average Transaction"
              value={data.averageTransactionValue}
              precision={0}
              valueStyle={{ color: '#722ed1' }}
              prefix="₦"
            />
            <div style={{ marginTop: 8 }}>
              <ArrowUpOutlined style={{ color: '#3f8600' }} />
              <Text style={{ color: '#3f8600', marginLeft: 4 }}>
                +3.7% vs last period
              </Text>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Outstanding Payments"
              value={data.outstandingPayments}
              precision={0}
              valueStyle={{ color: '#cf1322' }}
              prefix="₦"
              formatter={(value) => value?.toLocaleString()}
            />
            <div style={{ marginTop: 8 }}>
              <ArrowDownOutlined style={{ color: '#cf1322' }} />
              <Text style={{ color: '#cf1322', marginLeft: 4 }}>
                +5.2% vs last period
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Revenue by Department */}
        <Col span={12}>
          <Card title="Revenue by Department" style={{ height: 400 }}>
            <Table
              dataSource={revenueByDeptData}
              columns={departmentColumns}
              pagination={false}
              size="small"
              scroll={{ y: 280 }}
            />
          </Card>
        </Col>

        {/* Payment Methods */}
        <Col span={12}>
          <Card title="Payment Methods" style={{ height: 400 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {paymentMethodData.map((method) => (
                <Card key={method.method} size="small">
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Space>
                        {method.icon}
                        <Text strong>{method.method}</Text>
                      </Space>
                    </Col>
                    <Col>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                          ₦{method.amount.toLocaleString()}
                        </div>
                        <Text type="secondary">{method.percentage}%</Text>
                      </div>
                    </Col>
                  </Row>
                  <Progress
                    percent={parseFloat(method.percentage)}
                    showInfo={false}
                    size="small"
                    style={{ marginTop: 8 }}
                  />
                </Card>
              ))}
            </Space>
          </Card>
        </Col>

        {/* Top Services */}
        <Col span={24}>
          <Card title="Top Revenue Generating Services">
            <Table
              dataSource={data.topServices}
              columns={servicesColumns}
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>

        {/* Daily Revenue Trend */}
        <Col span={24}>
          <Card title="Daily Revenue Trend">
            <div style={{ height: 300, padding: 20, textAlign: 'center' }}>
              <Text type="secondary">
                Interactive chart showing daily revenue trends would be displayed here.
                <br />
                Data points: {data.dailyRevenue.length} days
                <br />
                Average daily revenue: ₦{Math.round(data.totalRevenue / data.dailyRevenue.length).toLocaleString()}
              </Text>
              
              {/* Simple visual representation */}
              <div style={{ marginTop: 20 }}>
                {data.dailyRevenue.slice(-7).map((day) => {
                  const height = Math.max(20, (day.amount / Math.max(...data.dailyRevenue.map(d => d.amount))) * 200);
                  return (
                    <div
                      key={day.date}
                      style={{
                        display: 'inline-block',
                        width: 40,
                        height,
                        backgroundColor: '#1890ff',
                        margin: '0 4px',
                        borderRadius: '4px 4px 0 0',
                        verticalAlign: 'bottom'
                      }}
                      title={`${day.date}: ₦${day.amount.toLocaleString()}`}
                    />
                  );
                })}
              </div>
              <div style={{ marginTop: 10 }}>
                <Text type="secondary">Last 7 days revenue trend</Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}