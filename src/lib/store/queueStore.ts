'use client';

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export type QueueStatus = 'waiting' | 'called' | 'in-service' | 'completed' | 'no-show';
export type Priority = 'normal' | 'urgent' | 'emergency';
export type Department = 'general' | 'emergency' | 'pediatrics' | 'cardiology' | 'orthopedics' | 'radiology';

export interface QueueItem {
  id: string;
  queueNumber: number;
  patientId: string;
  patientName: string;
  department: Department;
  serviceType: string;
  status: QueueStatus;
  priority: Priority;
  estimatedWaitTime: number; // in minutes
  actualWaitTime?: number;
  calledAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string; // doctor/staff ID
  notes?: string;
}

export interface QueueStats {
  totalWaiting: number;
  totalInService: number;
  totalCompleted: number;
  averageWaitTime: number;
  longestWaitTime: number;
}

export interface DepartmentQueue {
  department: Department;
  items: QueueItem[];
  currentNumber: number;
  lastCalledNumber?: number;
  estimatedWaitPerPatient: number; // minutes
}

interface QueueState {
  // Queue data
  queues: Record<Department, QueueItem[]>;
  currentNumbers: Record<Department, number>;
  lastCalledNumbers: Record<Department, number>;
  
  // Real-time settings
  isRealTimeEnabled: boolean;
  updateInterval: number;
  
  // Notifications
  notifications: Array<{
    id: string;
    type: 'called' | 'completed' | 'urgent';
    message: string;
    queueItem: QueueItem;
    timestamp: string;
    read: boolean;
  }>;
  
  // Audio settings
  audioEnabled: boolean;
  announcementVoice: string;
  
  // Actions
  addToQueue: (item: Omit<QueueItem, 'id' | 'queueNumber' | 'createdAt' | 'updatedAt'>) => QueueItem;
  updateQueueItem: (id: string, updates: Partial<QueueItem>) => void;
  callNextPatient: (department: Department, assignedTo?: string) => QueueItem | null;
  markAsCompleted: (id: string) => void;
  markAsNoShow: (id: string) => void;
  removeFromQueue: (id: string) => void;
  
  // Real-time functions
  startRealTimeUpdates: () => void;
  stopRealTimeUpdates: () => void;
  
  // Statistics
  getQueueStats: (department?: Department) => QueueStats;
  getDepartmentQueues: () => DepartmentQueue[];
  getPatientPosition: (patientId: string, department: Department) => number;
  getEstimatedWaitTime: (patientId: string, department: Department) => number;
  
  // Notifications
  addNotification: (notification: Omit<QueueState['notifications'][0], 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  
  // Audio announcements
  playAnnouncement: (queueItem: QueueItem) => void;
  toggleAudio: () => void;
}

// Simulated real-time update interval
let realTimeInterval: NodeJS.Timeout | null = null;

export const useQueueStore = create<QueueState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    queues: {
      general: [],
      emergency: [],
      pediatrics: [],
      cardiology: [],
      orthopedics: [],
      radiology: []
    },
    currentNumbers: {
      general: 1,
      emergency: 1,
      pediatrics: 1,
      cardiology: 1,
      orthopedics: 1,
      radiology: 1
    },
    lastCalledNumbers: {
      general: 0,
      emergency: 0,
      pediatrics: 0,
      cardiology: 0,
      orthopedics: 0,
      radiology: 0
    },
    isRealTimeEnabled: false,
    updateInterval: 5000, // 5 seconds
    notifications: [],
    audioEnabled: true,
    announcementVoice: 'en-US',

    // Add patient to queue
    addToQueue: (item) => {
      const state = get();
      const department = item.department;
      const queueNumber = state.currentNumbers[department];
      
      const newQueueItem: QueueItem = {
        ...item,
        id: `queue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        queueNumber,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        estimatedWaitTime: state.queues[department].length * 15 + 10 // Base estimate: 15 min per patient + 10 min buffer
      };

      set((state) => ({
        queues: {
          ...state.queues,
          [department]: [...state.queues[department], newQueueItem]
        },
        currentNumbers: {
          ...state.currentNumbers,
          [department]: state.currentNumbers[department] + 1
        }
      }));

      // Add notification
      get().addNotification({
        type: item.priority === 'emergency' ? 'urgent' : 'called',
        message: `Patient ${item.patientName} added to ${department} queue (#${queueNumber})`,
        queueItem: newQueueItem
      });

      return newQueueItem;
    },

    // Update queue item
    updateQueueItem: (id, updates) => {
      set((state) => {
        const newQueues = { ...state.queues };
        
        for (const department in newQueues) {
          const queueIndex = newQueues[department as Department].findIndex(item => item.id === id);
          if (queueIndex !== -1) {
            newQueues[department as Department][queueIndex] = {
              ...newQueues[department as Department][queueIndex],
              ...updates,
              updatedAt: new Date().toISOString()
            };
            break;
          }
        }
        
        return { queues: newQueues };
      });
    },

    // Call next patient
    callNextPatient: (department, assignedTo) => {
      const state = get();
      const waitingPatients = state.queues[department].filter(item => item.status === 'waiting');
      
      if (waitingPatients.length === 0) return null;

      // Prioritize emergency patients, then by queue number
      const nextPatient = waitingPatients.sort((a, b) => {
        if (a.priority === 'emergency' && b.priority !== 'emergency') return -1;
        if (b.priority === 'emergency' && a.priority !== 'emergency') return 1;
        if (a.priority === 'urgent' && b.priority === 'normal') return -1;
        if (b.priority === 'urgent' && a.priority === 'normal') return 1;
        return a.queueNumber - b.queueNumber;
      })[0];

      const calledAt = new Date().toISOString();
      const actualWaitTime = Math.floor((new Date().getTime() - new Date(nextPatient.createdAt).getTime()) / (1000 * 60));

      // Update patient status
      get().updateQueueItem(nextPatient.id, {
        status: 'called',
        calledAt,
        actualWaitTime,
        assignedTo
      });

      // Update last called number
      set((state) => ({
        lastCalledNumbers: {
          ...state.lastCalledNumbers,
          [department]: nextPatient.queueNumber
        }
      }));

      // Add notification
      get().addNotification({
        type: 'called',
        message: `Calling ${nextPatient.patientName} - Queue #${nextPatient.queueNumber} to ${department}`,
        queueItem: { ...nextPatient, status: 'called', calledAt, actualWaitTime, assignedTo }
      });

      // Play audio announcement
      if (state.audioEnabled) {
        get().playAnnouncement({ ...nextPatient, status: 'called', calledAt, actualWaitTime, assignedTo });
      }

      return { ...nextPatient, status: 'called', calledAt, actualWaitTime, assignedTo };
    },

    // Mark as completed
    markAsCompleted: (id) => {
      const completedAt = new Date().toISOString();
      get().updateQueueItem(id, {
        status: 'completed',
        completedAt
      });

      // Find the item to add notification
      const state = get();
      for (const department in state.queues) {
        const item = state.queues[department as Department].find(q => q.id === id);
        if (item) {
          get().addNotification({
            type: 'completed',
            message: `${item.patientName} consultation completed`,
            queueItem: { ...item, status: 'completed', completedAt }
          });
          break;
        }
      }
    },

    // Mark as no-show
    markAsNoShow: (id) => {
      get().updateQueueItem(id, { status: 'no-show' });
    },

    // Remove from queue
    removeFromQueue: (id) => {
      set((state) => {
        const newQueues = { ...state.queues };
        
        for (const department in newQueues) {
          newQueues[department as Department] = newQueues[department as Department].filter(item => item.id !== id);
        }
        
        return { queues: newQueues };
      });
    },

    // Real-time updates
    startRealTimeUpdates: () => {
      if (realTimeInterval) return;

      set({ isRealTimeEnabled: true });
      
      const currentState = get();
      realTimeInterval = setInterval(() => {
        const state = get();
        
        // Only update if real-time is still enabled
        if (!state.isRealTimeEnabled) {
          if (realTimeInterval) {
            clearInterval(realTimeInterval);
            realTimeInterval = null;
          }
          return;
        }
        
        // Simulate random updates (patients arriving, status changes, etc.)
        // Update estimated wait times
        const newQueues = { ...state.queues };
        
        for (const department in newQueues) {
          const dept = department as Department;
          newQueues[dept] = newQueues[dept].map(item => {
            if (item.status === 'waiting') {
              const position = newQueues[dept].filter(q => 
                q.status === 'waiting' && q.queueNumber < item.queueNumber
              ).length;
              const newEstimatedWaitTime = Math.max(5, position * 15 + Math.random() * 10);
              
              return {
                ...item,
                estimatedWaitTime: Math.round(newEstimatedWaitTime),
                updatedAt: new Date().toISOString()
              };
            }
            return item;
          });
        }
        
        set({ queues: newQueues });
      }, currentState.updateInterval);
    },

    stopRealTimeUpdates: () => {
      if (realTimeInterval) {
        clearInterval(realTimeInterval);
        realTimeInterval = null;
      }
      set({ isRealTimeEnabled: false });
    },

    // Statistics
    getQueueStats: (department) => {
      const state = get();
      const allItems = department 
        ? state.queues[department]
        : Object.values(state.queues).flat();

      const waiting = allItems.filter(item => item.status === 'waiting');
      const inService = allItems.filter(item => item.status === 'in-service' || item.status === 'called');
      const completed = allItems.filter(item => item.status === 'completed');

      const completedWithWaitTime = completed.filter(item => item.actualWaitTime !== undefined);
      const averageWaitTime = completedWithWaitTime.length > 0
        ? completedWithWaitTime.reduce((sum, item) => sum + (item.actualWaitTime || 0), 0) / completedWithWaitTime.length
        : 0;

      const longestWaitTime = waiting.length > 0
        ? Math.max(...waiting.map(item => 
            Math.floor((new Date().getTime() - new Date(item.createdAt).getTime()) / (1000 * 60))
          ))
        : 0;

      return {
        totalWaiting: waiting.length,
        totalInService: inService.length,
        totalCompleted: completed.length,
        averageWaitTime: Math.round(averageWaitTime),
        longestWaitTime
      };
    },

    getDepartmentQueues: () => {
      const state = get();
      return Object.entries(state.queues).map(([dept, items]) => ({
        department: dept as Department,
        items: items.filter(item => ['waiting', 'called', 'in-service'].includes(item.status)),
        currentNumber: state.currentNumbers[dept as Department],
        lastCalledNumber: state.lastCalledNumbers[dept as Department],
        estimatedWaitPerPatient: 15 // minutes
      }));
    },

    getPatientPosition: (patientId, department) => {
      const state = get();
      const waitingItems = state.queues[department]
        .filter(item => item.status === 'waiting')
        .sort((a, b) => a.queueNumber - b.queueNumber);
      
      const patientIndex = waitingItems.findIndex(item => item.patientId === patientId);
      return patientIndex + 1; // 1-based position
    },

    getEstimatedWaitTime: (patientId, department) => {
      const state = get();
      const position = get().getPatientPosition(patientId, department);
      const inServiceCount = state.queues[department].filter(item => 
        item.status === 'in-service' || item.status === 'called'
      ).length;
      
      return (position + inServiceCount - 1) * 15; // 15 minutes per patient
    },

    // Notifications
    addNotification: (notification) => {
      const newNotification = {
        ...notification,
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        read: false
      };

      set((state) => ({
        notifications: [newNotification, ...state.notifications].slice(0, 50) // Keep last 50
      }));
    },

    markNotificationAsRead: (id) => {
      set((state) => ({
        notifications: state.notifications.map(notif =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      }));
    },

    clearNotifications: () => {
      set({ notifications: [] });
    },

    // Audio announcements
    playAnnouncement: (queueItem) => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(
          `Queue number ${queueItem.queueNumber}, ${queueItem.patientName}, please proceed to ${queueItem.department}`
        );
        utterance.lang = get().announcementVoice;
        utterance.rate = 0.8;
        utterance.pitch = 1;
        
        window.speechSynthesis.speak(utterance);
      }
    },

    toggleAudio: () => {
      set((state) => ({ audioEnabled: !state.audioEnabled }));
    }
  }))
);

// Initialize with some mock data
if (typeof window !== 'undefined') {
  const mockQueueItems: Omit<QueueItem, 'id' | 'queueNumber' | 'createdAt' | 'updatedAt'>[] = [
    {
      patientId: 'patient-001',
      patientName: 'John Doe',
      department: 'general',
      serviceType: 'General Consultation',
      status: 'waiting',
      priority: 'normal',
      estimatedWaitTime: 20
    },
    {
      patientId: 'patient-002',
      patientName: 'Jane Smith',
      department: 'cardiology',
      serviceType: 'Cardiology Consultation',
      status: 'waiting',
      priority: 'urgent',
      estimatedWaitTime: 15
    },
    {
      patientId: 'patient-003',
      patientName: 'Bob Johnson',
      department: 'emergency',
      serviceType: 'Emergency Care',
      status: 'in-service',
      priority: 'emergency',
      estimatedWaitTime: 0,
      assignedTo: 'Dr. Emergency'
    }
  ];

  // Add mock data on store initialization
  setTimeout(() => {
    const store = useQueueStore.getState();
    mockQueueItems.forEach(item => {
      store.addToQueue(item);
    });
  }, 100);
}