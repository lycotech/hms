'use client';

import React, { ReactNode } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import AuthenticatedLayout from './AuthenticatedLayout';
import { Spin } from 'antd';

interface AppWrapperProps {
  children: ReactNode;
}

export default function AppWrapper({ children }: AppWrapperProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div>
          <Spin size="large" />
          <div style={{ marginTop: 16, color: 'white', fontSize: '16px' }}>
            Initializing HMS...
          </div>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm />;
  }

  // Show authenticated layout
  return (
    <AuthenticatedLayout>
      {children}
    </AuthenticatedLayout>
  );
}