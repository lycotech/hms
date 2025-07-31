import type { Medication } from '@/lib/types';

export const mockMedications: Medication[] = [
  {
    id: 'MED001',
    name: 'Paracetamol',
    strength: '500mg',
    form: 'Tablet',
    manufacturer: 'Emzor Pharmaceuticals',
    price: 250,
    stockQuantity: 500,
    minStockLevel: 50,
    expiryDate: new Date('2025-12-31'),
    batchNumber: 'PAR2024001',
    category: 'Analgesic'
  },
  {
    id: 'MED002',
    name: 'Amoxicillin',
    strength: '250mg',
    form: 'Capsule',
    manufacturer: 'May & Baker',
    price: 450,
    stockQuantity: 300,
    minStockLevel: 30,
    expiryDate: new Date('2025-08-15'),
    batchNumber: 'AMO2024001',
    category: 'Antibiotic'
  },
  {
    id: 'MED003',
    name: 'Lisinopril',
    strength: '10mg',
    form: 'Tablet',
    manufacturer: 'GlaxoSmithKline',
    price: 1200,
    stockQuantity: 150,
    minStockLevel: 20,
    expiryDate: new Date('2025-11-30'),
    batchNumber: 'LIS2024001',
    category: 'ACE Inhibitor'
  },
  {
    id: 'MED004',
    name: 'Metformin',
    strength: '500mg',
    form: 'Tablet',
    manufacturer: 'Ranbaxy',
    price: 800,
    stockQuantity: 200,
    minStockLevel: 25,
    expiryDate: new Date('2025-10-20'),
    batchNumber: 'MET2024001',
    category: 'Antidiabetic'
  },
  {
    id: 'MED005',
    name: 'Omeprazole',
    strength: '20mg',
    form: 'Capsule',
    manufacturer: 'Fidson Healthcare',
    price: 350,
    stockQuantity: 180,
    minStockLevel: 20,
    expiryDate: new Date('2025-09-15'),
    batchNumber: 'OME2024001',
    category: 'Proton Pump Inhibitor'
  },
  {
    id: 'MED006',
    name: 'Amlodipine',
    strength: '5mg',
    form: 'Tablet',
    manufacturer: 'Pfizer',
    price: 650,
    stockQuantity: 120,
    minStockLevel: 15,
    expiryDate: new Date('2025-07-30'),
    batchNumber: 'AML2024001',
    category: 'Calcium Channel Blocker'
  },
  {
    id: 'MED007',
    name: 'Ciprofloxacin',
    strength: '500mg',
    form: 'Tablet',
    manufacturer: 'Cipla',
    price: 950,
    stockQuantity: 80,
    minStockLevel: 10,
    expiryDate: new Date('2025-06-25'),
    batchNumber: 'CIP2024001',
    category: 'Antibiotic'
  },
  {
    id: 'MED008',
    name: 'Ibuprofen',
    strength: '400mg',
    form: 'Tablet',
    manufacturer: 'Evans Medical',
    price: 380,
    stockQuantity: 250,
    minStockLevel: 30,
    expiryDate: new Date('2025-12-15'),
    batchNumber: 'IBU2024001',
    category: 'NSAID'
  },
  {
    id: 'MED009',
    name: 'Atorvastatin',
    strength: '20mg',
    form: 'Tablet',
    manufacturer: 'Teva Pharmaceuticals',
    price: 1500,
    stockQuantity: 100,
    minStockLevel: 15,
    expiryDate: new Date('2025-05-10'),
    batchNumber: 'ATO2024001',
    category: 'Statin'
  },
  {
    id: 'MED010',
    name: 'Prednisolone',
    strength: '5mg',
    form: 'Tablet',
    manufacturer: 'Juhel Nigeria',
    price: 420,
    stockQuantity: 90,
    minStockLevel: 12,
    expiryDate: new Date('2025-04-20'),
    batchNumber: 'PRE2024001',
    category: 'Corticosteroid'
  },
  {
    id: 'MED011',
    name: 'Chloroquine',
    strength: '250mg',
    form: 'Tablet',
    manufacturer: 'Pharma-Deko',
    price: 180,
    stockQuantity: 400,
    minStockLevel: 50,
    expiryDate: new Date('2025-11-05'),
    batchNumber: 'CHL2024001',
    category: 'Antimalarial'
  },
  {
    id: 'MED012',
    name: 'Azithromycin',
    strength: '250mg',
    form: 'Capsule',
    manufacturer: 'Sandoz',
    price: 1200,
    stockQuantity: 75,
    minStockLevel: 10,
    expiryDate: new Date('2025-08-30'),
    batchNumber: 'AZI2024001',
    category: 'Antibiotic'
  },
  {
    id: 'MED013',
    name: 'Losartan',
    strength: '50mg',
    form: 'Tablet',
    manufacturer: 'Merck',
    price: 850,
    stockQuantity: 110,
    minStockLevel: 15,
    expiryDate: new Date('2025-10-10'),
    batchNumber: 'LOS2024001',
    category: 'ARB'
  },
  {
    id: 'MED014',
    name: 'Fluconazole',
    strength: '150mg',
    form: 'Capsule',
    manufacturer: 'Bond Chemical',
    price: 2500,
    stockQuantity: 60,
    minStockLevel: 8,
    expiryDate: new Date('2025-07-15'),
    batchNumber: 'FLU2024001',
    category: 'Antifungal'
  },
  {
    id: 'MED015',
    name: 'Dexamethasone',
    strength: '0.5mg',
    form: 'Tablet',
    manufacturer: 'Hovid',
    price: 320,
    stockQuantity: 85,
    minStockLevel: 10,
    expiryDate: new Date('2025-09-20'),
    batchNumber: 'DEX2024001',
    category: 'Corticosteroid'
  },
  {
    id: 'MED016',
    name: 'Cetirizine',
    strength: '10mg',
    form: 'Tablet',
    manufacturer: 'UCB Pharma',
    price: 480,
    stockQuantity: 140,
    minStockLevel: 20,
    expiryDate: new Date('2025-12-10'),
    batchNumber: 'CET2024001',
    category: 'Antihistamine'
  },
  {
    id: 'MED017',
    name: 'Hydralazine',
    strength: '25mg',
    form: 'Tablet',
    manufacturer: 'Novartis',
    price: 950,
    stockQuantity: 70,
    minStockLevel: 10,
    expiryDate: new Date('2025-06-05'),
    batchNumber: 'HYD2024001',
    category: 'Vasodilator'
  },
  {
    id: 'MED018',
    name: 'Ranitidine',
    strength: '150mg',
    form: 'Tablet',
    manufacturer: 'Glaxo Wellcome',
    price: 380,
    stockQuantity: 160,
    minStockLevel: 20,
    expiryDate: new Date('2025-11-25'),
    batchNumber: 'RAN2024001',
    category: 'H2 Receptor Antagonist'
  },
  {
    id: 'MED019',
    name: 'Furosemide',
    strength: '40mg',
    form: 'Tablet',
    manufacturer: 'Sanofi',
    price: 220,
    stockQuantity: 190,
    minStockLevel: 25,
    expiryDate: new Date('2025-08-10'),
    batchNumber: 'FUR2024001',
    category: 'Diuretic'
  },
  {
    id: 'MED020',
    name: 'Vitamin B Complex',
    strength: '1 tab',
    form: 'Tablet',
    manufacturer: 'Emzor Pharmaceuticals',
    price: 150,
    stockQuantity: 350,
    minStockLevel: 40,
    expiryDate: new Date('2025-12-20'),
    batchNumber: 'VIT2024001',
    category: 'Vitamin'
  },
  {
    id: 'MED021',
    name: 'Simvastatin',
    strength: '20mg',
    form: 'Tablet',
    manufacturer: 'Mylan',
    price: 1100,
    stockQuantity: 95,
    minStockLevel: 12,
    expiryDate: new Date('2025-05-30'),
    batchNumber: 'SIM2024001',
    category: 'Statin'
  },
  {
    id: 'MED022',
    name: 'Tramadol',
    strength: '50mg',
    form: 'Capsule',
    manufacturer: 'Johnson & Johnson',
    price: 750,
    stockQuantity: 55,
    minStockLevel: 8,
    expiryDate: new Date('2025-07-20'),
    batchNumber: 'TRA2024001',
    category: 'Opioid Analgesic'
  },
  {
    id: 'MED023',
    name: 'Captopril',
    strength: '25mg',
    form: 'Tablet',
    manufacturer: 'Abbott',
    price: 680,
    stockQuantity: 125,
    minStockLevel: 15,
    expiryDate: new Date('2025-09-05'),
    batchNumber: 'CAP2024001',
    category: 'ACE Inhibitor'
  },
  {
    id: 'MED024',
    name: 'Ferrous Sulfate',
    strength: '200mg',
    form: 'Tablet',
    manufacturer: 'Pharma-Deko',
    price: 280,
    stockQuantity: 220,
    minStockLevel: 30,
    expiryDate: new Date('2025-11-15'),
    batchNumber: 'FER2024001',
    category: 'Iron Supplement'
  },
  {
    id: 'MED025',
    name: 'Diclofenac',
    strength: '50mg',
    form: 'Tablet',
    manufacturer: 'Novartis',
    price: 420,
    stockQuantity: 180,
    minStockLevel: 25,
    expiryDate: new Date('2025-10-05'),
    batchNumber: 'DIC2024001',
    category: 'NSAID'
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
  
  return mockMedications.filter(med => med.expiryDate <= thresholdDate);
};