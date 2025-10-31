export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject?: string;
}

export interface Stream {
  id: string;
  name: string;
  classId: string;
  teacherId?: string;
  teacher?: Teacher;
  capacity: number;
  studentCount: number;
}

export interface Class {
  id: string;
  name: string;
  level: string;
  description?: string;
  streams: Stream[];
  classTeacherId?: string;
  classTeacher?: Teacher;
  totalStudents: number;
  createdAt: string;
}

export interface TimetableSlot {
  id: string;
  classId: string;
  streamId?: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  period: number;
  subject: string;
  teacherId: string;
  teacher?: Teacher;
  startTime: string;
  endTime: string;
}

export const mockTeachers: Teacher[] = [
  { id: 't1', name: 'John Kamau', email: 'john.kamau@school.ug', phone: '+256 700 123 456', subject: 'Mathematics' },
  { id: 't2', name: 'Sarah Nakato', email: 'sarah.nakato@school.ug', phone: '+256 700 123 457', subject: 'English' },
  { id: 't3', name: 'David Okello', email: 'david.okello@school.ug', phone: '+256 700 123 458', subject: 'Science' },
  { id: 't4', name: 'Grace Nambi', email: 'grace.nambi@school.ug', phone: '+256 700 123 459', subject: 'Social Studies' },
  { id: 't5', name: 'Peter Mwesigwa', email: 'peter.mwesigwa@school.ug', phone: '+256 700 123 460', subject: 'ICT' },
  { id: 't6', name: 'Mary Auma', email: 'mary.auma@school.ug', phone: '+256 700 123 461', subject: 'Biology' },
  { id: 't7', name: 'James Kato', email: 'james.kato@school.ug', phone: '+256 700 123 462', subject: 'Chemistry' },
  { id: 't8', name: 'Rose Nalongo', email: 'rose.nalongo@school.ug', phone: '+256 700 123 463', subject: 'Physics' },
  { id: 't9', name: 'Robert Mukasa', email: 'robert.mukasa@school.ug', phone: '+256 700 123 464', subject: 'History' },
  { id: 't10', name: 'Diana Namugga', email: 'diana.namugga@school.ug', phone: '+256 700 123 465', subject: 'Geography' },
];

