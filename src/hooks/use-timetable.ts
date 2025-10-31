import { useState, useCallback } from 'react';
import { mockTimetable, mockTeachers, type TimetableSlot } from '@marka/lib/mockData';
import { useToast } from '@marka/hooks/use-toast';

export function useTimetable(classId?: string, streamId?: string) {
  const [slots, setSlots] = useState<TimetableSlot[]>(mockTimetable);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const filteredSlots = slots.filter(slot => {
    if (!classId) return true;
    if (slot.classId !== classId) return false;
    if (streamId && slot.streamId !== streamId) return false;
    return true;
  });

  const addSlot = useCallback(async (slotData: Omit<TimetableSlot, 'id' | 'teacher'>) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const conflicts = slots.filter(slot => 
        slot.classId === slotData.classId &&
        slot.streamId === slotData.streamId &&
        slot.day === slotData.day &&
        slot.period === slotData.period
      );
      
      if (conflicts.length > 0) {
        toast({
          title: 'Conflict Detected',
          description: `A lesson already exists for ${slotData.day} period ${slotData.period}`,
          variant: 'destructive',
        });
        throw new Error('Timetable conflict');
      }
      
      const teacher = mockTeachers.find(t => t.id === slotData.teacherId);
      
      const newSlot: TimetableSlot = {
        ...slotData,
        id: `tt${Date.now()}`,
        teacher,
      };
      
      setSlots(prev => [...prev, newSlot]);
      
      toast({
        title: 'Success',
        description: 'Lesson added to timetable',
      });
      
      return newSlot;
    } catch (error) {
      if ((error as Error).message !== 'Timetable conflict') {
        toast({
          title: 'Error',
          description: 'Failed to add lesson',
          variant: 'destructive',
        });
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [slots, toast]);

  const updateSlot = useCallback(async (id: string, slotData: Partial<TimetableSlot>) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const existingSlot = slots.find(s => s.id === id);
      if (!existingSlot) throw new Error('Slot not found');
      
      const updatedData = { ...existingSlot, ...slotData };
      
      const conflicts = slots.filter(slot => 
        slot.id !== id &&
        slot.classId === updatedData.classId &&
        slot.streamId === updatedData.streamId &&
        slot.day === updatedData.day &&
        slot.period === updatedData.period
      );
      
      if (conflicts.length > 0) {
        toast({
          title: 'Conflict Detected',
          description: `A lesson already exists for ${updatedData.day} period ${updatedData.period}`,
          variant: 'destructive',
        });
        throw new Error('Timetable conflict');
      }
      
      setSlots(prev => prev.map(slot => {
        if (slot.id !== id) return slot;
        
        const teacher = slotData.teacherId 
          ? mockTeachers.find(t => t.id === slotData.teacherId)
          : slot.teacher;
        
        return {
          ...slot,
          ...slotData,
          teacher,
        };
      }));
      
      toast({
        title: 'Success',
        description: 'Lesson updated successfully',
      });
    } catch (error) {
      if ((error as Error).message !== 'Timetable conflict') {
        toast({
          title: 'Error',
          description: 'Failed to update lesson',
          variant: 'destructive',
        });
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [slots, toast]);

  const deleteSlot = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSlots(prev => prev.filter(slot => slot.id !== id));
      
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
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const checkConflict = useCallback((day: string, period: number, excludeId?: string) => {
    return filteredSlots.some(slot => 
      slot.id !== excludeId &&
      slot.day === day &&
      slot.period === period
    );
  }, [filteredSlots]);

  return {
    slots: filteredSlots,
    allSlots: slots,
    isLoading,
    addSlot,
    updateSlot,
    deleteSlot,
    checkConflict,
  };
}
