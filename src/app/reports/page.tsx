'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Tabs,
  DatePicker,
  Button,
  Space,
  Typography,
  Statistic,
  Spin,
  Select,
  message
} from 'antd';
import {
  LineChartOutlined,
  DollarCircleOutlined,
  TeamOutlined,
  MedicineBoxOutlined,
  DownloadOutlined,
  ReloadOutlined,
  BarChartOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  WarningOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useReportsStore } from '@/lib/store/reportsStore';
import FinancialReports from '@/components/reports/FinancialReports';
import OperationalReports from '@/components/reports/OperationalReports';
import StaffReports from '@/components/reports/StaffReports';
import InventoryReports from '@/components/reports/InventoryReports';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { Option } = Select;

export default function ReportsPage() {
  const {
    selectedDateRange,
    financialMetrics,
    operationalMetrics,
    staffPerformance,
    inventoryMetrics,
    isLoadingFinancial,
    isLoadingOperational,
    isLoadingStaff,
    isLoadingInventory,
    setDateRange,
    generateFinancialReport,
    generateOperationalReport,
    generateStaffReport,
    generateInventoryReport,
    exportReport,
    refreshAllReports
  } = useReportsStore();

  const [activeTab, setActiveTab] = useState('overview');
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [isExporting, setIsExporting] = useState(false);

  // Load initial data
  useEffect(() => {
    refreshAllReports();
  }, [refreshAllReports]);

  // Handle date range change
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDateRangeChange = (dates: any) => {
    if (dates && dates.length === 2) {
      const newRange = {
        startDate: dates[0].format('YYYY-MM-DD'),
        endDate: dates[1].format('YYYY-MM-DD')
      };
      setDateRange(newRange);
      
      // Refresh reports with new date range
      generateFinancialReport(newRange);
      generateOperationalReport(newRange);
      generateStaffReport(newRange);
    }
  };

  // Handle export
  const handleExport = async (reportType: string) => {
    setIsExporting(true);
    try {
      await exportReport(reportType, exportFormat);
      message.success(`${reportType} report exported successfully`);
    } catch {
      message.error(`Failed to export ${reportType} report`);
    } finally {
      setIsExporting(false);
    }
  };

  // Calculate overview metrics
  const getOverviewMetrics = () => {
    if (!financialMetrics || !operationalMetrics || !staffPerformance || !inventoryMetrics) {
      return null;
    }

    return {
      totalRevenue: financialMetrics.totalRevenue,
      totalPatients: operationalMetrics.totalPatients,
      averageWaitTime: operationalMetrics.averageWaitTime,
      staffUtilization: staffPerformance.staffUtilization,
      lowStockItems: inventoryMetrics.lowStockItems,
      patientSatisfaction: operationalMetrics.patientSatisfactionScore
    };
  };

  const overviewMetrics = getOverviewMetrics();
  const isLoading = isLoadingFinancial || isLoadingOperational || isLoadingStaff || isLoadingInventory;

  return (
    <div>
      {/* Header */}
      <Card style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <BarChartOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
              <div>
                <Title level={3} style={{ margin: 0 }}>Reports & Analytics</Title>
                <Text type="secondary">
                  Comprehensive hospital performance insights
                </Text>
              </div>
            </Space>
          </Col>
          <Col>
            <Space>
              <RangePicker
                value={[
                  dayjs(selectedDateRange.startDate),
                  dayjs(selectedDateRange.endDate)
                ]}
                onChange={handleDateRangeChange}
                allowClear={false}
              />
              <Select
                value={exportFormat}
                onChange={setExportFormat}
                style={{ width: 100 }}
              >
                <Option value="pdf">PDF</Option>
                <Option value="excel">Excel</Option>
                <Option value="csv">CSV</Option>
              </Select>
              <Button
                icon={<ReloadOutlined />}
                onClick={refreshAllReports}
                loading={isLoading}
              >
                Refresh
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Overview Dashboard */}
      {overviewMetrics && (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={4}>
            <Card>
              <Statistic
                title="Total Revenue"
                value={overviewMetrics.totalRevenue}
                precision={0}
                valueStyle={{ color: '#3f8600' }}
                prefix={<DollarCircleOutlined />}
                formatter={(value) => `₦${value?.toLocaleString()}`}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Total Patients"
                value={overviewMetrics.totalPatients}
                valueStyle={{ color: '#1890ff' }}
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Avg Wait Time"
                value={overviewMetrics.averageWaitTime}
                suffix="min"
                valueStyle={{ color: '#cf1322' }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Staff Utilization"
                value={overviewMetrics.staffUtilization}
                suffix="%"
                valueStyle={{ color: '#722ed1' }}
                prefix={<TrophyOutlined />}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Low Stock Items"
                value={overviewMetrics.lowStockItems}
                valueStyle={{ color: '#fa8c16' }}
                prefix={<WarningOutlined />}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Satisfaction"
                value={overviewMetrics.patientSatisfaction}
                suffix="/5"
                precision={1}
                valueStyle={{ color: '#52c41a' }}
                prefix={<TrophyOutlined />}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Main Content Tabs */}
      <Card>
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          tabBarExtraContent={
            <Space>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={() => handleExport(activeTab)}
                loading={isExporting}
              >
                Export {activeTab}
              </Button>
            </Space>
          }
        >
          <TabPane
            tab={
              <span>
                <DollarCircleOutlined />
                Financial Reports
                {isLoadingFinancial && <Spin size="small" style={{ marginLeft: 8 }} />}
              </span>
            }
            key="financial"
          >
            <FinancialReports
              data={financialMetrics}
              loading={isLoadingFinancial}
              dateRange={selectedDateRange}
              onRefresh={() => generateFinancialReport()}
            />
          </TabPane>

          <TabPane
            tab={
              <span>
                <LineChartOutlined />
                Operational Reports
                {isLoadingOperational && <Spin size="small" style={{ marginLeft: 8 }} />}
              </span>
            }
            key="operational"
          >
            <OperationalReports
              data={operationalMetrics}
              loading={isLoadingOperational}
              dateRange={selectedDateRange}
              onRefresh={() => generateOperationalReport()}
            />
          </TabPane>

          <TabPane
            tab={
              <span>
                <TeamOutlined />
                Staff Performance
                {isLoadingStaff && <Spin size="small" style={{ marginLeft: 8 }} />}
              </span>
            }
            key="staff"
          >
            <StaffReports
              data={staffPerformance}
              loading={isLoadingStaff}
              dateRange={selectedDateRange}
              onRefresh={() => generateStaffReport()}
            />
          </TabPane>

          <TabPane
            tab={
              <span>
                <MedicineBoxOutlined />
                Inventory Reports
                {isLoadingInventory && <Spin size="small" style={{ marginLeft: 8 }} />}
              </span>
            }
            key="inventory"
          >
            <InventoryReports
              data={inventoryMetrics}
              loading={isLoadingInventory}
              onRefresh={() => generateInventoryReport()}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}