export const mockClasses: Class[] = [
  {
    id: 'c1',
    name: 'Senior 1',
    level: 'O-Level',
    description: 'First year of secondary education',
    classTeacherId: 't1',
    classTeacher: mockTeachers[0],
    totalStudents: 150,
    createdAt: '2024-01-15',
    streams: [
      { id: 's1', name: 'A', classId: 'c1', teacherId: 't1', teacher: mockTeachers[0], capacity: 50, studentCount: 48 },
      { id: 's2', name: 'B', classId: 'c1', teacherId: 't2', teacher: mockTeachers[1], capacity: 50, studentCount: 50 },
      { id: 's3', name: 'C', classId: 'c1', teacherId: 't3', teacher: mockTeachers[2], capacity: 50, studentCount: 52 },
    ],
  },
  {
    id: 'c2',
    name: 'Senior 2',
    level: 'O-Level',
    description: 'Second year of secondary education',
    classTeacherId: 't4',
    classTeacher: mockTeachers[3],
    totalStudents: 120,
    createdAt: '2024-01-15',
    streams: [
      { id: 's4', name: 'A', classId: 'c2', teacherId: 't4', teacher: mockTeachers[3], capacity: 50, studentCount: 45 },
      { id: 's5', name: 'B', classId: 'c2', teacherId: 't5', teacher: mockTeachers[4], capacity: 50, studentCount: 47 },
      { id: 's6', name: 'C', classId: 'c2', teacherId: 't6', teacher: mockTeachers[5], capacity: 50, studentCount: 28 },
    ],
  },
  {
    id: 'c3',
    name: 'Senior 3',
    level: 'O-Level',
    description: 'Third year of secondary education',
    classTeacherId: 't7',
    classTeacher: mockTeachers[6],
    totalStudents: 90,
    createdAt: '2024-01-15',
    streams: [
      { id: 's7', name: 'A', classId: 'c3', teacherId: 't7', teacher: mockTeachers[6], capacity: 45, studentCount: 44 },
      { id: 's8', name: 'B', classId: 'c3', teacherId: 't8', teacher: mockTeachers[7], capacity: 45, studentCount: 46 },
    ],
  },
  {
    id: 'c4',
    name: 'Senior 4',
    level: 'O-Level',
    description: 'Fourth year - UCE preparation',
    classTeacherId: 't9',
    classTeacher: mockTeachers[8],
    totalStudents: 75,
    createdAt: '2024-01-15',
    streams: [
      { id: 's9', name: 'A', classId: 'c4', teacherId: 't9', teacher: mockTeachers[8], capacity: 40, studentCount: 38 },
      { id: 's10', name: 'B', classId: 'c4', teacherId: 't10', teacher: mockTeachers[9], capacity: 40, studentCount: 37 },
    ],
  },
  {
    id: 'c5',
    name: 'Senior 5',
    level: 'A-Level',
    description: 'First year of Advanced Level',
    classTeacherId: 't1',
    classTeacher: mockTeachers[0],
    totalStudents: 60,
    createdAt: '2024-01-15',
    streams: [
      { id: 's11', name: 'Science', classId: 'c5', teacherId: 't6', teacher: mockTeachers[5], capacity: 30, studentCount: 32 },
      { id: 's12', name: 'Arts', classId: 'c5', teacherId: 't4', teacher: mockTeachers[3], capacity: 30, studentCount: 28 },
    ],
  },
  {
    id: 'c6',
    name: 'Senior 6',
    level: 'A-Level',
    description: 'Second year - UACE preparation',
    classTeacherId: 't7',
    classTeacher: mockTeachers[6],
    totalStudents: 45,
    createdAt: '2024-01-15',
    streams: [
      { id: 's13', name: 'Science', classId: 'c6', teacherId: 't7', teacher: mockTeachers[6], capacity: 25, studentCount: 26 },
      { id: 's14', name: 'Arts', classId: 'c6', teacherId: 't9', teacher: mockTeachers[8], capacity: 25, studentCount: 19 },
    ],
  },
];

