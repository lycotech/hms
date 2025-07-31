'use client';

import React from 'react';
import PatientCallingSystem from '@/components/queue/PatientCallingSystem';
import { useAuth } from '@/lib/context/AuthContext';

export default function CallingSystemPage() {
  const { user } = useAuth();

  // Determine default department based on user role
  const getDefaultDepartment = () => {
    switch (user?.role) {
      case 'doctor':
        return 'general';
      case 'nurse':
        return 'general';
      case 'receptionist':
        return 'general';
      default:
        return 'general';
    }
  };

  const showAllDepartments = user?.role === 'admin';

  return (
    <PatientCallingSystem
      defaultDepartment={getDefaultDepartment() as 'general'}
      showAllDepartments={showAllDepartments}
    />
  );
}