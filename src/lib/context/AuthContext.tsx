'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// User roles and permissions
export type UserRole = 'admin' | 'doctor' | 'nurse' | 'receptionist' | 'pharmacist' | 'cashier';

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  department?: string;
  avatar?: string;
  permissions: string[];
  lastLogin?: string;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: (User & { password: string })[] = [
  {
    id: 'admin-001',
    username: 'admin',
    password: 'admin123',
    firstName: 'System',
    lastName: 'Administrator',
    email: 'admin@cityhospital.com',
    role: 'admin',
    department: 'Administration',
    permissions: ['*'], // All permissions
    isActive: true,
    lastLogin: new Date().toISOString()
  },
  {
    id: 'doctor-001',
    username: 'dr.sarah',
    password: 'doctor123',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@cityhospital.com',
    role: 'doctor',
    department: 'General Medicine',
    permissions: [
      'patients.read', 'patients.write', 'consultations.read', 'consultations.write',
      'prescriptions.read', 'prescriptions.write', 'medical_records.read', 'medical_records.write'
    ],
    isActive: true,
    lastLogin: new Date().toISOString()
  },
  {
    id: 'nurse-001',
    username: 'nurse.mary',
    password: 'nurse123',
    firstName: 'Mary',
    lastName: 'Wilson',
    email: 'mary.wilson@cityhospital.com',
    role: 'nurse',
    department: 'Nursing',
    permissions: [
      'patients.read', 'patients.write', 'vitals.read', 'vitals.write',
      'screening.read', 'screening.write', 'queue.read', 'queue.write'
    ],
    isActive: true,
    lastLogin: new Date().toISOString()
  },
  {
    id: 'receptionist-001',
    username: 'reception',
    password: 'reception123',
    firstName: 'Lisa',
    lastName: 'Brown',
    email: 'lisa.brown@cityhospital.com',
    role: 'receptionist',
    department: 'Front Desk',
    permissions: [
      'patients.read', 'patients.write', 'registration.read', 'registration.write',
      'queue.read', 'queue.write', 'appointments.read', 'appointments.write'
    ],
    isActive: true,
    lastLogin: new Date().toISOString()
  },
  {
    id: 'pharmacist-001',
    username: 'pharmacist',
    password: 'pharmacy123',
    firstName: 'David',
    lastName: 'Chen',
    email: 'david.chen@cityhospital.com',
    role: 'pharmacist',
    department: 'Pharmacy',
    permissions: [
      'prescriptions.read', 'medications.read', 'medications.write',
      'inventory.read', 'inventory.write', 'dispensing.read', 'dispensing.write'
    ],
    isActive: true,
    lastLogin: new Date().toISOString()
  },
  {
    id: 'cashier-001',
    username: 'cashier',
    password: 'cashier123',
    firstName: 'Emma',
    lastName: 'Davis',
    email: 'emma.davis@cityhospital.com',
    role: 'cashier',
    department: 'Billing',
    permissions: [
      'payments.read', 'payments.write', 'billing.read', 'billing.write',
      'financial.read', 'receipts.read', 'receipts.write'
    ],
    isActive: true,
    lastLogin: new Date().toISOString()
  }
];

// Role-based route permissions
export const roleRoutePermissions: Record<UserRole, string[]> = {
  admin: ['/', '/admin', '/reception', '/screening', '/doctor', '/pharmacy', '/cashier'],
  doctor: ['/', '/doctor', '/screening'],
  nurse: ['/', '/screening', '/reception'],
  receptionist: ['/', '/reception'],
  pharmacist: ['/', '/pharmacy'],
  cashier: ['/', '/cashier']
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('hms_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('hms_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => 
      u.username === username && u.password === password && u.isActive
    );
    
    if (foundUser) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = foundUser;
      const userToStore = {
        ...userWithoutPassword,
        lastLogin: new Date().toISOString()
      };
      
      setUser(userToStore);
      localStorage.setItem('hms_user', JSON.stringify(userToStore));
      setIsLoading(false);
      return true;
    } else {
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hms_user');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.permissions.includes('*')) return true; // Admin has all permissions
    return user.permissions.includes(permission);
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      hasPermission,
      hasRole
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// HOC for route protection
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredPermissions?: string[],
  requiredRoles?: UserRole[]
) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, hasPermission, hasRole, isLoading } = useAuth();

    if (isLoading) {
      return <div>Loading...</div>; // Or your loading component
    }

    if (!isAuthenticated) {
      return <div>Please log in to access this page.</div>;
    }

    if (requiredPermissions && !requiredPermissions.every(hasPermission)) {
      return <div>You don&apos;t have permission to access this page.</div>;
    }

    if (requiredRoles && !hasRole(requiredRoles)) {
      return <div>Your role doesn&apos;t have access to this page.</div>;
    }

    return <Component {...props} />;
  };
}