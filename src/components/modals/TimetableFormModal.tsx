import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@marka/components/ui/dialog';
import { Button } from '@marka/components/ui/button';
import { Input } from '@marka/components/ui/input';
import { Label } from '@marka/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@marka/components/ui/select';
import { Alert, AlertDescription } from '@marka/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useTeachers } from '@marka/hooks/use-classes';
import { useTimetable } from '@marka/hooks/use-timetable';
import type { TimetableSlot } from '@marka/lib/mockData';

interface TimetableFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classId: string;
  streamId?: string;
  slot?: TimetableSlot;
  defaultDay?: string;
  defaultPeriod?: number;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;
const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

const PERIOD_TIMES: Record<number, { start: string; end: string }> = {
  1: { start: '08:00', end: '09:00' },
  2: { start: '09:00', end: '10:00' },
  3: { start: '10:30', end: '11:30' },
  4: { start: '11:30', end: '12:30' },
  5: { start: '14:00', end: '15:00' },
  6: { start: '15:00', end: '16:00' },
  7: { start: '16:00', end: '17:00' },
  8: { start: '17:00', end: '18:00' },
};

export function TimetableFormModal({ 
  open, 
  onOpenChange, 
  classId, 
  streamId,
  slot,
  defaultDay,
  defaultPeriod 
}: TimetableFormModalProps) {
  const { teachers } = useTeachers();
  const { addSlot, updateSlot, isLoading, checkConflict } = useTimetable(classId, streamId);
  
  const [formData, setFormData] = useState({
    day: slot?.day || defaultDay || 'Monday',
    period: slot?.period || defaultPeriod || 1,
    subject: slot?.subject || '',
    teacherId: slot?.teacherId || '',
    startTime: slot?.startTime || PERIOD_TIMES[defaultPeriod || 1].start,
    endTime: slot?.endTime || PERIOD_TIMES[defaultPeriod || 1].end,
  });

  const [hasConflict, setHasConflict] = useState(false);

  useEffect(() => {
    if (formData.day && formData.period) {
      const conflict = checkConflict(formData.day, formData.period, slot?.id);
      setHasConflict(conflict);
    }
  }, [formData.day, formData.period, checkConflict, slot?.id]);

  useEffect(() => {
    const times = PERIOD_TIMES[formData.period];
    if (times && !slot) {
      setFormData(prev => ({
        ...prev,
        startTime: times.start,
        endTime: times.end,
      }));
    }
  }, [formData.period, slot]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (hasConflict) return;
    
    try {
      const slotData = {
        classId,
        streamId,
        day: formData.day as typeof DAYS[number],
        period: formData.period,
        subject: formData.subject,
        teacherId: formData.teacherId,
        startTime: formData.startTime,
        endTime: formData.endTime,
      };

      if (slot) {
        await updateSlot(slot.id, slotData);
      } else {
        await addSlot(slotData);
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save lesson:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{slot ? 'Edit Lesson' : 'Add Lesson'}</DialogTitle>
          <DialogDescription>
            {slot ? 'Update the lesson details' : 'Add a new lesson to the timetable'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {hasConflict && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                A lesson already exists for this day and period. Please choose a different slot.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="day">Day *</Label>
              <Select
                value={formData.day}
                onValueChange={(value) => setFormData({ ...formData, day: value })}
              >
                <SelectTrigger id="day">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="period">Period *</Label>
              <Select
                value={formData.period.toString()}
                onValueChange={(value) => setFormData({ ...formData, period: parseInt(value) })}
              >
                <SelectTrigger id="period">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PERIODS.map((period) => (
                    <SelectItem key={period} value={period.toString()}>
                      Period {period}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              placeholder="e.g., Mathematics"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="teacher">Teacher *</Label>
            <Select
              value={formData.teacherId}
              onValueChange={(value) => setFormData({ ...formData, teacherId: value })}
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time *</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time *</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || hasConflict}>
              {isLoading ? 'Saving...' : slot ? 'Update' : 'Add Lesson'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
