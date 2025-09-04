import { useState } from "react";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@marka/components/ui/button";
import { Card } from "@marka/components/ui/card";
import { Badge } from "@marka/components/ui/badge";
import { Avatar, AvatarFallback } from "@marka/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@marka/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@marka/components/ui/table";
import { Student } from "@marka/types/api";

interface StudentsTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function StudentsTable({
  students,
  onEdit,
  onDelete,
  isLoading,
}: StudentsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(students.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStudents = students.slice(startIndex, endIndex);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString();
  };

  const getClassDisplay = (currentClass?: string, currentStream?: string) => {
    if (!currentClass) return "Not assigned";
    return currentStream ? `${currentClass}${currentStream}` : currentClass;
  };

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>LIN</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Parent/Guardian</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentStudents.map((student) => (
              <TableRow key={student.id} className="hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(student.firstName, student.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-foreground">
                        {student.firstName} {student.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {student.gender
                          ? student.gender.charAt(0).toUpperCase() +
                            student.gender.slice(1)
                          : "Not specified"}
                        {student.dateOfBirth &&
                          `, ${formatDate(student.dateOfBirth)}`}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-sm">
                    {student.lin || "Not assigned"}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {getClassDisplay(student.class, student.stream)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div className="font-medium">
                      {student.parentName || "Not provided"}
                    </div>
                    {student.parentPhone && (
                      <div className="text-muted-foreground">
                        {student.parentName}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={student.status ? "default" : "secondary"}>
                    {student.status ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        data-testid={`student-actions-${student.id}`}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        data-testid={`view-student-${student.id}`}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onEdit(student)}
                        data-testid={`edit-student-${student.id}`}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Student
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => onDelete(student.id)}
                        disabled={isLoading}
                        data-testid={`delete-student-${student.id}`}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Student
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, students.length)} of{" "}
            {students.length} students
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              data-testid="previous-page"
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                data-testid={`page-${page}`}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              data-testid="next-page"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
