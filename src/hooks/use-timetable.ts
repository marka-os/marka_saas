import { useCallback, useMemo } from 'react';
import { useTimetableStore } from '@marka/stores/timetable-store';
import { useToast } from '@marka/hooks/use-toast';
import type { TimetableSlot } from '@marka/lib/mockData';

export function useTimetable(classId?: string, streamId?: string) {
  const store = useTimetableStore();
  const { toast } = useToast();

  const filteredSlots = useMemo(() => {
    return store.getSlots(classId, streamId);
  }, [store.slots, classId, streamId, store.getSlots]);

  const addSlot = useCallback(async (slotData: Omit<TimetableSlot, 'id' | 'teacher'>) => {
    try {
      const newSlot = await store.addSlot(slotData);
      toast({
        title: 'Success',
        description: 'Lesson added to timetable',
      });
      return newSlot;
    } catch (error) {
      if ((error as Error).message === 'Timetable conflict') {
        toast({
          title: 'Conflict Detected',
          description: `A lesson already exists for ${slotData.day} period ${slotData.period}`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to add lesson',
          variant: 'destructive',
        });
      }
      throw error;
    }
  }, [store, toast]);

  const updateSlot = useCallback(async (id: string, slotData: Partial<TimetableSlot>) => {
    try {
      await store.updateSlot(id, slotData);
      toast({
        title: 'Success',
        description: 'Lesson updated successfully',
      });
    } catch (error) {
      if ((error as Error).message === 'Timetable conflict') {
        const existingSlot = store.slots.find(s => s.id === id);
        const updatedData = { ...existingSlot, ...slotData };
        toast({
          title: 'Conflict Detected',
          description: `A lesson already exists for ${updatedData.day} period ${updatedData.period}`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update lesson',
          variant: 'destructive',
        });
      }
      throw error;
    }
  }, [store, toast]);

  const deleteSlot = useCallback(async (id: string) => {
    try {
      await store.deleteSlot(id);
      toast({
        title: 'Success',
        description: 'Lesson removed from timetable',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete lesson',
        variant: 'destructive',
      });
      throw error;
    }
  }, [store, toast]);

  const checkConflict = useCallback((day: string, period: number, excludeId?: string) => {
    return store.checkConflict(day, period, classId, streamId, excludeId);
  }, [store, classId, streamId]);

  return {
    slots: filteredSlots,
    allSlots: store.slots,
    isLoading: store.isLoading,
    addSlot,
    updateSlot,
    deleteSlot,
    checkConflict,
  };
}
