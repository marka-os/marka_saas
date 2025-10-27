import { useState } from "react";
import { MoreHorizontal, Edit, Trash2, Eye, Mail, Phone } from "lucide-react";
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
import { Teacher } from "@marka/types/api";

interface TeachersTableProps {
  teachers: Teacher[];
  onEdit: (teacher: Teacher) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function TeachersTable({
  teachers,
  onEdit,
  onDelete,
  isLoading,
}: TeachersTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(teachers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTeachers = teachers.slice(startIndex, endIndex);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  /** const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString();
  };*/

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      case "suspended":
        return "destructive";
      case "terminated":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getContractDisplay = (contractType?: string) => {
    if (!contractType) return "Not specified";
    return contractType.charAt(0).toUpperCase() + contractType.slice(1);
  };

  const getQualificationDisplay = (qualification?: string) => {
    if (!qualification) return "Not specified";
    const qualMap: { [key: string]: string } = {
      certificate: "Certificate",
      diploma: "Diploma",
      degree: "Degree",
      masters: "Masters",
      phd: "PhD",
      other: "Other",
    };
    return qualMap[qualification] || qualification;
  };

  /**  const formatSalary = (amount?: number) => {
    if (!amount) return "Not set";
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
    }).format(amount);
  };*/

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Teacher</TableHead>
              <TableHead>Employee ID</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Qualification</TableHead>
              <TableHead>Contract</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTeachers.map((teacher) => (
              <TableRow key={teacher.id} className="hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(teacher.firstName, teacher.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-foreground">
                        {teacher.firstName} {teacher.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {teacher.specializations || "No specialization"}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-sm">
                    {teacher.employeeId || "Not assigned"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="text-sm space-y-1">
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span className="truncate max-w-[200px]">
                        {teacher.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span>{teacher.phone}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div className="font-medium">
                      {getQualificationDisplay(teacher.highestQualification)}
                    </div>
                    {teacher.yearsOfExperience && (
                      <div className="text-muted-foreground">
                        {teacher.yearsOfExperience} years exp.
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {getContractDisplay(teacher.contractType)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(teacher.employmentStatus)}>
                    {teacher.employmentStatus.charAt(0).toUpperCase() +
                      teacher.employmentStatus.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        data-testid={`teacher-actions-${teacher.id}`}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        data-testid={`view-teacher-${teacher.id}`}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onEdit(teacher)}
                        data-testid={`edit-teacher-${teacher.id}`}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Teacher
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => onDelete(teacher.id)}
                        disabled={isLoading}
                        data-testid={`delete-teacher-${teacher.id}`}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Teacher
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
            Showing {startIndex + 1} to {Math.min(endIndex, teachers.length)} of{" "}
            {teachers.length} teachers
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