export const mockTimetable: TimetableSlot[] = [
  // Monday - Senior 1 Stream A
  { id: 'tt1', classId: 'c1', streamId: 's1', day: 'Monday', period: 1, subject: 'Mathematics', teacherId: 't1', teacher: mockTeachers[0], startTime: '08:00', endTime: '09:00' },
  { id: 'tt2', classId: 'c1', streamId: 's1', day: 'Monday', period: 2, subject: 'English', teacherId: 't2', teacher: mockTeachers[1], startTime: '09:00', endTime: '10:00' },
  { id: 'tt3', classId: 'c1', streamId: 's1', day: 'Monday', period: 3, subject: 'Science', teacherId: 't3', teacher: mockTeachers[2], startTime: '10:30', endTime: '11:30' },
  { id: 'tt4', classId: 'c1', streamId: 's1', day: 'Monday', period: 4, subject: 'Social Studies', teacherId: 't4', teacher: mockTeachers[3], startTime: '11:30', endTime: '12:30' },
  { id: 'tt5', classId: 'c1', streamId: 's1', day: 'Monday', period: 5, subject: 'ICT', teacherId: 't5', teacher: mockTeachers[4], startTime: '14:00', endTime: '15:00' },
  
  // Tuesday - Senior 1 Stream A
  { id: 'tt6', classId: 'c1', streamId: 's1', day: 'Tuesday', period: 1, subject: 'Biology', teacherId: 't6', teacher: mockTeachers[5], startTime: '08:00', endTime: '09:00' },
  { id: 'tt7', classId: 'c1', streamId: 's1', day: 'Tuesday', period: 2, subject: 'Mathematics', teacherId: 't1', teacher: mockTeachers[0], startTime: '09:00', endTime: '10:00' },
  { id: 'tt8', classId: 'c1', streamId: 's1', day: 'Tuesday', period: 3, subject: 'English', teacherId: 't2', teacher: mockTeachers[1], startTime: '10:30', endTime: '11:30' },
  { id: 'tt9', classId: 'c1', streamId: 's1', day: 'Tuesday', period: 4, subject: 'History', teacherId: 't9', teacher: mockTeachers[8], startTime: '11:30', endTime: '12:30' },
  { id: 'tt10', classId: 'c1', streamId: 's1', day: 'Tuesday', period: 5, subject: 'Physical Education', teacherId: 't5', teacher: mockTeachers[4], startTime: '14:00', endTime: '15:00' },
  
  // Wednesday - Senior 1 Stream A
  { id: 'tt11', classId: 'c1', streamId: 's1', day: 'Wednesday', period: 1, subject: 'Chemistry', teacherId: 't7', teacher: mockTeachers[6], startTime: '08:00', endTime: '09:00' },
  { id: 'tt12', classId: 'c1', streamId: 's1', day: 'Wednesday', period: 2, subject: 'Geography', teacherId: 't10', teacher: mockTeachers[9], startTime: '09:00', endTime: '10:00' },
  { id: 'tt13', classId: 'c1', streamId: 's1', day: 'Wednesday', period: 3, subject: 'Mathematics', teacherId: 't1', teacher: mockTeachers[0], startTime: '10:30', endTime: '11:30' },
  { id: 'tt14', classId: 'c1', streamId: 's1', day: 'Wednesday', period: 4, subject: 'English', teacherId: 't2', teacher: mockTeachers[1], startTime: '11:30', endTime: '12:30' },
  { id: 'tt15', classId: 'c1', streamId: 's1', day: 'Wednesday', period: 5, subject: 'Science', teacherId: 't3', teacher: mockTeachers[2], startTime: '14:00', endTime: '15:00' },
  
  // Thursday - Senior 1 Stream A
  { id: 'tt16', classId: 'c1', streamId: 's1', day: 'Thursday', period: 1, subject: 'Social Studies', teacherId: 't4', teacher: mockTeachers[3], startTime: '08:00', endTime: '09:00' },
  { id: 'tt17', classId: 'c1', streamId: 's1', day: 'Thursday', period: 2, subject: 'ICT', teacherId: 't5', teacher: mockTeachers[4], startTime: '09:00', endTime: '10:00' },
  { id: 'tt18', classId: 'c1', streamId: 's1', day: 'Thursday', period: 3, subject: 'Biology', teacherId: 't6', teacher: mockTeachers[5], startTime: '10:30', endTime: '11:30' },
  { id: 'tt19', classId: 'c1', streamId: 's1', day: 'Thursday', period: 4, subject: 'Mathematics', teacherId: 't1', teacher: mockTeachers[0], startTime: '11:30', endTime: '12:30' },
  { id: 'tt20', classId: 'c1', streamId: 's1', day: 'Thursday', period: 5, subject: 'English', teacherId: 't2', teacher: mockTeachers[1], startTime: '14:00', endTime: '15:00' },
  
  // Friday - Senior 1 Stream A
  { id: 'tt21', classId: 'c1', streamId: 's1', day: 'Friday', period: 1, subject: 'Physics', teacherId: 't8', teacher: mockTeachers[7], startTime: '08:00', endTime: '09:00' },
  { id: 'tt22', classId: 'c1', streamId: 's1', day: 'Friday', period: 2, subject: 'History', teacherId: 't9', teacher: mockTeachers[8], startTime: '09:00', endTime: '10:00' },
  { id: 'tt23', classId: 'c1', streamId: 's1', day: 'Friday', period: 3, subject: 'Geography', teacherId: 't10', teacher: mockTeachers[9], startTime: '10:30', endTime: '11:30' },
  { id: 'tt24', classId: 'c1', streamId: 's1', day: 'Friday', period: 4, subject: 'Art', teacherId: 't4', teacher: mockTeachers[3], startTime: '11:30', endTime: '12:30' },
  { id: 'tt25', classId: 'c1', streamId: 's1', day: 'Friday', period: 5, subject: 'Music', teacherId: 't5', teacher: mockTeachers[4], startTime: '14:00', endTime: '15:00' },
];
