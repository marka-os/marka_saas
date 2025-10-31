import { create } from 'zustand';
import { mockClasses, mockTeachers, type Class, type Stream, type Teacher } from '@marka/lib/mockData';

interface ClassesState {
  classes: Class[];
  isLoading: boolean;
  addClass: (classData: Omit<Class, 'id' | 'createdAt' | 'totalStudents'>) => Promise<Class>;
  updateClass: (id: string, classData: Partial<Class>) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;
  assignTeacher: (classId: string, streamId: string | undefined, teacherId: string) => Promise<void>;
  addStream: (classId: string, stream: Omit<Stream, 'id' | 'classId'>) => Promise<Stream>;
  deleteStream: (classId: string, streamId: string) => Promise<void>;
  getClassById: (id: string) => Class | undefined;
}

export const useClassesStore = create<ClassesState>((set, get) => ({
  classes: mockClasses,
  isLoading: false,

  addClass: async (classData) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newClass: Class = {
        ...classData,
        id: `c${Date.now()}`,
        totalStudents: classData.streams.reduce((sum, stream) => sum + stream.studentCount, 0),
        createdAt: new Date().toISOString(),
      };
      
      set(state => ({ classes: [...state.classes, newClass] }));
      return newClass;
    } finally {
      set({ isLoading: false });
    }
  },

  updateClass: async (id, classData) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        classes: state.classes.map(cls => 
          cls.id === id 
            ? { 
                ...cls, 
                ...classData,
                totalStudents: classData.streams 
                  ? classData.streams.reduce((sum, stream) => sum + stream.studentCount, 0)
                  : cls.totalStudents
              } 
            : cls
        )
      }));
    } finally {
      set({ isLoading: false });
    }
  },

  deleteClass: async (id) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set(state => ({ classes: state.classes.filter(cls => cls.id !== id) }));
    } finally {
      set({ isLoading: false });
    }
  },

  assignTeacher: async (classId, streamId, teacherId) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const teacher = mockTeachers.find(t => t.id === teacherId);
      
      set(state => ({
        classes: state.classes.map(cls => {
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
        })
      }));
    } finally {
      set({ isLoading: false });
    }
  },

  addStream: async (classId, stream) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newStream: Stream = {
        ...stream,
        id: `s${Date.now()}`,
        classId,
        teacher: stream.teacherId ? mockTeachers.find(t => t.id === stream.teacherId) : undefined,
      };
      
      set(state => ({
        classes: state.classes.map(cls => {
          if (cls.id !== classId) return cls;
          
          return {
            ...cls,
            streams: [...cls.streams, newStream],
            totalStudents: cls.totalStudents + newStream.studentCount,
          };
        })
      }));
      
      return newStream;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteStream: async (classId, streamId) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        classes: state.classes.map(cls => {
          if (cls.id !== classId) return cls;
          
          const stream = cls.streams.find(s => s.id === streamId);
          const studentCount = stream?.studentCount || 0;
          
          return {
            ...cls,
            streams: cls.streams.filter(s => s.id !== streamId),
            totalStudents: cls.totalStudents - studentCount,
          };
        })
      }));
    } finally {
      set({ isLoading: false });
    }
  },

  getClassById: (id) => {
    return get().classes.find(cls => cls.id === id);
  },
}));

interface TeachersState {
  teachers: Teacher[];
}

export const useTeachersStore = create<TeachersState>(() => ({
  teachers: mockTeachers,
}));
