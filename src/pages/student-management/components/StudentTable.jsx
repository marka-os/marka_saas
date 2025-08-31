import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const StudentTable = ({ 
  students, 
  selectedStudents, 
  onSelectStudent, 
  onSelectAll, 
  onEditStudent, 
  onViewProfile, 
  onManageAssessments,
  sortConfig,
  onSort 
}) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  const handleSort = (column) => {
    const direction = sortConfig?.key === column && sortConfig?.direction === 'asc' ? 'desc' : 'asc';
    onSort({ key: column, direction });
  };

  const getSortIcon = (column) => {
    if (sortConfig?.key !== column) return 'ArrowUpDown';
    return sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: 'bg-success/10', text: 'text-success', label: 'Active' },
      inactive: { bg: 'bg-warning/10', text: 'text-warning', label: 'Inactive' },
      graduated: { bg: 'bg-secondary/10', text: 'text-secondary', label: 'Graduated' },
      transferred: { bg: 'bg-error/10', text: 'text-error', label: 'Transferred' }
    };
    
    const config = statusConfig?.[status] || statusConfig?.active;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config?.bg} ${config?.text}`}>
        {config?.label}
      </span>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Table Header */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedStudents?.length === students?.length && students?.length > 0}
                  onChange={onSelectAll}
                  className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-primary focus:ring-2"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Student
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort('lin')}
              >
                <div className="flex items-center space-x-1">
                  <span>LIN Number</span>
                  <Icon name={getSortIcon('lin')} size={14} />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort('class')}
              >
                <div className="flex items-center space-x-1">
                  <span>Class</span>
                  <Icon name={getSortIcon('class')} size={14} />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Stream
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Parent Contact
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  <Icon name={getSortIcon('status')} size={14} />
                </div>
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {students?.map((student) => (
              <tr 
                key={student?.id}
                className={`hover:bg-muted/30 transition-colors ${
                  selectedStudents?.includes(student?.id) ? 'bg-primary/5' : ''
                }`}
                onMouseEnter={() => setHoveredRow(student?.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedStudents?.includes(student?.id)}
                    onChange={() => onSelectStudent(student?.id)}
                    className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-primary focus:ring-2"
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={student?.photo}
                        alt={`${student?.firstName} ${student?.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {student?.firstName} {student?.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {student?.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm font-mono text-foreground">
                    {student?.lin}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-foreground font-medium">
                    {student?.class}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-foreground">
                    {student?.stream}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-foreground">
                    <p className="font-medium">{student?.parentName}</p>
                    <p className="text-muted-foreground">{student?.parentPhone}</p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  {getStatusBadge(student?.status)}
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewProfile(student)}
                      className="w-8 h-8"
                      title="View Profile"
                    >
                      <Icon name="Eye" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditStudent(student)}
                      className="w-8 h-8"
                      title="Edit Student"
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onManageAssessments(student)}
                      className="w-8 h-8"
                      title="Manage Assessments"
                    >
                      <Icon name="ClipboardList" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Empty State */}
      {students?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Users" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No students found</h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first student to the system.
          </p>
          <Button variant="default">
            <Icon name="Plus" size={16} className="mr-2" />
            Add Student
          </Button>
        </div>
      )}
    </div>
  );
};

export default StudentTable;