import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentActivityFeed = () => {
  const activities = [
    {
      id: 1,
      type: 'assessment',
      title: 'Mathematics Test - Grade 7A',
      description: 'New assessment results submitted by Sarah Nakato',
      timestamp: '2 minutes ago',
      icon: 'ClipboardList',
      iconColor: 'var(--color-primary)'
    },
    {
      id: 2,
      type: 'student',
      title: 'New Student Registration',
      description: 'John Mukasa added to Grade 6B by admin',
      timestamp: '15 minutes ago',
      icon: 'UserPlus',
      iconColor: 'var(--color-success)'
    },
    {
      id: 3,
      type: 'report',
      title: 'Report Cards Generated',
      description: 'Term 2 report cards ready for Grade 5 students',
      timestamp: '1 hour ago',
      icon: 'FileText',
      iconColor: 'var(--color-accent)'
    },
    {
      id: 4,
      type: 'payment',
      title: 'Subscription Renewed',
      description: 'Pro plan subscription renewed successfully',
      timestamp: '2 hours ago',
      icon: 'CreditCard',
      iconColor: 'var(--color-success)'
    },
    {
      id: 5,
      type: 'system',
      title: 'Data Backup Completed',
      description: 'Automated daily backup completed successfully',
      timestamp: '3 hours ago',
      icon: 'Database',
      iconColor: 'var(--color-muted-foreground)'
    },
    {
      id: 6,
      type: 'assessment',
      title: 'English Quiz - Grade 8C',
      description: 'Quiz results pending review by teacher',
      timestamp: '4 hours ago',
      icon: 'Clock',
      iconColor: 'var(--color-warning)'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground mb-2">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">Latest updates from your school</p>
        </div>
        <button className="text-sm text-primary hover:text-primary/80 font-medium">
          View All
        </button>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities?.map((activity) => (
          <div key={activity?.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-1">
              <Icon name={activity?.icon} size={16} color={activity?.iconColor} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-card-foreground text-sm mb-1">
                {activity?.title}
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                {activity?.description}
              </p>
              <p className="text-xs text-muted-foreground">
                {activity?.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivityFeed;