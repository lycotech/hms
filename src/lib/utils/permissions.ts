// Centralized permission utilities for HMS
import { UserRole } from '@/lib/context/AuthContext';

// All available permissions in the system
export const PERMISSIONS = {
  // Patient Management
  PATIENTS_READ: 'patients.read',
  PATIENTS_WRITE: 'patients.write',
  PATIENTS_DELETE: 'patients.delete',
  
  // Medical Records
  MEDICAL_RECORDS_READ: 'medical_records.read',
  MEDICAL_RECORDS_WRITE: 'medical_records.write',
  MEDICAL_RECORDS_DELETE: 'medical_records.delete',
  
  // Consultations
  CONSULTATIONS_READ: 'consultations.read',
  CONSULTATIONS_WRITE: 'consultations.write',
  CONSULTATIONS_DELETE: 'consultations.delete',
  
  // Prescriptions
  PRESCRIPTIONS_READ: 'prescriptions.read',
  PRESCRIPTIONS_WRITE: 'prescriptions.write',
  PRESCRIPTIONS_DELETE: 'prescriptions.delete',
  
  // Pharmacy & Inventory
  MEDICATIONS_READ: 'medications.read',
  MEDICATIONS_WRITE: 'medications.write',
  MEDICATIONS_DELETE: 'medications.delete',
  INVENTORY_READ: 'inventory.read',
  INVENTORY_WRITE: 'inventory.write',
  DISPENSING_READ: 'dispensing.read',
  DISPENSING_WRITE: 'dispensing.write',
  
  // Financial
  PAYMENTS_READ: 'payments.read',
  PAYMENTS_WRITE: 'payments.write',
  BILLING_READ: 'billing.read',
  BILLING_WRITE: 'billing.write',
  FINANCIAL_READ: 'financial.read',
  FINANCIAL_WRITE: 'financial.write',
  
  // Queue Management
  QUEUE_READ: 'queue.read',
  QUEUE_WRITE: 'queue.write',
  QUEUE_MANAGE: 'queue.manage',
  
  // Screening & Vitals
  VITALS_READ: 'vitals.read',
  VITALS_WRITE: 'vitals.write',
  SCREENING_READ: 'screening.read',
  SCREENING_WRITE: 'screening.write',
  
  // Reports & Analytics
  REPORTS_READ: 'reports.read',
  REPORTS_WRITE: 'reports.write',
  ANALYTICS_READ: 'analytics.read',
  
  // User Management
  USERS_READ: 'users.read',
  USERS_WRITE: 'users.write',
  USERS_DELETE: 'users.delete',
  
  // System Administration
  SYSTEM_CONFIG: 'system.config',
  SYSTEM_BACKUP: 'system.backup',
  SYSTEM_RESTORE: 'system.restore',
  AUDIT_LOGS: 'audit.logs',
  
  // Special Permission
  ALL: '*'
} as const;

// Role-based permission mapping
export const rolePermissions: Record<UserRole, string[]> = {
  admin: [PERMISSIONS.ALL], // Admin has ALL permissions
  
  doctor: [
    PERMISSIONS.PATIENTS_READ,
    PERMISSIONS.PATIENTS_WRITE,
    PERMISSIONS.MEDICAL_RECORDS_READ,
    PERMISSIONS.MEDICAL_RECORDS_WRITE,
    PERMISSIONS.CONSULTATIONS_READ,
    PERMISSIONS.CONSULTATIONS_WRITE,
    PERMISSIONS.PRESCRIPTIONS_READ,
    PERMISSIONS.PRESCRIPTIONS_WRITE,
    PERMISSIONS.VITALS_READ,
    PERMISSIONS.SCREENING_READ,
    PERMISSIONS.QUEUE_READ,
    PERMISSIONS.REPORTS_READ
  ],
  
  nurse: [
    PERMISSIONS.PATIENTS_READ,
    PERMISSIONS.PATIENTS_WRITE,
    PERMISSIONS.VITALS_READ,
    PERMISSIONS.VITALS_WRITE,
    PERMISSIONS.SCREENING_READ,
    PERMISSIONS.SCREENING_WRITE,
    PERMISSIONS.QUEUE_READ,
    PERMISSIONS.QUEUE_WRITE,
    PERMISSIONS.MEDICAL_RECORDS_READ
  ],
  
  receptionist: [
    PERMISSIONS.PATIENTS_READ,
    PERMISSIONS.PATIENTS_WRITE,
    PERMISSIONS.QUEUE_READ,
    PERMISSIONS.QUEUE_WRITE
  ],
  
  pharmacist: [
    PERMISSIONS.PRESCRIPTIONS_READ,
    PERMISSIONS.MEDICATIONS_READ,
    PERMISSIONS.MEDICATIONS_WRITE,
    PERMISSIONS.INVENTORY_READ,
    PERMISSIONS.INVENTORY_WRITE,
    PERMISSIONS.DISPENSING_READ,
    PERMISSIONS.DISPENSING_WRITE,
    PERMISSIONS.PATIENTS_READ
  ],
  
  cashier: [
    PERMISSIONS.PAYMENTS_READ,
    PERMISSIONS.PAYMENTS_WRITE,
    PERMISSIONS.BILLING_READ,
    PERMISSIONS.BILLING_WRITE,
    PERMISSIONS.FINANCIAL_READ,
    PERMISSIONS.PATIENTS_READ
  ]
};

// Utility functions
export const hasPermission = (userPermissions: string[], permission: string): boolean => {
  return userPermissions.includes(PERMISSIONS.ALL) || userPermissions.includes(permission);
};

export const isAdmin = (role: UserRole): boolean => {
  return role === 'admin';
};

export const canAccessAllDepartments = (role: UserRole): boolean => {
  return role === 'admin';
};

export const canManageUsers = (role: UserRole): boolean => {
  return role === 'admin';
};

export const canViewFinancialReports = (role: UserRole): boolean => {
  return role === 'admin' || role === 'cashier';
};

export const canManageInventory = (role: UserRole): boolean => {
  return role === 'admin' || role === 'pharmacist';
};

export const canManageQueue = (role: UserRole): boolean => {
  return role === 'admin' || role === 'nurse' || role === 'receptionist';
};