import React from 'react';
import Icon from '../../../components/AppIcon';

const SubscriptionTimeline = () => {
  const timelineEvents = [
    {
      id: 1,
      type: 'upgrade',
      title: 'Upgraded to Professional',
      description: 'Plan upgraded from Basic to Professional',
      date: '2025-01-15',
      status: 'completed',
      amount: '+$200'
    },
    {
      id: 2,
      type: 'payment',
      title: 'Payment Processed',
      description: 'Monthly subscription payment',
      date: '2025-01-01',
      status: 'completed',
      amount: '$299'
    },
    {
      id: 3,
      type: 'renewal',
      title: 'Auto-renewal Enabled',
      description: 'Subscription set to auto-renew',
      date: '2024-12-15',
      status: 'completed'
    },
    {
      id: 4,
      type: 'payment',
      title: 'Payment Processed',
      description: 'Monthly subscription payment',
      date: '2024-12-01',
      status: 'completed',
      amount: '$99'
    },
    {
      id: 5,
      type: 'signup',
      title: 'Account Created',
      description: 'Started with Basic plan',
      date: '2024-11-15',
      status: 'completed'
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      type: 'payment',
      title: 'Next Payment Due',
      description: 'Professional plan renewal',
      date: '2025-02-01',
      status: 'upcoming',
      amount: '$299'
    },
    {
      id: 2,
      type: 'renewal',
      title: 'Subscription Renewal',
      description: 'Auto-renewal will process',
      date: '2025-02-01',
      status: 'upcoming'
    }
  ];

  const getEventIcon = (type, status) => {
    const iconMap = {
      upgrade: 'TrendingUp',
      downgrade: 'TrendingDown',
      payment: 'CreditCard',
      renewal: 'RefreshCw',
      signup: 'UserPlus',
      cancellation: 'XCircle'
    };

    return iconMap?.[type] || 'Circle';
  };

  const getEventColor = (type, status) => {
    if (status === 'upcoming') return 'var(--color-warning)';
    if (status === 'failed') return 'var(--color-error)';
    
    const colorMap = {
      upgrade: 'var(--color-success)',
      downgrade: 'var(--color-warning)',
      payment: 'var(--color-primary)',
      renewal: 'var(--color-accent)',
      signup: 'var(--color-success)',
      cancellation: 'var(--color-error)'
    };

    return colorMap?.[type] || 'var(--color-muted-foreground)';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { bg: 'bg-success/10', text: 'text-success', label: 'Completed' },
      upcoming: { bg: 'bg-warning/10', text: 'text-warning', label: 'Upcoming' },
      failed: { bg: 'bg-error/10', text: 'text-error', label: 'Failed' },
      pending: { bg: 'bg-muted', text: 'text-muted-foreground', label: 'Pending' }
    };

    const config = statusConfig?.[status] || statusConfig?.pending;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config?.bg} ${config?.text}`}>
        {config?.label}
      </span>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-2">Subscription Timeline</h3>
        <p className="text-muted-foreground">
          Track your subscription history and upcoming events.
        </p>
      </div>

      {/* Upcoming Events */}
      {upcomingEvents?.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-foreground mb-4 flex items-center gap-2">
            <Icon name="Clock" size={16} />
            Upcoming Events
          </h4>
          <div className="space-y-3">
            {upcomingEvents?.map((event) => (
              <div key={event?.id} className="bg-warning/5 border border-warning/20 rounded-lg p-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Icon 
                      name={getEventIcon(event?.type, event?.status)} 
                      size={16} 
                      color={getEventColor(event?.type, event?.status)} 
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h5 className="font-medium text-foreground text-sm">{event?.title}</h5>
                        <p className="text-sm text-muted-foreground">{event?.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-muted-foreground">
                            {formatDate(event?.date)}
                          </span>
                          {getStatusBadge(event?.status)}
                        </div>
                      </div>
                      {event?.amount && (
                        <span className="text-sm font-medium text-foreground whitespace-nowrap">
                          {event?.amount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History */}
      <div>
        <h4 className="font-medium text-foreground mb-4 flex items-center gap-2">
          <Icon name="History" size={16} />
          History
        </h4>
        
        <div className="space-y-1">
          {timelineEvents?.map((event, index) => (
            <div key={event?.id} className="relative">
              <div className="flex items-start gap-3 py-3">
                {/* Timeline Line */}
                {index < timelineEvents?.length - 1 && (
                  <div className="absolute left-4 top-12 w-0.5 h-8 bg-border"></div>
                )}
                
                {/* Event Icon */}
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0 relative z-10">
                  <Icon 
                    name={getEventIcon(event?.type, event?.status)} 
                    size={16} 
                    color={getEventColor(event?.type, event?.status)} 
                  />
                </div>
                
                {/* Event Content */}
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h5 className="font-medium text-foreground text-sm">{event?.title}</h5>
                      <p className="text-sm text-muted-foreground">{event?.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(event?.date)}
                        </span>
                        {event?.status !== 'completed' && getStatusBadge(event?.status)}
                      </div>
                    </div>
                    {event?.amount && (
                      <span className={`text-sm font-medium whitespace-nowrap ${
                        event?.amount?.startsWith('+') ? 'text-success' : 'text-foreground'
                      }`}>
                        {event?.amount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors duration-200">
            <Icon name="Download" size={16} />
            Download Invoice
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors duration-200">
            <Icon name="Receipt" size={16} />
            View All Invoices
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTimeline;