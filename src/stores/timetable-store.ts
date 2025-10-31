import { create } from 'zustand';
import { mockTimetable, mockTeachers, type TimetableSlot } from '@marka/lib/mockData';

interface TimetableState {
  slots: TimetableSlot[];
  isLoading: boolean;
  addSlot: (slotData: Omit<TimetableSlot, 'id' | 'teacher'>) => Promise<TimetableSlot>;
  updateSlot: (id: string, slotData: Partial<TimetableSlot>) => Promise<void>;
  deleteSlot: (id: string) => Promise<void>;
  getSlots: (classId?: string, streamId?: string) => TimetableSlot[];
  checkConflict: (day: string, period: number, classId?: string, streamId?: string, excludeId?: string) => boolean;
}

export const useTimetableStore = create<TimetableState>((set, get) => ({
  slots: mockTimetable,
  isLoading: false,

  addSlot: async (slotData) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const conflicts = get().slots.filter(slot => 
        slot.classId === slotData.classId &&
        slot.streamId === slotData.streamId &&
        slot.day === slotData.day &&
        slot.period === slotData.period
      );
      
      if (conflicts.length > 0) {
        throw new Error('Timetable conflict');
      }
      
      const teacher = mockTeachers.find(t => t.id === slotData.teacherId);
      
      const newSlot: TimetableSlot = {
        ...slotData,
        id: `tt${Date.now()}`,
        teacher,
      };
      
      set(state => ({ slots: [...state.slots, newSlot] }));
      return newSlot;
    } finally {
      set({ isLoading: false });
    }
  },

  updateSlot: async (id, slotData) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const existingSlot = get().slots.find(s => s.id === id);
      if (!existingSlot) throw new Error('Slot not found');
      
      const updatedData = { ...existingSlot, ...slotData };
      
      const conflicts = get().slots.filter(slot => 
        slot.id !== id &&
        slot.classId === updatedData.classId &&
        slot.streamId === updatedData.streamId &&
        slot.day === updatedData.day &&
        slot.period === updatedData.period
      );
      
      if (conflicts.length > 0) {
        throw new Error('Timetable conflict');
      }
      
      set(state => ({
        slots: state.slots.map(slot => {
          if (slot.id !== id) return slot;
          
          const teacher = slotData.teacherId 
            ? mockTeachers.find(t => t.id === slotData.teacherId)
            : slot.teacher;
          
          return {
            ...slot,
            ...slotData,
            teacher,
          };
        })
      }));
    } finally {
      set({ isLoading: false });
    }
  },

  deleteSlot: async (id) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set(state => ({ slots: state.slots.filter(slot => slot.id !== id) }));
    } finally {
      set({ isLoading: false });
    }
  },

  getSlots: (classId?, streamId?) => {
    return get().slots.filter(slot => {
      if (!classId) return true;
      if (slot.classId !== classId) return false;
      if (streamId && slot.streamId !== streamId) return false;
      return true;
    });
  },

  checkConflict: (day, period, classId?, streamId?, excludeId?) => {
    const slots = get().getSlots(classId, streamId);
    return slots.some(slot => 
      slot.id !== excludeId &&
      slot.day === day &&
      slot.period === period
    );
  },
}));
