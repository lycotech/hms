// Administrator privilege utilities for HMS
import { UserRole } from '@/lib/context/AuthContext';

// Administrator has unrestricted access to all features
export const ADMIN_PRIVILEGES = {
  // Full system access
  UNIVERSAL_ACCESS: true,
  ALL_ROUTES: true,
  ALL_PERMISSIONS: true,
  ALL_DEPARTMENTS: true,
  ALL_FEATURES: true,
  
  // Administrative capabilities
  USER_MANAGEMENT: true,
  SYSTEM_CONFIGURATION: true,
  DATA_EXPORT: true,
  AUDIT_LOGS: true,
  BACKUP_RESTORE: true,
  
  // Override all restrictions
  BYPASS_ROLE_CHECKS: true,
  BYPASS_PERMISSION_CHECKS: true,
  BYPASS_DEPARTMENT_RESTRICTIONS: true,
  BYPASS_TIME_RESTRICTIONS: true
} as const;

// Check if user is administrator
export const isAdministrator = (role: UserRole): boolean => {
  return role === 'admin';
};

// Administrator bypass functions
export const hasAdminAccess = (userRole: UserRole): boolean => {
  return isAdministrator(userRole);
};

export const canAccessAllRoutes = (userRole: UserRole): boolean => {
  return isAdministrator(userRole);
};

export const canAccessAllDepartments = (userRole: UserRole): boolean => {
  return isAdministrator(userRole);
};

export const canBypassPermissionChecks = (userRole: UserRole): boolean => {
  return isAdministrator(userRole);
};

export const canManageAllUsers = (userRole: UserRole): boolean => {
  return isAdministrator(userRole);
};

export const canViewAllReports = (userRole: UserRole): boolean => {
  return isAdministrator(userRole);
};

export const canModifySystemSettings = (userRole: UserRole): boolean => {
  return isAdministrator(userRole);
};

export const canPerformDataOperations = (userRole: UserRole): boolean => {
  return isAdministrator(userRole);
};

// Administrative feature access
export const getAdminFeatures = () => {
  return [
    'USER_MANAGEMENT',
    'SYSTEM_CONFIGURATION', 
    'AUDIT_LOGS',
    'DATA_BACKUP',
    'DATA_RESTORE',
    'SYSTEM_MONITORING',
    'SECURITY_SETTINGS',
    'INTEGRATION_MANAGEMENT',
    'ADVANCED_REPORTING',
    'BULK_OPERATIONS',
    'EMERGENCY_OVERRIDE'
  ];
};

// Department access for administrators
export const getAllDepartments = () => {
  return [
    'general',
    'emergency', 
    'cardiology',
    'pediatrics',
    'orthopedics',
    'radiology',
    'laboratory',
    'pharmacy',
    'billing',
    'administration'
  ];
};

// Route access for administrators
export const getAllRoutes = () => {
  return [
    '/',
    '/admin',
    '/reception',
    '/screening',
    '/doctor',
    '/pharmacy',
    '/cashier',
    '/queue',
    '/calling',
    '/reports',
    '/settings',
    '/users',
    '/system',
    '/audit',
    '/backup'
  ];
};