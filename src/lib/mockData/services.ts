import { Service } from '../types';

export const mockServices: Service[] = [
  // Consultation Services
  {
    id: 'service-001',
    name: 'General Consultation',
    category: 'consultation',
    price: {
      normal: 5000,
      private: 8000,
      vip: 15000
    },
    duration: '30 minutes',
    department: 'General Practice',
    description: 'Basic medical consultation with general practitioner',
    requiresPayment: true
  },
  {
    id: 'service-002',
    name: 'Specialist Consultation - Cardiology',
    category: 'consultation',
    price: {
      normal: 15000,
      private: 25000,
      vip: 40000
    },
    duration: '45 minutes',
    department: 'Cardiology',
    description: 'Consultation with cardiac specialist',
    requiresPayment: true
  },
  {
    id: 'service-003',
    name: 'Pediatric Consultation',
    category: 'consultation',
    price: {
      normal: 7000,
      private: 12000,
      vip: 20000
    },
    duration: '30 minutes',
    department: 'Pediatrics',
    description: 'Medical consultation for children',
    requiresPayment: true
  },
  {
    id: 'service-004',
    name: 'Gynecological Consultation',
    category: 'consultation',
    price: {
      normal: 10000,
      private: 18000,
      vip: 30000
    },
    duration: '45 minutes',
    department: 'Gynecology',
    description: 'Women\'s health consultation',
    requiresPayment: true
  },
  {
    id: 'service-005',
    name: 'Ophthalmology Consultation',
    category: 'consultation',
    price: {
      normal: 12000,
      private: 20000,
      vip: 35000
    },
    duration: '30 minutes',
    department: 'Ophthalmology',
    description: 'Eye examination and consultation',
    requiresPayment: true
  },

  // Diagnostic Services
  {
    id: 'service-006',
    name: 'Complete Blood Count (CBC)',
    category: 'diagnostic',
    price: {
      normal: 3000,
      private: 4500,
      vip: 6000
    },
    duration: '24 hours',
    department: 'Laboratory',
    description: 'Complete blood count test',
    requiresPayment: true
  },
  {
    id: 'service-007',
    name: 'Chest X-Ray',
    category: 'diagnostic',
    price: {
      normal: 8000,
      private: 12000,
      vip: 15000
    },
    duration: '30 minutes',
    department: 'Radiology',
    description: 'Chest radiograph',
    requiresPayment: true
  },
  {
    id: 'service-008',
    name: 'ECG (Electrocardiogram)',
    category: 'diagnostic',
    price: {
      normal: 5000,
      private: 8000,
      vip: 12000
    },
    duration: '15 minutes',
    department: 'Cardiology',
    description: 'Heart rhythm test',
    requiresPayment: true
  },
  {
    id: 'service-009',
    name: 'Blood Sugar (Fasting)',
    category: 'diagnostic',
    price: {
      normal: 1500,
      private: 2500,
      vip: 3500
    },
    duration: '2 hours',
    department: 'Laboratory',
    description: 'Fasting blood glucose test',
    requiresPayment: true
  },
  {
    id: 'service-010',
    name: 'Ultrasound Scan',
    category: 'diagnostic',
    price: {
      normal: 12000,
      private: 18000,
      vip: 25000
    },
    duration: '30 minutes',
    department: 'Radiology',
    description: 'Abdominal/pelvic ultrasound',
    requiresPayment: true
  },
  {
    id: 'service-011',
    name: 'Malaria Test (RDT)',
    category: 'diagnostic',
    price: {
      normal: 2000,
      private: 3000,
      vip: 4000
    },
    duration: '30 minutes',
    department: 'Laboratory',
    description: 'Rapid diagnostic test for malaria',
    requiresPayment: true
  },
  {
    id: 'service-012',
    name: 'Lipid Profile',
    category: 'diagnostic',
    price: {
      normal: 8000,
      private: 12000,
      vip: 15000
    },
    duration: '24 hours',
    department: 'Laboratory',
    description: 'Cholesterol and triglycerides test',
    requiresPayment: true
  },
  {
    id: 'service-013',
    name: 'Hepatitis B Surface Antigen',
    category: 'diagnostic',
    price: {
      normal: 3500,
      private: 5000,
      vip: 7000
    },
    duration: '24 hours',
    department: 'Laboratory',
    description: 'Hepatitis B screening test',
    requiresPayment: true
  },

  // Optical Services
  {
    id: 'service-014',
    name: 'Eye Examination',
    category: 'optical',
    price: {
      normal: 8000,
      private: 12000,
      vip: 18000
    },
    duration: '45 minutes',
    department: 'Ophthalmology',
    description: 'Comprehensive eye examination',
    requiresPayment: true
  },
  {
    id: 'service-015',
    name: 'Reading Glasses',
    category: 'optical',
    price: {
      normal: 25000,
      private: 40000,
      vip: 65000
    },
    duration: '1 week',
    department: 'Optical Shop',
    description: 'Prescription reading glasses',
    requiresPayment: true
  },
  {
    id: 'service-016',
    name: 'Distance Glasses',
    category: 'optical',
    price: {
      normal: 30000,
      private: 50000,
      vip: 80000
    },
    duration: '1 week',
    department: 'Optical Shop',
    description: 'Prescription distance glasses',
    requiresPayment: true
  },
  {
    id: 'service-017',
    name: 'Contact Lenses (Monthly)',
    category: 'optical',
    price: {
      normal: 15000,
      private: 20000,
      vip: 30000
    },
    duration: '1 day',
    department: 'Optical Shop',
    description: 'Monthly disposable contact lenses',
    requiresPayment: true
  },

  // Pharmacy Services
  {
    id: 'service-018',
    name: 'Prescription Dispensing',
    category: 'pharmacy',
    price: {
      normal: 0,
      private: 0,
      vip: 0
    },
    duration: '15 minutes',
    department: 'Pharmacy',
    description: 'Medication dispensing service',
    requiresPayment: false
  },
  {
    id: 'service-019',
    name: 'Medication Counseling',
    category: 'pharmacy',
    price: {
      normal: 2000,
      private: 3000,
      vip: 5000
    },
    duration: '20 minutes',
    department: 'Pharmacy',
    description: 'Pharmacist consultation on medication use',
    requiresPayment: true
  },

  // Minor Surgery Services
  {
    id: 'service-020',
    name: 'Minor Surgery - Wound Suturing',
    category: 'surgery',
    price: {
      normal: 15000,
      private: 25000,
      vip: 40000
    },
    duration: '1 hour',
    department: 'Surgery',
    description: 'Simple wound closure and suturing',
    requiresPayment: true
  },
  {
    id: 'service-021',
    name: 'Circumcision (Adult)',
    category: 'surgery',
    price: {
      normal: 50000,
      private: 80000,
      vip: 120000
    },
    duration: '2 hours',
    department: 'Surgery',
    description: 'Adult male circumcision procedure',
    requiresPayment: true
  },
  {
    id: 'service-022',
    name: 'Cyst Removal',
    category: 'surgery',
    price: {
      normal: 35000,
      private: 55000,
      vip: 80000
    },
    duration: '1.5 hours',
    department: 'Surgery',
    description: 'Surgical removal of benign cysts',
    requiresPayment: true
  }
];

// Helper functions
export const getServicesByCategory = (category: Service['category']) => {
  return mockServices.filter(service => service.category === category);
};

export const getServicesByDepartment = (department: string) => {
  return mockServices.filter(service => service.department === department);
};

export const getServicePrice = (serviceId: string, tier: 'normal' | 'private' | 'vip') => {
  const service = mockServices.find(s => s.id === serviceId);
  return service ? service.price[tier] : 0;
};

export const searchServices = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return mockServices.filter(service => 
    service.name.toLowerCase().includes(lowercaseQuery) ||
    service.description?.toLowerCase().includes(lowercaseQuery) ||
    service.department.toLowerCase().includes(lowercaseQuery)
  );
};