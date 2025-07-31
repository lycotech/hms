'use client';

import React from 'react';
import QueueDisplay from '@/components/queue/QueueDisplay';
import { useAuth } from '@/lib/context/AuthContext';

export default function QueueManagementPage() {
  const { user } = useAuth();

  // Show different views based on user role - Admin has access to ALL departments
  const getDepartments = (): ('general' | 'emergency' | 'cardiology' | 'pediatrics' | 'orthopedics' | 'radiology')[] => {
    // Administrator has unlimited access to all departments
    if (user?.role === 'admin') {
      return ['general', 'emergency', 'cardiology', 'pediatrics', 'orthopedics', 'radiology'];
    }
    
    switch (user?.role) {
      case 'doctor':
        return ['general', 'cardiology', 'pediatrics'];
      case 'nurse':
        return ['general', 'emergency', 'pediatrics'];
      case 'receptionist':
        return ['general', 'pediatrics'];
      default:
        return ['general'];
    }
  };

  return (
    <div>
      <QueueDisplay
        departments={getDepartments()}
        showControls={true}
        autoRefresh={true}
      />
    </div>
  );
}