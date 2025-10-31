import { useState } from 'react';
import { useRoute, Link } from 'wouter';
import { DashboardLayout } from '@marka/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@marka/components/ui/card';
import { Button } from '@marka/components/ui/button';
import { Badge } from '@marka/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@marka/components/ui/table';
import { Alert, AlertDescription } from '@marka/components/ui/alert';
import { ArrowLeft, Users, UserPlus, Trash2, Calendar } from 'lucide-react';
import { useClasses } from '@marka/hooks/use-classes';
import { AssignTeacherModal } from '@marka/components/modals/AssignTeacherModal';

export default function ClassDetailPage() {
  const [, params] = useRoute('/classes/:id');
  const { getClassById, deleteStream } = useClasses();
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedStreamId, setSelectedStreamId] = useState<string>();
  
  const classData = getClassById(params?.id || '');

  if (!classData) {
    return (
      <DashboardLayout title="Class Details">
        <div className="p-6">
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
      </DashboardLayout>
    );
  }

  const handleAssignTeacher = (streamId?: string) => {
    setSelectedStreamId(streamId);
    setAssignModalOpen(true);
  };

  return (
    <DashboardLayout title={classData.name}>
      <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/classes">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{classData.name}</h1>
          <p className="text-muted-foreground">{classData.level}</p>
        </div>
        <Link href={`/classes/${classData.id}/timetable`}>
          <Button>
            <Calendar className="h-4 w-4 mr-2" />
            View Timetable
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Streams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classData.streams.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classData.totalStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class Teacher</CardTitle>
          </CardHeader>
          <CardContent>
            {classData.classTeacher ? (
              <div className="text-sm">
                <div className="font-medium">{classData.classTeacher.name}</div>
                <div className="text-muted-foreground">{classData.classTeacher.subject}</div>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => handleAssignTeacher()}>
                <UserPlus className="h-3 w-3 mr-1" />
                Assign
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {classData.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{classData.description}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Streams</CardTitle>
              <CardDescription>Manage all streams in this class</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stream</TableHead>
                  <TableHead className="hidden sm:table-cell">Capacity</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead className="hidden md:table-cell">Stream Teacher</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classData.streams.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No streams found
                    </TableCell>
                  </TableRow>
                ) : (
                  classData.streams.map((stream) => (
                    <TableRow key={stream.id}>
                      <TableCell>
                        <Badge className="text-base px-3 py-1">{stream.name}</Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{stream.capacity}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{stream.studentCount}</span>
                          {stream.studentCount > stream.capacity && (
                            <Badge variant="destructive" className="text-xs">Over capacity</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {stream.teacher ? (
                          <div className="text-sm">
                            <div className="font-medium">{stream.teacher.name}</div>
                            <div className="text-muted-foreground text-xs">{stream.teacher.subject}</div>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAssignTeacher(stream.id)}
                          >
                            <UserPlus className="h-3 w-3 mr-1" />
                            Assign
                          </Button>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAssignTeacher(stream.id)}
                          >
                            <UserPlus className="h-3 w-3 mr-1" />
                            <span className="hidden sm:inline">Assign Teacher</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteStream(classData.id, stream.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AssignTeacherModal
        open={assignModalOpen}
        onOpenChange={setAssignModalOpen}
        classData={classData}
        streamId={selectedStreamId}
      />
      </div>
    </DashboardLayout>
  );
}
