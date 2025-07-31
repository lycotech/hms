'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import { Layout, Button, Avatar, Dropdown, Badge, Space, Typography, Tag, Drawer } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  SyncOutlined
} from '@ant-design/icons';
import { useAuth } from '@/lib/context/AuthContext';
import Sidebar from './Sidebar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { usePathname } from 'next/navigation';

const { Header, Content } = Layout;
const { Text } = Typography;

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Check if screen is mobile size
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true); // Auto-collapse on mobile
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get page title based on current route
  const getPageTitle = (path: string) => {
    const titles: Record<string, string> = {
      '/': 'Dashboard',
      '/admin': 'Administration',
      '/reception': 'Reception & Registration',
      '/screening': 'Screening Room',
      '/doctor': 'Doctor Consultation',
      '/pharmacy': 'Pharmacy',
      '/cashier': 'Cashier & Billing'
    };
    return titles[path] || 'HMS';
  };

  // User dropdown menu
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile Settings',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Preferences',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sign Out',
      onClick: logout,
    },
  ];

  // Role color mapping
  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'red',
      doctor: 'blue',
      nurse: 'green',
      receptionist: 'orange',
      pharmacist: 'purple',
      cashier: 'cyan'
    };
    return colors[role] || 'default';
  };

  const handleMenuToggle = () => {
    if (isMobile) {
      setMobileDrawerOpen(!mobileDrawerOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sidebar 
          collapsed={collapsed} 
          onCollapse={setCollapsed}
          userRole={user?.role || 'admin'}
        />
      )}

      {/* Mobile Drawer */}
      <Drawer
        title="Navigation"
        placement="left"
        onClose={() => setMobileDrawerOpen(false)}
        open={mobileDrawerOpen}
        styles={{ body: { padding: 0 } }}
        width={280}
        style={{ display: isMobile ? 'block' : 'none' }}
      >
        <Sidebar 
          collapsed={false} 
          onCollapse={() => {}}
          userRole={user?.role || 'admin'}
        />
      </Drawer>
      
      <Layout style={{ 
        marginLeft: isMobile ? 0 : (collapsed ? 80 : 280), 
        transition: 'margin-left 0.2s' 
      }}>
        <Header style={{
          padding: isMobile ? '0 16px' : '0 24px',
          background: '#fff',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <Space align="center">
            <Button
              type="text"
              icon={isMobile ? <MenuUnfoldOutlined /> : (collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />)}
              onClick={handleMenuToggle}
              style={{ fontSize: '16px', width: 40, height: 40 }}
            />
            <div style={{ display: isMobile ? 'none' : 'block' }}>
              <Text strong style={{ fontSize: isMobile ? '16px' : '18px', color: '#262626' }}>
                {getPageTitle(pathname)}
              </Text>
              <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '-2px' }}>
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </Space>

          <Space align="center" size={isMobile ? "small" : "middle"}>
            {/* System Status - Hidden on mobile */}
            {!isMobile && (
              <Space>
                <SyncOutlined spin style={{ color: '#52c41a' }} />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  System Online
                </Text>
              </Space>
            )}

            {/* Notifications */}
            <Badge count={3} size="small">
              <Button
                type="text"
                icon={<BellOutlined />}
                style={{ fontSize: '16px' }}
              />
            </Badge>

            {/* User Profile */}
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Space style={{ cursor: 'pointer', padding: isMobile ? '4px 8px' : '8px 12px', borderRadius: '6px' }}>
                <Avatar 
                  size={isMobile ? 28 : 32} 
                  style={{ 
                    backgroundColor: user?.role === 'admin' ? '#ff4d4f' : 
                                   user?.role === 'doctor' ? '#1890ff' : '#52c41a'
                  }}
                >
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </Avatar>
                {!isMobile && (
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '14px', fontWeight: 500, lineHeight: 1.2 }}>
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div style={{ fontSize: '12px', color: '#8c8c8c', lineHeight: 1.2 }}>
                      <Tag color={getRoleColor(user?.role || '')}>
                        {user?.role?.toUpperCase()}
                      </Tag>
                    </div>
                  </div>
                )}
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content style={{
          margin: isMobile ? '16px' : '24px',
          padding: isMobile ? '16px' : '24px',
          background: '#f5f5f5',
          minHeight: 'calc(100vh - 112px)',
          borderRadius: '8px'
        }}>
          <ProtectedRoute>
            {children}
          </ProtectedRoute>
        </Content>
      </Layout>
    </Layout>
  );
}