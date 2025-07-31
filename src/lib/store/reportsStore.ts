'use client';

import { create } from 'zustand';
// Store imports available for future integration
// import { usePatientStore } from './patientStore';
// import { usePaymentStore } from './paymentStore';
// import { useQueueStore } from './queueStore';

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface FinancialMetrics {
  totalRevenue: number;
  totalTransactions: number;
  averageTransactionValue: number;
  revenueByDepartment: Record<string, number>;
  revenueByPaymentMethod: Record<string, number>;
  dailyRevenue: Array<{ date: string; amount: number }>;
  monthlyRevenue: Array<{ month: string; amount: number }>;
  topServices: Array<{ service: string; revenue: number; count: number }>;
  refunds: number;
  outstandingPayments: number;
}

export interface OperationalMetrics {
  totalPatients: number;
  newPatients: number;
  returningPatients: number;
  patientsByDepartment: Record<string, number>;
  averageWaitTime: number;
  averageServiceTime: number;
  patientSatisfactionScore: number;
  noShowRate: number;
  departmentEfficiency: Array<{
    department: string;
    patientsServed: number;
    averageWaitTime: number;
    efficiency: number;
  }>;
  hourlyPatientFlow: Array<{ hour: number; count: number }>;
  dailyPatientFlow: Array<{ date: string; count: number }>;
}

export interface StaffPerformance {
  totalStaff: number;
  activeStaff: number;
  staffUtilization: number;
  topPerformers: Array<{
    staffId: string;
    name: string;
    department: string;
    patientsServed: number;
    rating: number;
  }>;
  departmentStaffing: Record<string, number>;
}

export interface InventoryMetrics {
  totalMedications: number;
  lowStockItems: number;
  expiringItems: number;
  totalValue: number;
  topMedications: Array<{
    name: string;
    dispensed: number;
    revenue: number;
  }>;
  stockLevels: Record<string, number>;
  expiryAlerts: Array<{
    medicationId: string;
    name: string;
    expiryDate: string;
    daysToExpiry: number;
  }>;
}

export interface ReportsState {
  // Date range
  selectedDateRange: DateRange;
  
  // Cached data
  financialMetrics: FinancialMetrics | null;
  operationalMetrics: OperationalMetrics | null;
  staffPerformance: StaffPerformance | null;
  inventoryMetrics: InventoryMetrics | null;
  
  // Loading states
  isLoadingFinancial: boolean;
  isLoadingOperational: boolean;
  isLoadingStaff: boolean;
  isLoadingInventory: boolean;
  
  // Export functionality
  exportFormat: 'pdf' | 'excel' | 'csv';
  
  // Actions
  setDateRange: (range: DateRange) => void;
  generateFinancialReport: (dateRange?: DateRange) => Promise<FinancialMetrics>;
  generateOperationalReport: (dateRange?: DateRange) => Promise<OperationalMetrics>;
  generateStaffReport: (dateRange?: DateRange) => Promise<StaffPerformance>;
  generateInventoryReport: () => Promise<InventoryMetrics>;
  exportReport: (type: string, format: 'pdf' | 'excel' | 'csv') => Promise<void>;
  refreshAllReports: () => Promise<void>;
}

// Helper functions for data processing
const mockFinancialData = {
  dailyRevenue: [
    { date: '2025-01-20', amount: 125000 },
    { date: '2025-01-21', amount: 135000 },
    { date: '2025-01-22', amount: 118000 },
    { date: '2025-01-23', amount: 142000 },
    { date: '2025-01-24', amount: 156000 },
    { date: '2025-01-25', amount: 134000 },
    { date: '2025-01-26', amount: 89000 },
    { date: '2025-01-27', amount: 95000 },
    { date: '2025-01-28', amount: 167000 },
    { date: '2025-01-29', amount: 145000 },
    { date: '2025-01-30', amount: 178000 }
  ],
  monthlyRevenue: [
    { month: 'Oct 2024', amount: 3200000 },
    { month: 'Nov 2024', amount: 3450000 },
    { month: 'Dec 2024', amount: 3890000 },
    { month: 'Jan 2025', amount: 4120000 }
  ],
  revenueByDepartment: {
    'General Practice': 1250000,
    'Emergency': 890000,
    'Cardiology': 1450000,
    'Pediatrics': 680000,
    'Orthopedics': 920000,
    'Radiology': 780000,
    'Pharmacy': 1890000
  },
  topServices: [
    { service: 'General Consultation', revenue: 890000, count: 445 },
    { service: 'Emergency Care', revenue: 780000, count: 156 },
    { service: 'Cardiology Consultation', revenue: 1200000, count: 240 },
    { service: 'X-Ray', revenue: 450000, count: 300 },
    { service: 'Blood Test', revenue: 280000, count: 560 },
    { service: 'Prescription', revenue: 1890000, count: 1200 }
  ]
};

