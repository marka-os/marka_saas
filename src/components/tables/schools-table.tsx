import { useState } from "react";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Phone,
  Globe,
} from "lucide-react";
import { Button } from "@marka/components/ui/button";
import { Card } from "@marka/components/ui/card";
import { Badge } from "@marka/components/ui/badge";
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
import { School } from "@marka/types/api";

interface SchoolsTableProps {
  schools: School[];
  onEdit: (school: School) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function SchoolsTable({
  schools,
  onEdit,
  onDelete,
  isLoading,
}: SchoolsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(schools.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSchools = schools.slice(startIndex, endIndex);

  //const formatDate = (dateString: string) => {
  //  return new Date(dateString).toLocaleDateString();
  //};

  const getLevelDisplayName = (level: string) => {
    switch (level) {
      case "primary":
        return "Primary School";
      case "o_level":
        return "O-Level";
      case "a_level":
        return "A-Level";
      case "combined":
        return "Combined School";
      default:
        return level;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "primary":
        return "bg-blue-100 text-blue-800";
      case "o_level":
        return "bg-green-100 text-green-800";
      case "a_level":
        return "bg-purple-100 text-purple-800";
      case "combined":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>School</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentSchools.map((school) => (
              <TableRow key={school.id} className="hover:bg-muted/50">
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium text-foreground">
                      {school.name}
                    </div>
                    {school.code && (
                      <div className="text-sm text-muted-foreground font-mono">
                        Code: {school.code}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`${getLevelColor(
                      school.level
                    )} border-transparent`}
                  >
                    {getLevelDisplayName(school.level)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {school.city && (
                      <div className="flex items-center text-sm">
                        <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span className="text-foreground">{school.city}</span>
                      </div>
                    )}
                    {school.district && (
                      <div className="text-sm text-muted-foreground">
                        {school.district}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {school.phone && (
                      <div className="flex items-center text-sm">
                        <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span className="text-foreground">{school.phone}</span>
                      </div>
                    )}
                    {school.email && (
                      <div className="text-sm text-muted-foreground">
                        {school.email}
                      </div>
                    )}
                    {school.website && (
                      <div className="flex items-center text-sm">
                        <Globe className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span className="text-muted-foreground">Website</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {/** <Badge variant={school.isActive ? "default" : "secondary"}>
                    {school.isActive ? "Active" : "Inactive"}
                  </Badge>*/}
                  <Badge variant="default">Active</Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        data-testid={`school-actions-${school.id}`}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        data-testid={`view-school-${school.id}`}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onEdit(school)}
                        data-testid={`edit-school-${school.id}`}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit School
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => onDelete(school.id)}
                        disabled={isLoading}
                        data-testid={`delete-school-${school.id}`}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete School
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
            Showing {startIndex + 1} to {Math.min(endIndex, schools.length)} of{" "}
            {schools.length} schools
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
