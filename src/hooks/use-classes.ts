import { useState, useCallback } from 'react';
import { mockClasses, mockTeachers, type Class, type Stream, type Teacher } from '@marka/lib/mockData';
import { useToast } from '@marka/hooks/use-toast';

export function useClasses() {
  const [classes, setClasses] = useState<Class[]>(mockClasses);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const addClass = useCallback(async (classData: Omit<Class, 'id' | 'createdAt' | 'totalStudents'>) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newClass: Class = {
        ...classData,
        id: `c${Date.now()}`,
        totalStudents: classData.streams.reduce((sum, stream) => sum + stream.studentCount, 0),
        createdAt: new Date().toISOString(),
      };
      
      setClasses(prev => [...prev, newClass]);
      
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
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const updateClass = useCallback(async (id: string, classData: Partial<Class>) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setClasses(prev => prev.map(cls => 
        cls.id === id 
          ? { 
              ...cls, 
              ...classData,
              totalStudents: classData.streams 
                ? classData.streams.reduce((sum, stream) => sum + stream.studentCount, 0)
                : cls.totalStudents
            } 
          : cls
      ));
      
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
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const deleteClass = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setClasses(prev => prev.filter(cls => cls.id !== id));
      
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
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const assignTeacher = useCallback(async (classId: string, streamId: string | undefined, teacherId: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const teacher = mockTeachers.find(t => t.id === teacherId);
      
      setClasses(prev => prev.map(cls => {
        if (cls.id !== classId) return cls;
        
        if (!streamId) {
          return {
            ...cls,
            classTeacherId: teacherId,
            classTeacher: teacher,
          };
        }
        
        return {
          ...cls,
          streams: cls.streams.map(stream => 
            stream.id === streamId
              ? { ...stream, teacherId, teacher }
              : stream
          ),
        };
      }));
      
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
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const addStream = useCallback(async (classId: string, stream: Omit<Stream, 'id' | 'classId'>) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newStream: Stream = {
        ...stream,
        id: `s${Date.now()}`,
        classId,
        teacher: stream.teacherId ? mockTeachers.find(t => t.id === stream.teacherId) : undefined,
      };
      
      setClasses(prev => prev.map(cls => {
        if (cls.id !== classId) return cls;
        
        return {
          ...cls,
          streams: [...cls.streams, newStream],
          totalStudents: cls.totalStudents + newStream.studentCount,
        };
      }));
      
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
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const deleteStream = useCallback(async (classId: string, streamId: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setClasses(prev => prev.map(cls => {
        if (cls.id !== classId) return cls;
        
        const stream = cls.streams.find(s => s.id === streamId);
        const studentCount = stream?.studentCount || 0;
        
        return {
          ...cls,
          streams: cls.streams.filter(s => s.id !== streamId),
          totalStudents: cls.totalStudents - studentCount,
        };
      }));
      
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
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const getClassById = useCallback((id: string) => {
    return classes.find(cls => cls.id === id);
  }, [classes]);

  return {
    classes,
    isLoading,
    addClass,
    updateClass,
    deleteClass,
    assignTeacher,
    addStream,
    deleteStream,
    getClassById,
  };
}

export function useTeachers() {
  const [teachers] = useState<Teacher[]>(mockTeachers);
  
  return {
    teachers,
  };
}