const mockOperationalData = {
  patientsByDepartment: {
    'General Practice': 445,
    'Emergency': 156,
    'Cardiology': 240,
    'Pediatrics': 189,
    'Orthopedics': 123,
    'Radiology': 267
  },
  hourlyPatientFlow: [
    { hour: 8, count: 15 }, { hour: 9, count: 25 }, { hour: 10, count: 35 },
    { hour: 11, count: 42 }, { hour: 12, count: 38 }, { hour: 13, count: 28 },
    { hour: 14, count: 45 }, { hour: 15, count: 48 }, { hour: 16, count: 52 },
    { hour: 17, count: 35 }, { hour: 18, count: 22 }, { hour: 19, count: 12 }
  ],
  departmentEfficiency: [
    { department: 'General Practice', patientsServed: 445, averageWaitTime: 18, efficiency: 92 },
    { department: 'Emergency', patientsServed: 156, averageWaitTime: 8, efficiency: 98 },
    { department: 'Cardiology', patientsServed: 240, averageWaitTime: 25, efficiency: 88 },
    { department: 'Pediatrics', patientsServed: 189, averageWaitTime: 15, efficiency: 94 },
    { department: 'Orthopedics', patientsServed: 123, averageWaitTime: 22, efficiency: 90 },
    { department: 'Radiology', patientsServed: 267, averageWaitTime: 12, efficiency: 96 }
  ]
};

