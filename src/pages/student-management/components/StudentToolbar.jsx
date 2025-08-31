import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const StudentToolbar = ({ 
  searchTerm, 
  onSearchChange, 
  filters, 
  onFilterChange, 
  onAddStudent, 
  onImportCSV, 
  onExportData,
  onToggleFilters,
  showFilters,
  selectedCount 
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const classOptions = [
    { value: '', label: 'All Classes' },
    { value: 'P1', label: 'Primary 1' },
    { value: 'P2', label: 'Primary 2' },
    { value: 'P3', label: 'Primary 3' },
    { value: 'P4', label: 'Primary 4' },
    { value: 'P5', label: 'Primary 5' },
    { value: 'P6', label: 'Primary 6' },
    { value: 'P7', label: 'Primary 7' },
    { value: 'S1', label: 'Senior 1' },
    { value: 'S2', label: 'Senior 2' },
    { value: 'S3', label: 'Senior 3' },
    { value: 'S4', label: 'Senior 4' },
    { value: 'S5', label: 'Senior 5' },
    { value: 'S6', label: 'Senior 6' }
  ];

  const streamOptions = [
    { value: '', label: 'All Streams' },
    { value: 'A', label: 'Stream A' },
    { value: 'B', label: 'Stream B' },
    { value: 'C', label: 'Stream C' },
    { value: 'D', label: 'Stream D' }
  ];

  const academicYearOptions = [
    { value: '', label: 'All Years' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' }
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'graduated', label: 'Graduated' },
    { value: 'transferred', label: 'Transferred' }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExportData();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      {/* Main Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
        {/* Left Section - Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Search students by name, LIN, or email..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e?.target?.value)}
              className="w-full"
            />
          </div>
          
          <Button
            variant="outline"
            onClick={onToggleFilters}
            className="sm:w-auto"
          >
            <Icon name="Filter" size={16} className="mr-2" />
            Filters
            {showFilters && <Icon name="ChevronUp" size={16} className="ml-2" />}
            {!showFilters && <Icon name="ChevronDown" size={16} className="ml-2" />}
          </Button>
        </div>

        {/* Right Section - Actions */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onImportCSV}
            className="sm:w-auto"
          >
            <Icon name="Upload" size={16} className="mr-2" />
            Import CSV
          </Button>
          
          <Button
            variant="outline"
            onClick={handleExport}
            loading={isExporting}
            className="sm:w-auto"
          >
            <Icon name="Download" size={16} className="mr-2" />
            Export Data
          </Button>
          
          <Button
            variant="default"
            onClick={onAddStudent}
            className="sm:w-auto"
          >
            <Icon name="Plus" size={16} className="mr-2" />
            Add Student
          </Button>
        </div>
      </div>
      {/* Selection Info */}
      {selectedCount > 0 && (
        <div className="flex items-center justify-between p-3 bg-primary/10 border border-primary/20 rounded-lg mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary">
              {selectedCount} student{selectedCount !== 1 ? 's' : ''} selected
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Icon name="Mail" size={14} className="mr-1" />
              Send Message
            </Button>
            <Button variant="outline" size="sm">
              <Icon name="FileText" size={14} className="mr-1" />
              Generate Reports
            </Button>
            <Button variant="outline" size="sm">
              <Icon name="Edit" size={14} className="mr-1" />
              Bulk Edit
            </Button>
          </div>
        </div>
      )}
      {/* Filter Panel */}
      {showFilters && (
        <div className="border-t border-border pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              label="Class"
              options={classOptions}
              value={filters?.class}
              onChange={(value) => onFilterChange('class', value)}
              placeholder="Select class"
              description=""
              error=""
              id="class-select"
              name="class"
            />
            
            <Select
              label="Stream"
              options={streamOptions}
              value={filters?.stream}
              onChange={(value) => onFilterChange('stream', value)}
              placeholder="Select stream"
              description=""
              error=""
              id="stream-select"
              name="stream"
            />
            
            <Select
              label="Academic Year"
              options={academicYearOptions}
              value={filters?.academicYear}
              onChange={(value) => onFilterChange('academicYear', value)}
              placeholder="Select year"
              description=""
              error=""
              id="academic-year-select"
              name="academicYear"
            />
            
            <Select
              label="Status"
              options={statusOptions}
              value={filters?.status}
              onChange={(value) => onFilterChange('status', value)}
              placeholder="Select status"
              description=""
              error=""
              id="status-select"
              name="status"
            />
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              Showing filtered results
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFilterChange('reset')}
            >
              <Icon name="X" size={14} className="mr-1" />
              Clear Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentToolbar;