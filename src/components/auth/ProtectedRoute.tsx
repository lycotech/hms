'use client';

import React, { ReactNode } from 'react';
import { useAuth, UserRole, roleRoutePermissions } from '@/lib/context/AuthContext';
import { Spin, Result, Button } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import LoginForm from './LoginForm';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: UserRole[];
  requiredPermissions?: string[];
  fallback?: ReactNode;
}

export default function ProtectedRoute({
  children,
  requiredRoles,
  requiredPermissions,
  fallback
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user, hasPermission, hasRole, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <div>
          <Spin size="large" />
          <div style={{ marginTop: 16, fontSize: '16px' }}>
            Loading...
          </div>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm />;
  }

  // Check route permissions based on user role
  if (user && !roleRoutePermissions[user.role].includes(pathname)) {
    return (
      <Result
        status="403"
        title="Access Denied"
        subTitle={`Your role (${user.role}) doesn't have access to this page.`}
        extra={
          <div>
            <Button type="primary" onClick={() => router.push('/')}>
              Go to Dashboard
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={logout}>
              Switch User
            </Button>
          </div>
        }
      />
    );
  }

  // Check specific role requirements
  if (requiredRoles && !hasRole(requiredRoles)) {
    return (
      <Result
        status="403"
        title="Access Denied"
        subTitle={`This page requires one of the following roles: ${requiredRoles.join(', ')}`}
        extra={
          <div>
            <Button type="primary" onClick={() => router.push('/')}>
              Go to Dashboard
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={logout}>
              Switch User
            </Button>
          </div>
        }
      />
    );
  }

  // Check specific permission requirements
  if (requiredPermissions && !requiredPermissions.every(hasPermission)) {
    return (
      <Result
        status="403"
        title="Insufficient Permissions"
        subTitle="You don't have the required permissions to access this page."
        extra={
          <div>
            <Button type="primary" onClick={() => router.push('/')}>
              Go to Dashboard
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={logout}>
              Switch User
            </Button>
          </div>
        }
      />
    );
  }

  // If custom fallback is provided and access is denied
  if (fallback && (
    (requiredRoles && !hasRole(requiredRoles)) ||
    (requiredPermissions && !requiredPermissions.every(hasPermission))
  )) {
    return <>{fallback}</>;
  }

  // All checks passed, render the protected content
  return <>{children}</>;
}

// Higher-order component for easier usage
export function withProtectedRoute<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    requiredRoles?: UserRole[];
    requiredPermissions?: string[];
    fallback?: ReactNode;
  }
) {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}