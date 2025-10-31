import { useState } from 'react';
import { useRoute, Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@marka/components/ui/card';
import { Button } from '@marka/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@marka/components/ui/select';
import { Alert, AlertDescription } from '@marka/components/ui/alert';
import { ArrowLeft, Plus, Download, Edit, Trash2 } from 'lucide-react';
import { useClasses } from '@marka/hooks/use-classes';
import { useTimetable } from '@marka/hooks/use-timetable';
import { TimetableFormModal } from '@marka/components/modals/TimetableFormModal';
import type { TimetableSlot } from '@marka/lib/mockData';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;
const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export default function TimetablePage() {
  const [, params] = useRoute('/classes/:id/timetable');
  const { getClassById } = useClasses();
  const classData = getClassById(params?.id || '');
  
  const [selectedStreamId, setSelectedStreamId] = useState<string>(classData?.streams[0]?.id || '');
  const { slots, deleteSlot } = useTimetable(params?.id, selectedStreamId);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimetableSlot | undefined>();
  const [defaultDay, setDefaultDay] = useState<string>();
  const [defaultPeriod, setDefaultPeriod] = useState<number>();

  if (!classData) {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <Alert>
          <AlertDescription>Class not found</AlertDescription>
        </Alert>
        <Link href="/classes">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Classes
          </Button>
        </Link>
      </div>
    );
  }

  const selectedStream = classData.streams.find(s => s.id === selectedStreamId);

  const getSlotForCell = (day: string, period: number) => {
    return slots.find(slot => slot.day === day && slot.period === period);
  };

  const handleCellClick = (day: string, period: number) => {
    const existingSlot = getSlotForCell(day, period);
    if (existingSlot) {
      setEditingSlot(existingSlot);
      setDefaultDay(undefined);
      setDefaultPeriod(undefined);
    } else {
      setEditingSlot(undefined);
      setDefaultDay(day);
      setDefaultPeriod(period);
    }
    setFormModalOpen(true);
  };

  const handleAddLesson = () => {
    setEditingSlot(undefined);
    setDefaultDay(undefined);
    setDefaultPeriod(undefined);
    setFormModalOpen(true);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Link href={`/classes/${classData.id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Timetable - {classData.name}</h1>
          <p className="text-muted-foreground">
            {selectedStream ? `Stream ${selectedStream.name}` : 'All Streams'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button onClick={handleAddLesson}>
            <Plus className="h-4 w-4 mr-2" />
            Add Lesson
          </Button>
        </div>
      </div>

      {classData.streams.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Stream</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedStreamId} onValueChange={setSelectedStreamId}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {classData.streams.map((stream) => (
                  <SelectItem key={stream.id} value={stream.id}>
                    Stream {stream.name} ({stream.studentCount} students)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Weekly Timetable</CardTitle>
          <CardDescription>
            Click on a cell to add or edit a lesson
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-6 gap-2">
                <div className="font-semibold p-3 text-center bg-muted rounded-lg">
                  Period
                </div>
                {DAYS.map((day) => (
                  <div key={day} className="font-semibold p-3 text-center bg-muted rounded-lg">
                    {day}
                  </div>
                ))}
                
                {PERIODS.slice(0, 5).map((period) => (
                  <>
                    <div key={`period-${period}`} className="font-medium p-3 text-center bg-muted/50 rounded-lg flex items-center justify-center">
                      {period}
                    </div>
                    {DAYS.map((day) => {
                      const slot = getSlotForCell(day, period);
                      return (
                        <div
                          key={`${day}-${period}`}
                          className={`p-3 border-2 rounded-lg cursor-pointer transition-all hover:border-primary ${
                            slot ? 'bg-primary/10 border-primary/20' : 'bg-background border-border hover:bg-muted/50'
                          }`}
                          onClick={() => handleCellClick(day, period)}
                        >
                          {slot ? (
                            <div className="space-y-1">
                              <div className="font-medium text-sm line-clamp-1">{slot.subject}</div>
                              <div className="text-xs text-muted-foreground line-clamp-1">
                                {slot.teacher?.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {slot.startTime} - {slot.endTime}
                              </div>
                              <div className="flex gap-1 mt-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingSlot(slot);
                                    setFormModalOpen(true);
                                  }}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteSlot(slot.id);
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center text-muted-foreground text-sm h-full flex items-center justify-center min-h-[80px]">
                              <Plus className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-primary/10 border-2 border-primary/20"></div>
              <span className="text-sm text-muted-foreground">Scheduled</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-background border-2 border-border"></div>
              <span className="text-sm text-muted-foreground">Empty</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <TimetableFormModal
        open={formModalOpen}
        onOpenChange={setFormModalOpen}
        classId={classData.id}
        streamId={selectedStreamId}
        slot={editingSlot}
        defaultDay={defaultDay}
        defaultPeriod={defaultPeriod}
      />
    </div>
  );
}
