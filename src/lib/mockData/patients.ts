import { Patient } from '../types';

export const mockPatients: Patient[] = [
  {
    id: 'patient-001',
    patientNumber: 'HMS2025001',
    firstName: 'Adaobi',
    lastName: 'Nwosu',
    dateOfBirth: '1985-03-15',
    phoneNumber: '+234-803-456-7890',
    email: 'adaobi.nwosu@gmail.com',
    address: '15 Admiralty Way, Lekki Phase 1, Lagos',
    medicalHistory: 'Hypertension, Type 2 Diabetes',
    lastVisit: '2024-12-15',
    queueNumber: 1,
    status: 'waiting',
    createdAt: '2025-01-30T08:00:00Z',
    syncStatus: 'synced',
    emergencyContact: {
      name: 'Chukwudi Nwosu',
      relationship: 'Husband',
      phoneNumber: '+234-802-123-4567'
    },
    insurance: {
      provider: 'AIICO Insurance',
      policyNumber: 'AIICO-2024-789123',
      expiryDate: '2025-12-31'
    }
  },
  {
    id: 'patient-002',
    patientNumber: 'HMS2025002',
    firstName: 'Ibrahim',
    lastName: 'Mohammed',
    dateOfBirth: '1972-08-22',
    phoneNumber: '+234-814-567-8901',
    email: 'ibrahim.mohammed@yahoo.com',
    address: '42 Maitama District, Abuja',
    medicalHistory: 'Chronic kidney disease, Hypertension',
    lastVisit: '2025-01-28',
    queueNumber: 2,
    status: 'in-consultation',
    createdAt: '2025-01-30T08:15:00Z',
    syncStatus: 'synced',
    emergencyContact: {
      name: 'Fatima Mohammed',
      relationship: 'Wife',
      phoneNumber: '+234-813-234-5678'
    }
  },
  {
    id: 'patient-003',
    patientNumber: 'HMS2025003',
    firstName: 'Blessing',
    lastName: 'Okoro',
    dateOfBirth: '1995-11-10',
    phoneNumber: '+234-705-890-1234',
    email: 'blessing.okoro@outlook.com',
    address: '8 Garden City, Port Harcourt, Rivers State',
    medicalHistory: 'Asthma, Allergic rhinitis',
    lastVisit: '2025-01-25',
    queueNumber: 3,
    status: 'waiting',
    createdAt: '2025-01-30T08:30:00Z',
    syncStatus: 'synced',
    emergencyContact: {
      name: 'Joy Okoro',
      relationship: 'Mother',
      phoneNumber: '+234-704-345-6789'
    },
    insurance: {
      provider: 'NHIS',
      policyNumber: 'NHIS-2024-456789',
      expiryDate: '2025-06-30'
    }
  },
  {
    id: 'patient-004',
    patientNumber: 'HMS2025004',
    firstName: 'Olumide',
    lastName: 'Adesola',
    dateOfBirth: '1988-05-18',
    phoneNumber: '+234-806-123-4567',
    email: 'olumide.adesola@gmail.com',
    address: '25 Bodija Estate, Ibadan, Oyo State',
    medicalHistory: 'None',
    queueNumber: 4,
    status: 'completed',
    createdAt: '2025-01-30T09:00:00Z',
    syncStatus: 'synced',
    emergencyContact: {
      name: 'Folake Adesola',
      relationship: 'Wife',
      phoneNumber: '+234-805-987-6543'
    }
  },
  {
    id: 'patient-005',
    patientNumber: 'HMS2025005',
    firstName: 'Khadijah',
    lastName: 'Usman',
    dateOfBirth: '1990-02-28',
    phoneNumber: '+234-817-654-3210',
    email: 'khadijah.usman@gmail.com',
    address: '12 Independence Way, Kaduna',
    medicalHistory: 'Migraine headaches',
    lastVisit: '2025-01-20',
    queueNumber: 5,
    status: 'waiting',
    createdAt: '2025-01-30T09:15:00Z',
    syncStatus: 'synced',
    emergencyContact: {
      name: 'Ahmad Usman',
      relationship: 'Brother',
      phoneNumber: '+234-816-543-2109'
    }
  },
  {
    id: 'patient-006',
    patientNumber: 'HMS2025006',
    firstName: 'Emeka',
    lastName: 'Okafor',
    dateOfBirth: '1978-12-05',
    phoneNumber: '+234-903-876-5432',
    email: 'emeka.okafor@hotmail.com',
    address: '33 New Haven, Enugu State',
    medicalHistory: 'Peptic ulcer disease, GERD',
    lastVisit: '2025-01-18',
    queueNumber: 6,
    status: 'waiting',
    createdAt: '2025-01-30T09:30:00Z',
    syncStatus: 'synced',
    emergencyContact: {
      name: 'Chinelo Okafor',
      relationship: 'Wife',
      phoneNumber: '+234-902-765-4321'
    },
    insurance: {
      provider: 'Leadway Assurance',
      policyNumber: 'LW-2024-987654',
      expiryDate: '2025-08-31'
    }
  },
  {
    id: 'patient-007',
    patientNumber: 'HMS2025007',
    firstName: 'Funmi',
    lastName: 'Adebayo',
    dateOfBirth: '1982-07-14',
    phoneNumber: '+234-701-234-5678',
    email: 'funmi.adebayo@yahoo.com',
    address: '19 Victoria Island, Lagos',
    medicalHistory: 'Fibroid, Iron deficiency anemia',
    lastVisit: '2025-01-22',
    status: 'waiting',
    createdAt: '2025-01-30T10:00:00Z',
    syncStatus: 'synced',
    emergencyContact: {
      name: 'Tunde Adebayo',
      relationship: 'Husband',
      phoneNumber: '+234-700-123-4567'
    }
  },
  {
    id: 'patient-008',
    patientNumber: 'HMS2025008',
    firstName: 'Yusuf',
    lastName: 'Bello',
    dateOfBirth: '1965-04-30',
    phoneNumber: '+234-815-345-6789',
    email: 'yusuf.bello@gmail.com',
    address: '7 Wuse II, Abuja',
    medicalHistory: 'Benign prostatic hyperplasia, Hypertension',
    lastVisit: '2025-01-26',
    status: 'completed',
    createdAt: '2025-01-30T10:15:00Z',
    syncStatus: 'synced',
    emergencyContact: {
      name: 'Halima Bello',
      relationship: 'Wife',
      phoneNumber: '+234-814-234-5678'
    }
  },
  {
    id: 'patient-009',
    patientNumber: 'HMS2025009',
    firstName: 'Chioma',
    lastName: 'Eze',
    dateOfBirth: '1993-09-12',
    phoneNumber: '+234-708-987-6543',
    email: 'chioma.eze@outlook.com',
    address: '28 Achara Layout, Enugu',
    medicalHistory: 'Polycystic ovary syndrome',
    lastVisit: '2025-01-24',
    queueNumber: 7,
    status: 'waiting',
    createdAt: '2025-01-30T10:30:00Z',
    syncStatus: 'synced',
    emergencyContact: {
      name: 'Ugonna Eze',
      relationship: 'Father',
      phoneNumber: '+234-707-876-5432'
    },
    insurance: {
      provider: 'NHIS',
      policyNumber: 'NHIS-2024-234567',
      expiryDate: '2025-09-30'
    }
  },
  {
    id: 'patient-010',
    patientNumber: 'HMS2025010',
    firstName: 'Abdullahi',
    lastName: 'Garba',
    dateOfBirth: '1980-01-25',
    phoneNumber: '+234-818-456-7890',
    email: 'abdullahi.garba@yahoo.com',
    address: '14 Nasarawa GRA, Kano',
    medicalHistory: 'Diabetes mellitus type 2',
    lastVisit: '2025-01-27',
    status: 'in-consultation',
    createdAt: '2025-01-30T11:00:00Z',
    syncStatus: 'synced',
    emergencyContact: {
      name: 'Amina Garba',
      relationship: 'Wife',
      phoneNumber: '+234-817-345-6789'
    }
  },
  {
    id: 'patient-011',
    patientNumber: 'HMS2025011',
    firstName: 'Grace',
    lastName: 'Uche',
    dateOfBirth: '1976-06-08',
    phoneNumber: '+234-909-123-4567',
    email: 'grace.uche@gmail.com',
    address: '31 Aba Road, Owerri, Imo State',
    medicalHistory: 'Osteoarthritis, Chronic back pain',
    lastVisit: '2025-01-23',
    queueNumber: 8,
    status: 'waiting',
    createdAt: '2025-01-30T11:15:00Z',
    syncStatus: 'synced',
    emergencyContact: {
      name: 'Chinedu Uche',
      relationship: 'Son',
      phoneNumber: '+234-908-987-6543'
    }
  },
  {
    id: 'patient-012',
    patientNumber: 'HMS2025012',
    firstName: 'Musa',
    lastName: 'Aliyu',
    dateOfBirth: '1987-11-03',
    phoneNumber: '+234-812-654-3210',
    email: 'musa.aliyu@hotmail.com',
    address: '9 Sokoto Road, Gusau, Zamfara',
    medicalHistory: 'Malaria (recurrent), Anemia',
    lastVisit: '2025-01-29',
    status: 'completed',
    createdAt: '2025-01-30T11:30:00Z',
    syncStatus: 'synced',
    emergencyContact: {
      name: 'Zainab Aliyu',
      relationship: 'Sister',
      phoneNumber: '+234-811-543-2109'
    }
  },
  {
    id: 'patient-013',
    patientNumber: 'HMS2025013',
    firstName: 'Ifeoma',
    lastName: 'Okonkwo',
    dateOfBirth: '1991-08-17',
    phoneNumber: '+234-704-876-5432',
    email: 'ifeoma.okonkwo@yahoo.com',
    address: '22 Awka Road, Onitsha, Anambra',
    medicalHistory: 'Thyroid disorder',
    lastVisit: '2025-01-21',
    queueNumber: 9,
    status: 'waiting',
    createdAt: '2025-01-30T12:00:00Z',
    syncStatus: 'synced',
    emergencyContact: {
      name: 'Obiora Okonkwo',
      relationship: 'Husband',
      phoneNumber: '+234-703-765-4321'
    },
    insurance: {
      provider: 'AXA Mansard',
      policyNumber: 'AXA-2024-345678',
      expiryDate: '2025-07-31'
    }
  },
  {
    id: 'patient-014',
    patientNumber: 'HMS2025014',
    firstName: 'Taiwo',
    lastName: 'Ogundipe',
    dateOfBirth: '1984-12-22',
    phoneNumber: '+234-802-345-6789',
    email: 'taiwo.ogundipe@gmail.com',
    address: '17 Abeokuta Street, Ikeja, Lagos',
    medicalHistory: 'Glaucoma (family history)',
    lastVisit: '2025-01-19',
    status: 'waiting',
    createdAt: '2025-01-30T12:15:00Z',
    syncStatus: 'synced',
    emergencyContact: {
      name: 'Kehinde Ogundipe',
      relationship: 'Twin Brother',
      phoneNumber: '+234-801-234-5678'
    }
  },
  {
    id: 'patient-015',
    patientNumber: 'HMS2025015',
    firstName: 'Hauwa',
    lastName: 'Ibrahim',
    dateOfBirth: '1989-04-09',
    phoneNumber: '+234-816-789-0123',
    email: 'hauwa.ibrahim@outlook.com',
    address: '11 Minna Road, Suleja, Niger',
    medicalHistory: 'Sickle cell trait',
    lastVisit: '2025-01-17',
    queueNumber: 10,
    status: 'waiting',
    createdAt: '2025-01-30T12:30:00Z',
    syncStatus: 'synced',
    emergencyContact: {
      name: 'Suleiman Ibrahim',
      relationship: 'Father',
      phoneNumber: '+234-815-678-9012'
    }
  },
  {
    id: 'patient-016',
    patientNumber: 'HMS2025016',
    firstName: 'Daniel',
    lastName: 'Adamu',
    dateOfBirth: '1975-10-14',
    phoneNumber: '+234-703-012-3456',
    email: 'daniel.adamu@gmail.com',
    address: '26 Jos Road, Plateau State',
    medicalHistory: 'Chronic obstructive pulmonary disease',
    lastVisit: '2025-01-16',
    status: 'completed',
    createdAt: '2025-01-30T13:00:00Z',
    syncStatus: 'synced',
    emergencyContact: {
      name: 'Mary Adamu',
      relationship: 'Wife',
      phoneNumber: '+234-702-901-2345'
    },
    insurance: {
      provider: 'Sovereign Trust Insurance',
      policyNumber: 'STI-2024-567890',
      expiryDate: '2025-10-31'
    }
  },
  {
    id: 'patient-017',
    patientNumber: 'HMS2025017',
    firstName: 'Amara',
    lastName: 'Nnadi',
    dateOfBirth: '1992-03-27',
    phoneNumber: '+234-806-543-2109',
    email: 'amara.nnadi@yahoo.com',
    address: '35 Imo Avenue, Owerri, Imo State',
    medicalHistory: 'Endometriosis',
    lastVisit: '2025-01-30',
    queueNumber: 11,
    status: 'waiting',
    createdAt: '2025-01-30T13:15:00Z',
    syncStatus: 'synced',
    emergencyContact: {
      name: 'Ngozi Nnadi',
      relationship: 'Mother',
      phoneNumber: '+234-805-432-1098'
    }
  },
  {
    id: 'patient-018',
    patientNumber: 'HMS2025018',
    firstName: 'Bashir',
    lastName: 'Abdulkarim',
    dateOfBirth: '1983-07-11',
    phoneNumber: '+234-819-876-5432',
    email: 'bashir.abdulkarim@hotmail.com',
    address: '18 Bauchi Road, Gombe',
    medicalHistory: 'Hepatitis B (chronic)',
    lastVisit: '2025-01-14',
    status: 'waiting',
    createdAt: '2025-01-30T13:30:00Z',
    syncStatus: 'synced',
    emergencyContact: {
      name: 'Aisha Abdulkarim',
      relationship: 'Wife',
      phoneNumber: '+234-818-765-4321'
    }
  },
  {
    id: 'patient-019',
    patientNumber: 'HMS2025019',
    firstName: 'Ngozi',
    lastName: 'Okechukwu',
    dateOfBirth: '1986-09-19',
    phoneNumber: '+234-704-210-9876',
    email: 'ngozi.okechukwu@gmail.com',
    address: '21 University Road, Nsukka, Enugu',
    medicalHistory: 'Breast cancer (in remission)',
    lastVisit: '2025-01-12',
    queueNumber: 12,
    status: 'waiting',
    createdAt: '2025-01-30T14:00:00Z',
    syncStatus: 'synced',
    emergencyContact: {
      name: 'Ikechukwu Okechukwu',
      relationship: 'Husband',
      phoneNumber: '+234-703-109-8765'
    },
    insurance: {
      provider: 'Consolidated Hallmark Insurance',
      policyNumber: 'CHI-2024-678901',
      expiryDate: '2025-11-30'
    }
  },
  {
    id: 'patient-020',
    patientNumber: 'HMS2025020',
    firstName: 'Sani',
    lastName: 'Yakubu',
    dateOfBirth: '1979-01-08',
    phoneNumber: '+234-813-098-7654',
    email: 'sani.yakubu@yahoo.com',
    address: '13 Katsina Road, Daura, Katsina',
    medicalHistory: 'Tuberculosis (treated), Chronic cough',
    lastVisit: '2025-01-13',
    status: 'in-consultation',
    createdAt: '2025-01-30T14:15:00Z',
    syncStatus: 'synced',
    emergencyContact: {
      name: 'Hadiza Yakubu',
      relationship: 'Wife',
      phoneNumber: '+234-812-987-6543'
    }
  },
  {
    id: 'patient-021',
    patientNumber: 'HMS2025021',
    firstName: 'Oluchi',
    lastName: 'Nnamdi',
    dateOfBirth: '1994-05-03',
    phoneNumber: '+234-707-654-3210',
    email: 'oluchi.nnamdi@outlook.com',
    address: '29 Okigwe Road, Owerri, Imo State',
    medicalHistory: 'None',
    queueNumber: 13,
    status: 'waiting',
    createdAt: '2025-01-30T14:30:00Z',
    syncStatus: 'synced',
    emergencyContact: {
      name: 'Chidi Nnamdi',
      relationship: 'Father',
      phoneNumber: '+234-706-543-2109'
    }
  },
  {
    id: 'patient-022',
    patientNumber: 'HMS2025022',
    firstName: 'Fatima',
    lastName: 'Abubakar',
    dateOfBirth: '1981-12-16',
    phoneNumber: '+234-814-432-1098',
    email: 'fatima.abubakar@gmail.com',
    address: '6 Yola Road, Adamawa',
    medicalHistory: 'Rheumatoid arthritis',
    lastVisit: '2025-01-11',
    status: 'completed',
    createdAt: '2025-01-30T15:00:00Z',
    syncStatus: 'synced',
    emergencyContact: {
      name: 'Usman Abubakar',
      relationship: 'Husband',
      phoneNumber: '+234-813-321-0987'
    }
  }
];

// Helper function to get patients by status
export const getPatientsByStatus = (status: Patient['status']) => {
  return mockPatients.filter(patient => patient.status === status);
};

// Helper function to search patients
export const searchPatients = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return mockPatients.filter(patient => 
    patient.firstName.toLowerCase().includes(lowercaseQuery) ||
    patient.lastName.toLowerCase().includes(lowercaseQuery) ||
    patient.patientNumber.toLowerCase().includes(lowercaseQuery) ||
    patient.phoneNumber.includes(query)
  );
};

// Helper function to get next queue number
export const getNextQueueNumber = () => {
  const patientsWithQueue = mockPatients.filter(p => p.queueNumber);
  if (patientsWithQueue.length === 0) return 1;
  return Math.max(...patientsWithQueue.map(p => p.queueNumber!)) + 1;
};