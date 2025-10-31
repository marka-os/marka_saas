import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@marka/components/ui/dialog';
import { Button } from '@marka/components/ui/button';
import { Input } from '@marka/components/ui/input';
import { Label } from '@marka/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@marka/components/ui/select';
import { useClasses, useTeachers } from '@marka/hooks/use-classes';
import type { Class } from '@marka/lib/mockData';

interface AssignTeacherModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classData: Class;
  streamId?: string;
}

export function AssignTeacherModal({ open, onOpenChange, classData, streamId }: AssignTeacherModalProps) {
  const { assignTeacher, isLoading } = useClasses();
  const { teachers } = useTeachers();
  const [selectedTeacherId, setSelectedTeacherId] = useState('');

  const selectedStream = streamId 
    ? classData.streams.find(s => s.id === streamId)
    : undefined;

  useEffect(() => {
    if (streamId && selectedStream?.teacherId) {
      setSelectedTeacherId(selectedStream.teacherId);
    } else if (!streamId && classData.classTeacherId) {
      setSelectedTeacherId(classData.classTeacherId);
    } else {
      setSelectedTeacherId('');
    }
  }, [streamId, selectedStream, classData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTeacherId) return;
    
    try {
      await assignTeacher(classData.id, streamId, selectedTeacherId);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to assign teacher:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Teacher</DialogTitle>
          <DialogDescription>
            {streamId 
              ? `Assign a teacher to ${classData.name} - Stream ${selectedStream?.name}`
              : `Assign a class teacher to ${classData.name}`
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="class">Class</Label>
            <Input
              id="class"
              value={`${classData.name} ${streamId ? `- Stream ${selectedStream?.name}` : ''}`}
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="teacher">Teacher *</Label>
            <Select
              value={selectedTeacherId}
              onValueChange={setSelectedTeacherId}
            >
              <SelectTrigger id="teacher">
                <SelectValue placeholder="Select a teacher" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    <div className="flex flex-col">
                      <span>{teacher.name}</span>
                      {teacher.subject && (
                        <span className="text-xs text-muted-foreground">{teacher.subject}</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !selectedTeacherId}>
              {isLoading ? 'Assigning...' : 'Assign Teacher'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
