import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActionsBar = ({ 
  selectedCount, 
  onBulkStatusUpdate, 
  onBulkDelete, 
  onBulkExport, 
  onClearSelection 
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const statusOptions = [
    { value: 'active', label: 'Set as Active' },
    { value: 'inactive', label: 'Set as Inactive' },
    { value: 'graduated', label: 'Mark as Graduated' },
    { value: 'transferred', label: 'Mark as Transferred' }
  ];

  const handleStatusUpdate = async (status) => {
    setIsUpdating(true);
    try {
      await onBulkStatusUpdate(status);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBulkDelete = async () => {
    setIsUpdating(true);
    try {
      await onBulkDelete();
      setShowConfirmDelete(false);
    } finally {
      setIsUpdating(false);
    }
  };

  if (selectedCount === 0) return null;

  return (
    <>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-1000">
        <div className="bg-card border border-border rounded-lg shadow-modal p-4 min-w-96">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Icon name="CheckCircle" size={16} color="var(--color-primary-foreground)" />
              </div>
              <span className="font-medium text-foreground">
                {selectedCount} student{selectedCount !== 1 ? 's' : ''} selected
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClearSelection}
              className="w-6 h-6"
            >
              <Icon name="X" size={14} />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Select
              options={statusOptions}
              value=""
              onChange={handleStatusUpdate}
              placeholder="Update Status"
              disabled={isUpdating}
              className="min-w-32"
              label="Status Update"
              description="Select a new status for the selected students"
              error=""
              id="bulk-status-select"
              name="bulkStatus"
            />

            <Button
              variant="outline"
              size="sm"
              onClick={onBulkExport}
              disabled={isUpdating}
            >
              <Icon name="Download" size={14} className="mr-1" />
              Export
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => console.log('Send message to selected students')}
              disabled={isUpdating}
            >
              <Icon name="Mail" size={14} className="mr-1" />
              Message
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => console.log('Generate reports for selected students')}
              disabled={isUpdating}
            >
              <Icon name="FileText" size={14} className="mr-1" />
              Reports
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowConfirmDelete(true)}
              disabled={isUpdating}
            >
              <Icon name="Trash2" size={14} className="mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-1100 p-4">
          <div className="bg-card border border-border rounded-lg shadow-modal w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
                  <Icon name="AlertTriangle" size={20} className="text-error" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Delete Students
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <p className="text-foreground mb-6">
                Are you sure you want to delete {selectedCount} student{selectedCount !== 1 ? 's' : ''}? 
                This will permanently remove all their data including assessments and reports.
              </p>

              <div className="flex items-center justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmDelete(false)}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleBulkDelete}
                  loading={isUpdating}
                >
                  Delete Students
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkActionsBar;