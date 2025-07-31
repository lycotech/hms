import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Payment, Service, ServiceTier } from '../types';

interface PaymentState {
  payments: Payment[];
  services: Service[];
  currentBill: {
    patientId: string | null;
    services: Array<{
      serviceId: string;
      quantity: number;
      tier: ServiceTier;
      amount: number;
    }>;
    totalAmount: number;
    discount: number;
  };
  
  // Actions
  addPayment: (payment: Omit<Payment, 'id' | 'createdAt'>) => void;
  updatePayment: (id: string, updates: Partial<Payment>) => void;
  getPaymentsByPatient: (patientId: string) => Payment[];
  getPaymentsByService: (serviceId: string) => Payment[];
  getPendingPayments: () => Payment[];
  
  // Billing
  startNewBill: (patientId: string) => void;
  addServiceToBill: (serviceId: string, quantity: number, tier: ServiceTier) => void;
  removeServiceFromBill: (serviceId: string) => void;
  applyDiscount: (discount: number) => void;
  clearBill: () => void;
  processBillPayment: (paymentMethod: Payment['paymentMethod'], cashierName: string) => Payment;
  
  // Payment Verification - CRITICAL FOR PHARMACY
  verifyPaymentForService: (patientId: string, serviceType: Payment['serviceType']) => boolean;
  verifyPaymentForPrescription: (patientId: string, prescriptionId: string) => boolean;
  getServicePaymentStatus: (patientId: string, serviceId: string) => 'paid' | 'pending' | 'none';
  
  // Revenue tracking
  getDailyRevenue: (date?: string) => number;
  getRevenueByService: (serviceId: string, startDate?: string, endDate?: string) => number;
  getRevenueByPaymentMethod: (paymentMethod: Payment['paymentMethod']) => number;
  
  // Utility
  initializeServices: () => void;
  syncPayments: () => Promise<void>;
}

const generateId = () => {
  return 'payment-' + Math.random().toString(36).substr(2, 9);
};

const generateReceiptNumber = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const time = Date.now().toString().slice(-6);
  return `RCP${year}${month}${day}${time}`;
};

// Mock services data
const mockServices: Service[] = [
  {
    id: 'service-001',
    name: 'General Consultation',
    category: 'consultation',
    price: { normal: 5000, private: 8000, vip: 15000 },
    duration: '30 minutes',
    department: 'General Practice',
    description: 'Basic medical consultation',
    requiresPayment: true
  },
  {
    id: 'service-018',
    name: 'Prescription Dispensing',
    category: 'pharmacy',
    price: { normal: 0, private: 0, vip: 0 },
    duration: '15 minutes',
    department: 'Pharmacy',
    description: 'Medication dispensing service',
    requiresPayment: false
  }
];

export const usePaymentStore = create<PaymentState>()(
  persist(
    (set, get) => ({
      payments: [],
      services: mockServices,
      currentBill: {
        patientId: null,
        services: [],
        totalAmount: 0,
        discount: 0
      },

      addPayment: (paymentData) => {
        const newPayment: Payment = {
          ...paymentData,
          id: generateId(),
          createdAt: new Date().toISOString(),
          receiptNumber: generateReceiptNumber(),
          completedAt: paymentData.status === 'completed' ? new Date().toISOString() : undefined
        };

        set((state) => ({
          payments: [...state.payments, newPayment]
        }));
      },

      updatePayment: (id, updates) => {
        set((state) => ({
          payments: state.payments.map(payment =>
            payment.id === id 
              ? { 
                  ...payment, 
                  ...updates,
                  completedAt: updates.status === 'completed' && !payment.completedAt 
                    ? new Date().toISOString() 
                    : payment.completedAt
                }
              : payment
          )
        }));
      },

      getPaymentsByPatient: (patientId) => {
        const { payments } = get();
        return payments.filter(payment => payment.patientId === patientId);
      },

      getPaymentsByService: (serviceId) => {
        const { payments } = get();
        return payments.filter(payment => payment.serviceId === serviceId);
      },

      getPendingPayments: () => {
        const { payments } = get();
        return payments.filter(payment => payment.status === 'pending');
      },

      startNewBill: (patientId) => {
        set({
          currentBill: {
            patientId,
            services: [],
            totalAmount: 0,
            discount: 0
          }
        });
      },

      addServiceToBill: (serviceId, quantity, tier) => {
        const { services } = get();
        const service = services.find(s => s.id === serviceId);
        if (!service) return;

        const amount = service.price[tier] * quantity;

        set((state) => {
          const existingServiceIndex = state.currentBill.services.findIndex(
            s => s.serviceId === serviceId && s.tier === tier
          );

          let updatedServices;
          if (existingServiceIndex >= 0) {
            updatedServices = state.currentBill.services.map((s, index) =>
              index === existingServiceIndex
                ? { ...s, quantity: s.quantity + quantity, amount: s.amount + amount }
                : s
            );
          } else {
            updatedServices = [
              ...state.currentBill.services,
              { serviceId, quantity, tier, amount }
            ];
          }

          const totalAmount = updatedServices.reduce((total, s) => total + s.amount, 0) - state.currentBill.discount;

          return {
            currentBill: {
              ...state.currentBill,
              services: updatedServices,
              totalAmount: Math.max(0, totalAmount)
            }
          };
        });
      },

      removeServiceFromBill: (serviceId) => {
        set((state) => {
          const updatedServices = state.currentBill.services.filter(s => s.serviceId !== serviceId);
          const totalAmount = updatedServices.reduce((total, s) => total + s.amount, 0) - state.currentBill.discount;

          return {
            currentBill: {
              ...state.currentBill,
              services: updatedServices,
              totalAmount: Math.max(0, totalAmount)
            }
          };
        });
      },

      applyDiscount: (discount) => {
        set((state) => {
          const serviceTotal = state.currentBill.services.reduce((total, s) => total + s.amount, 0);
          const totalAmount = Math.max(0, serviceTotal - discount);

          return {
            currentBill: {
              ...state.currentBill,
              discount,
              totalAmount
            }
          };
        });
      },

      clearBill: () => {
        set({
          currentBill: {
            patientId: null,
            services: [],
            totalAmount: 0,
            discount: 0
          }
        });
      },

      processBillPayment: (paymentMethod, cashierName) => {
        const { currentBill, addPayment } = get();
        
        if (!currentBill.patientId || currentBill.services.length === 0) {
          throw new Error('Invalid bill data');
        }

        const payment: Omit<Payment, 'id' | 'createdAt'> = {
          patientId: currentBill.patientId,
          serviceId: currentBill.services[0].serviceId,
          amount: currentBill.totalAmount,
          status: 'completed',
          paymentMethod,
          serviceType: 'consultation',
          cashierName,
          reference: `REF-${Date.now()}`
        };

        addPayment(payment);
        get().clearBill();

        return payment as Payment;
      },

      // CRITICAL BUSINESS LOGIC: Payment verification for pharmacy
      verifyPaymentForService: (patientId, serviceType) => {
        const { payments } = get();
        return payments.some(payment => 
          payment.patientId === patientId && 
          payment.serviceType === serviceType && 
          payment.status === 'completed'
        );
      },

      verifyPaymentForPrescription: (patientId, prescriptionId) => {
        const { payments } = get();
        return payments.some(payment => 
          payment.patientId === patientId && 
          payment.serviceType === 'pharmacy' && 
          payment.status === 'completed' &&
          payment.reference?.includes(prescriptionId)
        );
      },

      getServicePaymentStatus: (patientId, serviceId) => {
        const { payments } = get();
        const payment = payments.find(p => 
          p.patientId === patientId && 
          p.serviceId === serviceId
        );
        
        if (!payment) return 'none';
        return payment.status === 'completed' ? 'paid' : 'pending';
      },

      getDailyRevenue: (date) => {
        const { payments } = get();
        const targetDate = date || new Date().toISOString().split('T')[0];
        
        return payments
          .filter(payment => 
            payment.status === 'completed' && 
            payment.completedAt?.startsWith(targetDate)
          )
          .reduce((total, payment) => total + payment.amount, 0);
      },

      getRevenueByService: (serviceId, startDate, endDate) => {
        const { payments } = get();
        
        return payments
          .filter(payment => {
            if (payment.serviceId !== serviceId || payment.status !== 'completed') {
              return false;
            }
            if (startDate && payment.completedAt && payment.completedAt < startDate) {
              return false;
            }
            if (endDate && payment.completedAt && payment.completedAt > endDate) {
              return false;
            }
            return true;
          })
          .reduce((total, payment) => total + payment.amount, 0);
      },

      getRevenueByPaymentMethod: (paymentMethod) => {
        const { payments } = get();
        
        return payments
          .filter(payment => 
            payment.paymentMethod === paymentMethod && 
            payment.status === 'completed'
          )
          .reduce((total, payment) => total + payment.amount, 0);
      },

      initializeServices: () => {
        set({ services: mockServices });
      },

      syncPayments: async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Payments synced');
      }
    }),
    {
      name: 'payment-store',
      partialize: (state) => ({
        payments: state.payments,
        services: state.services
      })
    }
  )
);