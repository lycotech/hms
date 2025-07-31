'use client';

import React from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Progress,
  Tag,
  Typography,
  Space,
  Alert,
  Spin
} from 'antd';
import {
  MedicineBoxOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarCircleOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { InventoryMetrics } from '@/lib/store/reportsStore';

const { Text } = Typography;

interface InventoryReportsProps {
  data: InventoryMetrics | null;
  loading: boolean;
  onRefresh?: () => void;
}

export default function InventoryReports({ 
  data, 
  loading 
}: InventoryReportsProps) {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text>Generating inventory reports...</Text>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <Alert
        message="No inventory data available"
        description="Please refresh to generate inventory reports."
        type="warning"
        showIcon
      />
    );
  }

  // Top medications table columns
  const medicationsColumns = [
    {
      title: 'Medication',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Dispensed',
      dataIndex: 'dispensed',
      key: 'dispensed',
      sorter: (a: { dispensed: number }, b: { dispensed: number }) => a.dispensed - b.dispensed,
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (value: number) => `₦${value.toLocaleString()}`,
      sorter: (a: { revenue: number }, b: { revenue: number }) => a.revenue - b.revenue,
    },
    {
      title: 'Avg Price',
      key: 'avgPrice',
      render: (record: { revenue: number; dispensed: number }) => `₦${Math.round(record.revenue / record.dispensed).toLocaleString()}`,
    }
  ];

  // Stock levels data
  const stockLevelsData = Object.entries(data.stockLevels).map(([level, count]) => ({
    level,
    count,
    percentage: ((count / data.totalMedications) * 100).toFixed(1),
    color: level === 'High Stock' ? '#52c41a' :
           level === 'Normal Stock' ? '#1890ff' :
           level === 'Low Stock' ? '#fa8c16' : '#ff4d4f'
  }));

  // Expiry alerts table columns
  const expiryColumns = [
    {
      title: 'Medication',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Days to Expiry',
      dataIndex: 'daysToExpiry',
      key: 'daysToExpiry',
      render: (days: number) => (
        <Tag color={days <= 30 ? 'red' : days <= 60 ? 'orange' : 'blue'}>
          {days} days
        </Tag>
      ),
      sorter: (a: { daysToExpiry: number }, b: { daysToExpiry: number }) => a.daysToExpiry - b.daysToExpiry,
    },
    {
      title: 'Priority',
      key: 'priority',
      render: (record: { daysToExpiry: number }) => {
        if (record.daysToExpiry <= 30) {
          return <Tag color="red">Critical</Tag>;
        } else if (record.daysToExpiry <= 60) {
          return <Tag color="orange">Warning</Tag>;
        }
        return <Tag color="blue">Monitor</Tag>;
      }
    }
  ];

  return (
    <div>
      {/* Key Inventory Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={4}>
          <Card>
            <Statistic
              title="Total Medications"
              value={data.totalMedications}
              valueStyle={{ color: '#1890ff' }}
              prefix={<MedicineBoxOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Low Stock Items"
              value={data.lowStockItems}
              valueStyle={{ color: '#fa8c16' }}
              prefix={<WarningOutlined />}
            />
            <div style={{ marginTop: 4 }}>
              <Text type="secondary">
                {((data.lowStockItems / data.totalMedications) * 100).toFixed(1)}% of total
              </Text>
            </div>
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Expiring Soon"
              value={data.expiringItems}
              valueStyle={{ color: '#cf1322' }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Total Value"
              value={data.totalValue}
              valueStyle={{ color: '#52c41a' }}
              prefix={<DollarCircleOutlined />}
              formatter={(value) => `₦${value?.toLocaleString()}`}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Stock Turnover"
              value={12.5}
              suffix="x/year"
              valueStyle={{ color: '#722ed1' }}
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Efficiency Rate"
              value={94.2}
              suffix="%"
              precision={1}
              valueStyle={{ color: '#13c2c2' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Stock Levels Distribution */}
        <Col span={12}>
          <Card title="Stock Levels Distribution" style={{ height: 400 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {stockLevelsData.map((stock) => (
                <div key={stock.level}>
                  <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
                    <Col>
                      <Space>
                        <div
                          style={{
                            width: 12,
                            height: 12,
                            backgroundColor: stock.color,
                            borderRadius: '50%'
                          }}
                        />
                        <Text>{stock.level}</Text>
                      </Space>
                    </Col>
                    <Col>
                      <Text strong>{stock.count} items</Text>
                    </Col>
                  </Row>
                  <Progress
                    percent={parseFloat(stock.percentage)}
                    strokeColor={stock.color}
                    style={{ marginBottom: 16 }}
                  />
                </div>
              ))}
            </Space>
          </Card>
        </Col>

        {/* Critical Alerts */}
        <Col span={12}>
          <Card title="Critical Alerts" style={{ height: 400 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {data.lowStockItems > 0 && (
                <Alert
                  message="Low Stock Alert"
                  description={`${data.lowStockItems} medications are running low on stock`}
                  type="warning"
                  showIcon
                  action={
                    <Tag color="orange">Action Required</Tag>
                  }
                />
              )}
              
              {data.expiringItems > 0 && (
                <Alert
                  message="Expiry Alert"
                  description={`${data.expiringItems} medications will expire soon`}
                  type="error"
                  showIcon
                  action={
                    <Tag color="red">Urgent</Tag>
                  }
                />
              )}

              <Card size="small" title="Quick Actions">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Reorder notifications sent</Text>
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Supplier alerts</Text>
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Expiry notifications</Text>
                    <WarningOutlined style={{ color: '#fa8c16' }} />
                  </div>
                </Space>
              </Card>
            </Space>
          </Card>
        </Col>

        {/* Top Medications */}
        <Col span={24}>
          <Card title="Top Dispensed Medications">
            <Table
              dataSource={data.topMedications}
              columns={medicationsColumns}
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>

        {/* Expiry Alerts */}
        <Col span={24}>
          <Card 
            title={
              <Space>
                <WarningOutlined style={{ color: '#ff4d4f' }} />
                <span>Medication Expiry Alerts</span>
              </Space>
            }
          >
            <Table
              dataSource={data.expiryAlerts}
              columns={expiryColumns}
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>

        {/* Inventory Insights */}
        <Col span={24}>
          <Card title="Inventory Insights & Recommendations">
            <Row gutter={16}>
              <Col span={8}>
                <Card size="small" style={{ backgroundColor: '#f6ffed', borderColor: '#52c41a' }}>
                  <div style={{ textAlign: 'center' }}>
                    <CheckCircleOutlined style={{ fontSize: '24px', color: '#52c41a', marginBottom: 8 }} />
                    <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Optimal Stock</div>
                    <Text type="secondary">
                      {stockLevelsData.find(s => s.level === 'High Stock')?.count || 0} medications have healthy stock levels
                    </Text>
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ backgroundColor: '#fff7e6', borderColor: '#fa8c16' }}>
                  <div style={{ textAlign: 'center' }}>
                                          <WarningOutlined style={{ fontSize: '24px', color: '#fa8c16', marginBottom: 8 }} />
                    <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Reorder Required</div>
                    <Text type="secondary">
                      {data.lowStockItems} medications need immediate restocking
                    </Text>
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ backgroundColor: '#fff2f0', borderColor: '#ff4d4f' }}>
                  <div style={{ textAlign: 'center' }}>
                    <CloseCircleOutlined style={{ fontSize: '24px', color: '#ff4d4f', marginBottom: 8 }} />
                    <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Expiry Risk</div>
                    <Text type="secondary">
                      {data.expiringItems} medications expiring within 60 days
                    </Text>
                  </div>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}