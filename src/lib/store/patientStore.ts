import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Patient, Queue, VitalSigns, VisualAcuity } from '../types';

interface PatientState {
  patients: Patient[];
  currentPatient: Patient | null;
  searchQuery: string;
  queue: Queue[];
  vitalSigns: VitalSigns[];
  visualAcuity: VisualAcuity[];
  
  // Actions
  addPatient: (patient: Omit<Patient, 'id' | 'patientNumber' | 'createdAt'>) => void;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  setCurrentPatient: (patient: Patient | null) => void;
  searchPatients: (query: string) => Patient[];
  getPatientById: (id: string) => Patient | undefined;
  getPatientsByStatus: (status: Patient['status']) => Patient[];
  
  // Queue Management
  addToQueue: (patientId: string, department: string, priority?: 'normal' | 'urgent' | 'emergency') => void;
  updateQueueStatus: (queueId: string, status: Queue['status']) => void;
  getQueueByDepartment: (department: string) => Queue[];
  callNextPatient: (department: string) => Queue | null;
  
  // Vital Signs
  addVitalSigns: (vitalSigns: Omit<VitalSigns, 'id' | 'recordedAt'>) => void;
  getVitalSignsByPatient: (patientId: string) => VitalSigns[];
  
  // Visual Acuity
  addVisualAcuity: (visualAcuity: Omit<VisualAcuity, 'id' | 'recordedAt'>) => void;
  getVisualAcuityByPatient: (patientId: string) => VisualAcuity[];
  
  // Utility
  initializePatients: () => void;
  syncData: () => Promise<void>;
  getOfflineChanges: () => Patient[];
}

const generatePatientNumber = () => {
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString().slice(-6);
  return `HMS${year}${timestamp}`;
};

const generateId = () => {
  // Use timestamp-based ID for better consistency
  return 'id-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

const getNextQueueNumber = () => {
  // This will be implemented based on existing queue data
  return Math.floor(Math.random() * 100) + 1;
};

export const usePatientStore = create<PatientState>()(
  persist(
    (set, get) => ({
      patients: [],
      currentPatient: null,
      searchQuery: '',
      queue: [],
      vitalSigns: [],
      visualAcuity: [],

      addPatient: (patientData) => {
        const newPatient: Patient = {
          ...patientData,
          id: generateId(),
          patientNumber: generatePatientNumber(),
          createdAt: new Date().toISOString(),
          syncStatus: 'pending'
        };

        set((state) => ({
          patients: [...state.patients, newPatient]
        }));
      },

      updatePatient: (id, updates) => {
        set((state) => ({
          patients: state.patients.map(patient =>
            patient.id === id 
              ? { ...patient, ...updates, syncStatus: 'pending' }
              : patient
          )
        }));
      },

      deletePatient: (id) => {
        set((state) => ({
          patients: state.patients.filter(patient => patient.id !== id),
          currentPatient: state.currentPatient?.id === id ? null : state.currentPatient
        }));
      },

      setCurrentPatient: (patient) => {
        set({ currentPatient: patient });
      },

      searchPatients: (query) => {
        const { patients } = get();
        const lowercaseQuery = query.toLowerCase();
        return patients.filter(patient =>
          patient.firstName.toLowerCase().includes(lowercaseQuery) ||
          patient.lastName.toLowerCase().includes(lowercaseQuery) ||
          patient.patientNumber.toLowerCase().includes(lowercaseQuery) ||
          patient.phoneNumber.includes(query)
        );
      },

      getPatientById: (id) => {
        const { patients } = get();
        return patients.find(patient => patient.id === id);
      },

      getPatientsByStatus: (status) => {
        const { patients } = get();
        return patients.filter(patient => patient.status === status);
      },

      addToQueue: (patientId, department, priority = 'normal') => {
        const newQueue: Queue = {
          id: generateId(),
          patientId,
          department,
          queueNumber: getNextQueueNumber(),
          priority,
          status: 'waiting',
          createdAt: new Date().toISOString()
        };

        set((state) => {
          const updatedPatients = state.patients.map(patient =>
            patient.id === patientId
              ? { ...patient, queueNumber: newQueue.queueNumber, status: 'waiting' as const }
              : patient
          );

          return {
            queue: [...state.queue, newQueue],
            patients: updatedPatients
          };
        });
      },

      updateQueueStatus: (queueId, status) => {
        set((state) => {
          const updatedQueue = state.queue.map(q => {
            if (q.id === queueId) {
              const updates: Partial<Queue> = { status };
              if (status === 'called') updates.calledAt = new Date().toISOString();
              if (status === 'in-service') updates.servedAt = new Date().toISOString();
              if (status === 'completed') updates.completedAt = new Date().toISOString();
              return { ...q, ...updates };
            }
            return q;
          });

          const queueItem = state.queue.find(q => q.id === queueId);
          const updatedPatients = queueItem ? state.patients.map(patient =>
            patient.id === queueItem.patientId
              ? { 
                  ...patient, 
                  status: status === 'completed' ? 'completed' : 
                          status === 'in-service' ? 'in-consultation' : 'waiting'
                }
              : patient
          ) : state.patients;

          return { queue: updatedQueue, patients: updatedPatients };
        });
      },

      getQueueByDepartment: (department) => {
        const { queue } = get();
        return queue.filter(q => q.department === department && q.status !== 'completed');
      },

      callNextPatient: (department) => {
        const { queue } = get();
        const waitingQueue = queue
          .filter(q => q.department === department && q.status === 'waiting')
          .sort((a, b) => {
            const priorityOrder = { emergency: 0, urgent: 1, normal: 2 };
            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
              return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            return a.queueNumber - b.queueNumber;
          });

        if (waitingQueue.length > 0) {
          const nextPatient = waitingQueue[0];
          get().updateQueueStatus(nextPatient.id, 'called');
          return nextPatient;
        }
        return null;
      },

      addVitalSigns: (vitalSignsData) => {
        const newVitalSigns: VitalSigns = {
          ...vitalSignsData,
          id: generateId(),
          recordedAt: new Date().toISOString()
        };

        set((state) => ({
          vitalSigns: [...state.vitalSigns, newVitalSigns]
        }));
      },

      getVitalSignsByPatient: (patientId) => {
        const { vitalSigns } = get();
        return vitalSigns.filter(vs => vs.patientId === patientId);
      },

      addVisualAcuity: (visualAcuityData) => {
        const newVisualAcuity: VisualAcuity = {
          ...visualAcuityData,
          id: generateId(),
          recordedAt: new Date().toISOString()
        };

        set((state) => ({
          visualAcuity: [...state.visualAcuity, newVisualAcuity]
        }));
      },

      getVisualAcuityByPatient: (patientId) => {
        const { visualAcuity } = get();
        return visualAcuity.filter(va => va.patientId === patientId);
      },

      initializePatients: () => {
        // Initialize with mock patients
        const mockPatients = [
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
            status: 'waiting' as const,
            createdAt: '2025-01-30T08:00:00Z',
            syncStatus: 'synced' as const
          }
        ];
        set({ patients: mockPatients });
      },

      syncData: async () => {
        set((state) => ({
          patients: state.patients.map(patient => ({
            ...patient,
            syncStatus: 'synced' as const
          }))
        }));
      },

      getOfflineChanges: () => {
        const { patients } = get();
        return patients.filter(patient => patient.syncStatus === 'pending');
      }
    }),
    {
      name: 'patient-store',
      partialize: (state) => ({
        patients: state.patients,
        queue: state.queue,
        vitalSigns: state.vitalSigns,
        visualAcuity: state.visualAcuity
      })
    }
  )
);