import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Add New Student',
      description: 'Register a new student to the system',
      icon: 'UserPlus',
      action: () => navigate('/student-management'),
      variant: 'default'
    },
    {
      title: 'Create Assessment',
      description: 'Set up a new exam, test, or quiz',
      icon: 'Plus',
      action: () => navigate('/assessment-input'),
      variant: 'outline'
    },
    {
      title: 'Generate Reports',
      description: 'Create and download report cards',
      icon: 'FileText',
      action: () => navigate('/report-card-generation'),
      variant: 'secondary'
    },
    {
      title: 'View All Students',
      description: 'Manage student records and profiles',
      icon: 'Users',
      action: () => navigate('/student-management'),
      variant: 'ghost'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-2">Quick Actions</h3>
        <p className="text-sm text-muted-foreground">Common tasks and shortcuts</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions?.map((action, index) => (
          <div key={index} className="p-4 border border-border rounded-lg hover:border-primary/20 transition-colors duration-200">
            <div className="mb-3">
              <h4 className="font-medium text-card-foreground text-sm mb-1">
                {action?.title}
              </h4>
              <p className="text-xs text-muted-foreground mb-3">
                {action?.description}
              </p>
            </div>
            <Button
              variant={action?.variant}
              size="sm"
              iconName={action?.icon}
              iconPosition="left"
              onClick={action?.action}
              fullWidth
            >
              {action?.title}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;