import type { Medication } from '@/lib/types';

export const mockMedications: Medication[] = [
  {
    id: 'MED001',
    name: 'Paracetamol',
    strength: '500mg',
    form: 'tablet',
    manufacturer: 'Emzor Pharmaceuticals',
    unitPrice: 250,
    stockQuantity: 500,
    minStockLevel: 50,
    expiryDate: '2025-12-31',
    batchNumber: 'PAR2024001',
    category: 'Analgesic',
    requiresPrescription: false
  },
  {
    id: 'MED002',
    name: 'Amoxicillin',
    strength: '250mg',
    form: 'capsule',
    manufacturer: 'May & Baker',
    unitPrice: 450,
    stockQuantity: 300,
    minStockLevel: 30,
    expiryDate: '2025-08-15',
    batchNumber: 'AMO2024001',
    category: 'Antibiotic',
    requiresPrescription: true
  },
  {
    id: 'MED003',
    name: 'Lisinopril',
    strength: '10mg',
    form: 'tablet',
    manufacturer: 'GlaxoSmithKline',
    unitPrice: 1200,
    stockQuantity: 150,
    minStockLevel: 20,
    expiryDate: '2025-11-30',
    batchNumber: 'LIS2024001',
    category: 'ACE Inhibitor',
    requiresPrescription: true
  },
  {
    id: 'MED004',
    name: 'Metformin',
    strength: '500mg',
    form: 'tablet',
    manufacturer: 'Ranbaxy',
    unitPrice: 800,
    stockQuantity: 200,
    minStockLevel: 25,
    expiryDate: '2025-10-20',
    batchNumber: 'MET2024001',
    category: 'Antidiabetic',
    requiresPrescription: true
  },
  {
    id: 'MED005',
    name: 'Omeprazole',
    strength: '20mg',
    form: 'capsule',
    manufacturer: 'Fidson Healthcare',
    unitPrice: 350,
    stockQuantity: 180,
    minStockLevel: 20,
    expiryDate: '2025-09-15',
    batchNumber: 'OME2024001',
    category: 'Proton Pump Inhibitor',
    requiresPrescription: true
  },
  {
    id: 'MED006',
    name: 'Amlodipine',
    strength: '5mg',
    form: 'tablet',
    manufacturer: 'Pfizer',
    unitPrice: 650,
    stockQuantity: 120,
    minStockLevel: 15,
    expiryDate: '2025-07-30',
    batchNumber: 'AML2024001',
    category: 'Calcium Channel Blocker',
    requiresPrescription: true
  },
  {
    id: 'MED007',
    name: 'Ciprofloxacin',
    strength: '500mg',
    form: 'tablet',
    manufacturer: 'Cipla',
    unitPrice: 950,
    stockQuantity: 80,
    minStockLevel: 10,
    expiryDate: '2025-06-25',
    batchNumber: 'CIP2024001',
    category: 'Antibiotic',
    requiresPrescription: true
  },
  {
    id: 'MED008',
    name: 'Ibuprofen',
    strength: '400mg',
    form: 'tablet',
    manufacturer: 'Evans Medical',
    unitPrice: 380,
    stockQuantity: 250,
    minStockLevel: 30,
    expiryDate: '2025-12-15',
    batchNumber: 'IBU2024001',
    category: 'NSAID',
    requiresPrescription: false
  },
  {
    id: 'MED009',
    name: 'Atorvastatin',
    strength: '20mg',
    form: 'tablet',
    manufacturer: 'Teva Pharmaceuticals',
    unitPrice: 1500,
    stockQuantity: 100,
    minStockLevel: 15,
    expiryDate: '2025-05-10',
    batchNumber: 'ATO2024001',
    category: 'Statin',
    requiresPrescription: true
  },
  {
    id: 'MED010',
    name: 'Prednisolone',
    strength: '5mg',
    form: 'tablet',
    manufacturer: 'Juhel Nigeria',
    unitPrice: 420,
    stockQuantity: 90,
    minStockLevel: 12,
    expiryDate: '2025-04-20',
    batchNumber: 'PRE2024001',
    category: 'Corticosteroid',
    requiresPrescription: true
  },
  {
    id: 'MED011',
    name: 'Chloroquine',
    strength: '250mg',
    form: 'tablet',
    manufacturer: 'Pharma-Deko',
    unitPrice: 180,
    stockQuantity: 400,
    minStockLevel: 50,
    expiryDate: '2025-11-05',
    batchNumber: 'CHL2024001',
    category: 'Antimalarial',
    requiresPrescription: false
  },
  {
    id: 'MED012',
    name: 'Azithromycin',
    strength: '250mg',
    form: 'capsule',
    manufacturer: 'Sandoz',
    unitPrice: 1200,
    stockQuantity: 75,
    minStockLevel: 10,
    expiryDate: '2025-08-30',
    batchNumber: 'AZI2024001',
    category: 'Antibiotic',
    requiresPrescription: true
  },
  {
    id: 'MED013',
    name: 'Losartan',
    strength: '50mg',
    form: 'tablet',
    manufacturer: 'Merck',
    unitPrice: 850,
    stockQuantity: 110,
    minStockLevel: 15,
    expiryDate: '2025-10-10',
    batchNumber: 'LOS2024001',
    category: 'ARB',
    requiresPrescription: true
  },
  {
    id: 'MED014',
    name: 'Fluconazole',
    strength: '150mg',
    form: 'capsule',
    manufacturer: 'Bond Chemical',
    unitPrice: 2500,
    stockQuantity: 60,
    minStockLevel: 8,
    expiryDate: '2025-07-15',
    batchNumber: 'FLU2024001',
    category: 'Antifungal',
    requiresPrescription: true
  },
  {
    id: 'MED015',
    name: 'Dexamethasone',
    strength: '0.5mg',
    form: 'tablet',
    manufacturer: 'Hovid',
    unitPrice: 320,
    stockQuantity: 85,
    minStockLevel: 10,
    expiryDate: '2025-09-20',
    batchNumber: 'DEX2024001',
    category: 'Corticosteroid',
    requiresPrescription: true
  },
  {
    id: 'MED016',
    name: 'Cetirizine',
    strength: '10mg',
    form: 'tablet',
    manufacturer: 'UCB Pharma',
    unitPrice: 480,
    stockQuantity: 140,
    minStockLevel: 20,
    expiryDate: '2025-12-10',
    batchNumber: 'CET2024001',
    category: 'Antihistamine',
    requiresPrescription: false
  },
  {
    id: 'MED017',
    name: 'Hydralazine',
    strength: '25mg',
    form: 'tablet',
    manufacturer: 'Novartis',
    unitPrice: 950,
    stockQuantity: 70,
    minStockLevel: 10,
    expiryDate: '2025-06-05',
    batchNumber: 'HYD2024001',
    category: 'Vasodilator',
    requiresPrescription: true
  },
  {
    id: 'MED018',
    name: 'Ranitidine',
    strength: '150mg',
    form: 'tablet',
    manufacturer: 'Glaxo Wellcome',
    unitPrice: 380,
    stockQuantity: 160,
    minStockLevel: 20,
    expiryDate: '2025-11-25',
    batchNumber: 'RAN2024001',
    category: 'H2 Receptor Antagonist',
    requiresPrescription: false
  },
  {
    id: 'MED019',
    name: 'Furosemide',
    strength: '40mg',
    form: 'tablet',
    manufacturer: 'Sanofi',
    unitPrice: 220,
    stockQuantity: 190,
    minStockLevel: 25,
    expiryDate: '2025-08-10',
    batchNumber: 'FUR2024001',
    category: 'Diuretic',
    requiresPrescription: true
  },
  {
    id: 'MED020',
    name: 'Vitamin B Complex',
    strength: '1 tab',
    form: 'tablet',
    manufacturer: 'Emzor Pharmaceuticals',
    unitPrice: 150,
    stockQuantity: 350,
    minStockLevel: 40,
    expiryDate: '2025-12-20',
    batchNumber: 'VIT2024001',
    category: 'Vitamin',
    requiresPrescription: false
  },
  {
    id: 'MED021',
    name: 'Simvastatin',
    strength: '20mg',
    form: 'tablet',
    manufacturer: 'Mylan',
    unitPrice: 1100,
    stockQuantity: 95,
    minStockLevel: 12,
    expiryDate: '2025-05-30',
    batchNumber: 'SIM2024001',
    category: 'Statin',
    requiresPrescription: true
  },
  {
    id: 'MED022',
    name: 'Tramadol',
    strength: '50mg',
    form: 'capsule',
    manufacturer: 'Johnson & Johnson',
    unitPrice: 750,
    stockQuantity: 55,
    minStockLevel: 8,
    expiryDate: '2025-07-20',
    batchNumber: 'TRA2024001',
    category: 'Opioid Analgesic',
    requiresPrescription: true
  },
  {
    id: 'MED023',
    name: 'Captopril',
    strength: '25mg',
    form: 'tablet',
    manufacturer: 'Abbott',
    unitPrice: 680,
    stockQuantity: 125,
    minStockLevel: 15,
    expiryDate: '2025-09-05',
    batchNumber: 'CAP2024001',
    category: 'ACE Inhibitor',
    requiresPrescription: true
  },
  {
    id: 'MED024',
    name: 'Ferrous Sulfate',
    strength: '200mg',
    form: 'tablet',
    manufacturer: 'Pharma-Deko',
    unitPrice: 280,
    stockQuantity: 220,
    minStockLevel: 30,
    expiryDate: '2025-11-15',
    batchNumber: 'FER2024001',
    category: 'Iron Supplement',
    requiresPrescription: false
  },
  {
    id: 'MED025',
    name: 'Diclofenac',
    strength: '50mg',
    form: 'tablet',
    manufacturer: 'Novartis',
    unitPrice: 420,
    stockQuantity: 180,
    minStockLevel: 25,
    expiryDate: '2025-10-05',
    batchNumber: 'DIC2024001',
    category: 'NSAID',
    requiresPrescription: false
  }
];

export const getMedicationById = (id: string): Medication | undefined => {
  return mockMedications.find(med => med.id === id);
};

export const getMedicationsByCategory = (category: string): Medication[] => {
  return mockMedications.filter(med => med.category.toLowerCase() === category.toLowerCase());
};

export const getLowStockMedications = (): Medication[] => {
  return mockMedications.filter(med => med.stockQuantity <= med.minStockLevel);
};

export const getExpiringSoonMedications = (daysThreshold: number = 30): Medication[] => {
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
  
  return mockMedications.filter(med => new Date(med.expiryDate) <= thresholdDate);
};