export const useReportsStore = create<ReportsState>((set, get) => ({
  // Initial state
  selectedDateRange: {
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    endDate: new Date().toISOString().split('T')[0] // today
  },
  
  financialMetrics: null,
  operationalMetrics: null,
  staffPerformance: null,
  inventoryMetrics: null,
  
  isLoadingFinancial: false,
  isLoadingOperational: false,
  isLoadingStaff: false,
  isLoadingInventory: false,
  
  exportFormat: 'pdf',

  // Set date range
  setDateRange: (range) => {
    set({ selectedDateRange: range });
  },

  // Generate financial report
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  generateFinancialReport: async (_?: DateRange) => {
    set({ isLoadingFinancial: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Date range parameter available for future use
      
      // Calculate metrics based on mock data
      const totalRevenue = mockFinancialData.dailyRevenue.reduce((sum, day) => sum + day.amount, 0);
      const totalTransactions = mockFinancialData.topServices.reduce((sum, service) => sum + service.count, 0);
      
      const financialMetrics: FinancialMetrics = {
        totalRevenue,
        totalTransactions,
        averageTransactionValue: Math.round(totalRevenue / totalTransactions),
        revenueByDepartment: mockFinancialData.revenueByDepartment,
        revenueByPaymentMethod: {
          'Cash': totalRevenue * 0.35,
          'Card': totalRevenue * 0.45,
          'Transfer': totalRevenue * 0.15,
          'Insurance': totalRevenue * 0.05
        },
        dailyRevenue: mockFinancialData.dailyRevenue,
        monthlyRevenue: mockFinancialData.monthlyRevenue,
        topServices: mockFinancialData.topServices,
        refunds: totalRevenue * 0.02,
        outstandingPayments: totalRevenue * 0.08
      };
      
      set({ financialMetrics, isLoadingFinancial: false });
      return financialMetrics;
    } catch (error) {
      set({ isLoadingFinancial: false });
      throw error;
    }
  },

  // Generate operational report
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  generateOperationalReport: async (_?: DateRange) => {
    set({ isLoadingOperational: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Date range parameter available for future use
      
      const totalPatients = Object.values(mockOperationalData.patientsByDepartment).reduce((sum, count) => sum + count, 0);
      
      const operationalMetrics: OperationalMetrics = {
        totalPatients,
        newPatients: Math.round(totalPatients * 0.3),
        returningPatients: Math.round(totalPatients * 0.7),
        patientsByDepartment: mockOperationalData.patientsByDepartment,
        averageWaitTime: 19,
        averageServiceTime: 32,
        patientSatisfactionScore: 4.2,
        noShowRate: 8.5,
        departmentEfficiency: mockOperationalData.departmentEfficiency,
        hourlyPatientFlow: mockOperationalData.hourlyPatientFlow,
        dailyPatientFlow: mockFinancialData.dailyRevenue.map(day => ({
          date: day.date,
          count: Math.round(day.amount / 2800) // Estimate patients from revenue
        }))
      };
      
      set({ operationalMetrics, isLoadingOperational: false });
      return operationalMetrics;
    } catch (error) {
      set({ isLoadingOperational: false });
      throw error;
    }
  },

  // Generate staff report
  generateStaffReport: async () => {
    set({ isLoadingStaff: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const staffPerformance: StaffPerformance = {
        totalStaff: 45,
        activeStaff: 38,
        staffUtilization: 84.4,
        topPerformers: [
          { staffId: 'DOC001', name: 'Dr. Sarah Johnson', department: 'General Practice', patientsServed: 125, rating: 4.8 },
          { staffId: 'DOC002', name: 'Dr. Michael Chen', department: 'Cardiology', patientsServed: 98, rating: 4.7 },
          { staffId: 'NUR001', name: 'Nurse Mary Wilson', department: 'Emergency', patientsServed: 156, rating: 4.9 },
          { staffId: 'DOC003', name: 'Dr. Emily Davis', department: 'Pediatrics', patientsServed: 89, rating: 4.6 },
          { staffId: 'DOC004', name: 'Dr. James Miller', department: 'Orthopedics', patientsServed: 76, rating: 4.5 }
        ],
        departmentStaffing: {
          'General Practice': 12,
          'Emergency': 8,
          'Cardiology': 6,
          'Pediatrics': 7,
          'Orthopedics': 5,
          'Radiology': 4,
          'Pharmacy': 3
        }
      };
      
      set({ staffPerformance, isLoadingStaff: false });
      return staffPerformance;
    } catch (error) {
      set({ isLoadingStaff: false });
      throw error;
    }
  },

  // Generate inventory report
  generateInventoryReport: async () => {
    set({ isLoadingInventory: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const inventoryMetrics: InventoryMetrics = {
        totalMedications: 342,
        lowStockItems: 23,
        expiringItems: 12,
        totalValue: 2850000,
        topMedications: [
          { name: 'Paracetamol 500mg', dispensed: 1250, revenue: 312500 },
          { name: 'Amoxicillin 250mg', dispensed: 890, revenue: 400500 },
          { name: 'Lisinopril 10mg', dispensed: 567, revenue: 680400 },
          { name: 'Metformin 500mg', dispensed: 445, revenue: 356000 },
          { name: 'Omeprazole 20mg', dispensed: 389, revenue: 136150 }
        ],
        stockLevels: {
          'High Stock': 198,
          'Normal Stock': 121,
          'Low Stock': 23,
          'Out of Stock': 0
        },
        expiryAlerts: [
          { medicationId: 'MED023', name: 'Captopril 25mg', expiryDate: '2025-02-15', daysToExpiry: 16 },
          { medicationId: 'MED018', name: 'Ranitidine 150mg', expiryDate: '2025-02-28', daysToExpiry: 29 },
          { medicationId: 'MED012', name: 'Azithromycin 250mg', expiryDate: '2025-03-10', daysToExpiry: 39 },
          { medicationId: 'MED007', name: 'Ciprofloxacin 500mg', expiryDate: '2025-03-25', daysToExpiry: 54 }
        ]
      };
      
      set({ inventoryMetrics, isLoadingInventory: false });
      return inventoryMetrics;
    } catch (error) {
      set({ isLoadingInventory: false });
      throw error;
    }
  },

  // Export report
  exportReport: async (type, format) => {
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would generate and download the file
      const fileName = `${type}_report_${new Date().toISOString().split('T')[0]}.${format}`;
      
      // Create a mock download
      if (typeof window !== 'undefined') {
        const element = document.createElement('a');
        const file = new Blob([`Mock ${type} report data`], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = fileName;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }
    } catch (error) {
      throw new Error(`Failed to export ${type} report: ${error}`);
    }
  },

  // Refresh all reports
  refreshAllReports: async () => {
    const state = get();
    const range = state.selectedDateRange;
    
    await Promise.all([
      state.generateFinancialReport(range),
      state.generateOperationalReport(range),
      state.generateStaffReport(range),
      state.generateInventoryReport()
    ]);
  }
}));