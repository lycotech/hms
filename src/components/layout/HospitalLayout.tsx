'use client';

import React, { useState, useEffect } from 'react';
import { Layout, Breadcrumb, Alert, Button, Space, Tag, Spin } from 'antd';
import { 
  ReloadOutlined, 
  CloudSyncOutlined, 
  ExclamationCircleOutlined,
  ClockCircleOutlined 
} from '@ant-design/icons';
import Sidebar from './Sidebar';
import { usePatientStore } from '@/lib/store/patientStore';
import { usePaymentStore } from '@/lib/store/paymentStore';

const { Header, Content } = Layout;

interface HospitalLayoutProps {
  children: React.ReactNode;
  title?: string;
  breadcrumbItems?: Array<{ title: string; href?: string }>;
  actions?: React.ReactNode;
  userRole?: string;
}

export default function HospitalLayout({ 
  children, 
  title, 
  breadcrumbItems = [], 
  actions,
  userRole = 'admin' 
}: HospitalLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());

  // Store hooks
  const { initializePatients, syncData: syncPatients, getOfflineChanges } = usePatientStore();
  const { initializeServices, syncPayments } = usePaymentStore();

  useEffect(() => {
    // Initialize stores with mock data
    initializePatients();
    initializeServices();
  }, [initializePatients, initializeServices]);

  const handleSync = async () => {
    setSyncStatus('syncing');
    try {
      await Promise.all([
        syncPatients(),
        syncPayments()
      ]);
      setLastSyncTime(new Date());
      setSyncStatus('synced');
    } catch (error) {
      setSyncStatus('offline');
      console.error('Sync failed:', error);
    }
  };

  const offlineChanges = getOfflineChanges();
  const hasOfflineChanges = offlineChanges.length > 0;

  const getSyncStatusColor = () => {
    switch (syncStatus) {
      case 'synced': return 'success';
      case 'syncing': return 'processing';
      case 'offline': return 'error';
      default: return 'default';
    }
  };

  const getSyncStatusText = () => {
    switch (syncStatus) {
      case 'synced': return 'Synced';
      case 'syncing': return 'Syncing...';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Sidebar 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        userRole={userRole}
      />
      
      <Layout 
        className="transition-all duration-200"
        style={{ 
          marginLeft: collapsed ? 80 : 280,
        }}
      >
        {/* Header */}
        <Header className="bg-white shadow-sm px-6 flex items-center justify-between">
          <div className="flex-1">
            {breadcrumbItems.length > 0 && (
              <Breadcrumb
                items={breadcrumbItems}
                className="mb-2"
              />
            )}
            {title && (
              <h1 className="text-xl font-semibold text-gray-800 m-0">
                {title}
              </h1>
            )}
          </div>

          <Space size="middle">
            {/* Sync Status and Controls */}
            <div className="flex items-center space-x-3">
              <Tag 
                color={getSyncStatusColor()}
                icon={syncStatus === 'syncing' ? <Spin size="small" /> : <CloudSyncOutlined />}
              >
                {getSyncStatusText()}
              </Tag>
              
              {hasOfflineChanges && (
                <Tag color="warning" icon={<ExclamationCircleOutlined />}>
                  {offlineChanges.length} pending
                </Tag>
              )}

              <span className="text-xs text-gray-500" suppressHydrationWarning>
                <ClockCircleOutlined className="mr-1" />
                {lastSyncTime.toLocaleTimeString()}
              </span>

              <Button
                size="small"
                icon={<ReloadOutlined />}
                onClick={handleSync}
                loading={syncStatus === 'syncing'}
                disabled={syncStatus === 'syncing'}
              >
                Sync
              </Button>
            </div>

            {/* Custom Actions */}
            {actions && <div>{actions}</div>}
          </Space>
        </Header>

        {/* Main Content */}
        <Content className="p-6">
          {/* Offline Alert */}
          {syncStatus === 'offline' && (
            <Alert
              message="Working Offline"
              description="Changes will be synced when connection is restored."
              type="warning"
              showIcon
              className="mb-4"
              action={
                <Button size="small" onClick={handleSync}>
                  Retry Sync
                </Button>
              }
            />
          )}

          {/* Pending Changes Alert */}
          {hasOfflineChanges && syncStatus !== 'offline' && (
            <Alert
              message={`${offlineChanges.length} changes pending sync`}
              type="info"
              showIcon
              className="mb-4"
              action={
                <Button size="small" onClick={handleSync}>
                  Sync Now
                </Button>
              }
            />
          )}

          {/* Page Content */}
          <div className="bg-white rounded-lg shadow-sm min-h-[600px]">
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}