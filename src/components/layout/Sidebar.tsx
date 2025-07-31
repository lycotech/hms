'use client';

import React from 'react';
import { Layout, Menu, Avatar, Badge, Tooltip, Button } from 'antd';
import {
  DashboardOutlined,
  UserAddOutlined,
  HeartOutlined,
  UserOutlined,
  DollarCircleOutlined,
  MedicineBoxOutlined,
  SettingOutlined,
  TeamOutlined,
  NotificationOutlined,
  LogoutOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  userRole: string;
}

export default function Sidebar({ collapsed, onCollapse, userRole }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Administrator sees all menu items, others see role-appropriate items
  const getMenuItems = () => {
    const baseItems = [
      {
        key: '/',
        icon: <DashboardOutlined />,
        label: 'Dashboard',
      }
    ];

    const allItems = [
      {
        key: '/reception',
        icon: <UserAddOutlined />,
        label: 'Reception',
      },
      {
        key: '/screening',
        icon: <HeartOutlined />,
        label: 'Screening Room',
      },
      {
        key: '/doctor',
        icon: <UserOutlined />,
        label: 'Doctor Consultation',
      },
      {
        key: '/cashier',
        icon: <DollarCircleOutlined />,
        label: 'Cashier/Billing',
      },
      {
        key: '/pharmacy',
        icon: <MedicineBoxOutlined />,
        label: 'Pharmacy',
      },
      {
        key: '/queue',
        icon: <ClockCircleOutlined />,
        label: 'Queue Management',
      },
      {
        key: '/calling',
        icon: <PhoneOutlined />,
        label: 'Patient Calling',
      },
      {
        key: '/reports',
        icon: <BarChartOutlined />,
        label: 'Reports & Analytics',
      },
      {
        key: '/admin',
        icon: <TeamOutlined />,
        label: 'Admin Panel',
      },
      {
        type: 'divider' as const,
      },
      {
        key: '/settings',
        icon: <SettingOutlined />,
        label: 'Settings',
      }
    ];

    // Administrator has access to ALL menu items
    if (userRole === 'admin') {
      return [...baseItems, ...allItems];
    }

    // Other roles see specific items based on their permissions
    return [...baseItems, ...allItems];
  };

  const menuItems = getMenuItems();

  const handleMenuClick = (e: { key: string }) => {
    router.push(e.key);
  };

  return (
    <Sider
      width={280}
      collapsed={collapsed}
      collapsible
      onCollapse={onCollapse}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        background: '#fff',
        borderRight: '1px solid #f0f0f0',
      }}
    >
      {/* Hospital Logo/Header */}
      <div style={{ 
        padding: '16px 24px', 
        borderBottom: '1px solid #f0f0f0',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '8px' }}>
          <MedicineBoxOutlined style={{ fontSize: '32px', color: '#0066cc' }} />
        </div>
        {!collapsed && (
          <>
            <div style={{ 
              fontWeight: 'bold', 
              fontSize: '16px', 
              color: '#262626',
              marginBottom: '4px'
            }}>
              City General Hospital
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: '#8c8c8c'
            }}>
              Management System
            </div>
          </>
        )}
      </div>

      {/* User Profile Section */}
      <div style={{ 
        padding: '16px 24px', 
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <Badge dot status="success">
          <Avatar size={40} style={{ backgroundColor: '#87d068' }}>
            <UserOutlined />
          </Avatar>
        </Badge>
        {!collapsed && (
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '500', fontSize: '14px' }}>Dr. Sarah Johnson</div>
            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{userRole}</div>
          </div>
        )}
        <Tooltip title="Notifications">
          <Badge count={3} size="small">
            <Button 
              type="text" 
              icon={<NotificationOutlined />} 
              size="small"
            />
          </Badge>
        </Tooltip>
      </div>

      {/* Navigation Menu */}
      <Menu
        mode="inline"
        selectedKeys={[pathname]}
        items={menuItems}
        onClick={handleMenuClick}
        style={{
          border: 'none',
          paddingTop: '8px',
        }}
      />

      {/* Logout Button */}
      <div style={{ 
        position: 'absolute', 
        bottom: '16px', 
        left: '24px', 
        right: '24px' 
      }}>
        <Button 
          type="text" 
          icon={<LogoutOutlined />} 
          block
          style={{ 
            textAlign: 'left',
            color: '#8c8c8c',
            height: '40px'
          }}
        >
          Logout
        </Button>
      </div>
    </Sider>
  );
}