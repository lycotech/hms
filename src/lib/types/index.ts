// Core Hospital Management System Types

export interface Patient {
  id: string;
  patientNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  email?: string;
  address: string;
  medicalHistory: string;
  lastVisit?: string;
  queueNumber?: number;
  status: 'waiting' | 'in-consultation' | 'completed' | 'no-show';
  createdAt: string;
  syncStatus: 'synced' | 'pending' | 'conflict';
  emergencyContact?: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
  insurance?: {
    provider: string;
    policyNumber: string;
    expiryDate: string;
  };
}

export interface Service {
  id: string;
  name: string;
  category: 'consultation' | 'diagnostic' | 'pharmacy' | 'optical' | 'surgery';
  price: {
    normal: number;
    private: number;
    vip: number;
  };
  duration: string;
  department: string;
  description?: string;
  requiresPayment: boolean;
}

export interface Payment {
  id: string;
  patientId: string;
  serviceId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'cash' | 'card' | 'transfer' | 'insurance';
  serviceType: 'consultation' | 'pharmacy' | 'diagnostic' | 'optical';
  createdAt: string;
  completedAt?: string;
  reference?: string;
  cashierName?: string;
  receiptNumber?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  medications: Array<{
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    instructions?: string;
  }>;
  instructions: string;
  status: 'pending' | 'dispensed' | 'cancelled';
  paymentVerified: boolean;
  paymentId?: string;
  createdAt: string;
  dispensedAt?: string;
  dispensedBy?: string;
  totalAmount: number;
}

export interface VitalSigns {
  id: string;
  patientId: string;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  temperature: number;
  weight: number;
  height: number;
  heartRate: number;
  respiratoryRate: number;
  oxygenSaturation?: number;
  bloodSugar?: number;
  notes?: string;
  recordedBy: string;
  recordedAt: string;
}

export interface VisualAcuity {
  id: string;
  patientId: string;
  rightEye: {
    withoutGlasses: string;
    withGlasses?: string;
    pinhole?: string;
  };
  leftEye: {
    withoutGlasses: string;
    withGlasses?: string;
    pinhole?: string;
  };
  colorVision: string;
  notes?: string;
  recordedBy: string;
  recordedAt: string;
}

export interface Consultation {
  id: string;
  patientId: string;
  doctorId: string;
  chiefComplaint: string;
  historyOfPresentIllness: string;
  physicalExamination: string;
  diagnosis: string;
  treatmentPlan: string;
  followUpDate?: string;
  referral?: {
    department: string;
    doctor: string;
    reason: string;
  };
  status: 'in-progress' | 'completed';
  createdAt: string;
  completedAt?: string;
}

export interface Queue {
  id: string;
  patientId: string;
  department: string;
  queueNumber: number;
  priority: 'normal' | 'urgent' | 'emergency';
  status: 'waiting' | 'called' | 'in-service' | 'completed' | 'no-show';
  estimatedWaitTime?: number;
  calledAt?: string;
  servedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  role: 'reception' | 'screening' | 'doctor' | 'pharmacy' | 'cashier' | 'admin';
  department: string;
  permissions: string[];
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  category: string;
  strength: string;
  form: 'tablet' | 'capsule' | 'syrup' | 'injection' | 'drops' | 'cream' | 'ointment';
  unitPrice: number;
  stockQuantity: number;
  minStockLevel: number;
  expiryDate: string;
  manufacturer: string;
  batchNumber?: string;
  requiresPrescription: boolean;
}

export interface SystemSettings {
  hospitalName: string;
  hospitalAddress: string;
  hospitalPhone: string;
  hospitalEmail: string;
  currency: string;
  timezone: string;
  workingHours: {
    start: string;
    end: string;
  };
  emergencyContact: string;
  defaultLanguage: string;
  offlineMode: boolean;
  syncInterval: number;
}

// Utility types
export type ServiceTier = 'normal' | 'private' | 'vip';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type SyncStatus = 'synced' | 'pending' | 'conflict';
export type PatientStatus = 'waiting' | 'in-consultation' | 'completed' | 'no-show';
export type QueueStatus = 'waiting' | 'called' | 'in-service' | 'completed' | 'no-show';
export type Priority = 'normal' | 'urgent' | 'emergency';

// Form types
export interface PatientRegistrationForm {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  email?: string;
  address: string;
  emergencyContactName?: string;
  emergencyContactRelationship?: string;
  emergencyContactPhone?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  medicalHistory?: string;
}

export interface VitalSignsForm {
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  temperature: number;
  weight: number;
  height: number;
  heartRate: number;
  respiratoryRate: number;
  oxygenSaturation?: number;
  bloodSugar?: number;
  notes?: string;
}

export interface PaymentForm {
  serviceIds: string[];
  paymentMethod: 'cash' | 'card' | 'transfer' | 'insurance';
  amountPaid: number;
  discount?: number;
  notes?: string;
}

// Dashboard types
export interface DashboardStats {
  totalPatients: number;
  patientsToday: number;
  waitingPatients: number;
  inConsultation: number;
  completedToday: number;
  totalRevenue: number;
  revenueToday: number;
  pendingPayments: number;
  prescriptionsPending: number;
  prescriptionsDispensed: number;
}

export interface DepartmentStats {
  department: string;
  waitingCount: number;
  inServiceCount: number;
  completedCount: number;
  averageWaitTime: number;
  revenue: number;
}