import { useCallback } from 'react';
import { useClassesStore, useTeachersStore } from '@marka/stores/classes-store';
import { useToast } from '@marka/hooks/use-toast';
import type { Class, Stream } from '@marka/lib/mockData';

export function useClasses() {
  const store = useClassesStore();
  const { toast } = useToast();

  const addClass = useCallback(async (classData: Omit<Class, 'id' | 'createdAt' | 'totalStudents'>) => {
    try {
      const newClass = await store.addClass(classData);
      toast({
        title: 'Success',
        description: 'Class created successfully',
      });
      return newClass;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create class',
        variant: 'destructive',
      });
      throw error;
    }
  }, [store, toast]);

  const updateClass = useCallback(async (id: string, classData: Partial<Class>) => {
    try {
      await store.updateClass(id, classData);
      toast({
        title: 'Success',
        description: 'Class updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update class',
        variant: 'destructive',
      });
      throw error;
    }
  }, [store, toast]);

  const deleteClass = useCallback(async (id: string) => {
    try {
      await store.deleteClass(id);
      toast({
        title: 'Success',
        description: 'Class deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete class',
        variant: 'destructive',
      });
      throw error;
    }
  }, [store, toast]);

  const assignTeacher = useCallback(async (classId: string, streamId: string | undefined, teacherId: string) => {
    try {
      await store.assignTeacher(classId, streamId, teacherId);
      toast({
        title: 'Success',
        description: 'Teacher assigned successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to assign teacher',
        variant: 'destructive',
      });
      throw error;
    }
  }, [store, toast]);

  const addStream = useCallback(async (classId: string, stream: Omit<Stream, 'id' | 'classId'>) => {
    try {
      const newStream = await store.addStream(classId, stream);
      toast({
        title: 'Success',
        description: 'Stream added successfully',
      });
      return newStream;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add stream',
        variant: 'destructive',
      });
      throw error;
    }
  }, [store, toast]);

  const deleteStream = useCallback(async (classId: string, streamId: string) => {
    try {
      await store.deleteStream(classId, streamId);
      toast({
        title: 'Success',
        description: 'Stream deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete stream',
        variant: 'destructive',
      });
      throw error;
    }
  }, [store, toast]);

  return {
    classes: store.classes,
    isLoading: store.isLoading,
    addClass,
    updateClass,
    deleteClass,
    assignTeacher,
    addStream,
    deleteStream,
    getClassById: store.getClassById,
  };
}

export function useTeachers() {
  return useTeachersStore();
}
