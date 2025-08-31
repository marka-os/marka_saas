import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CurrentPlanHero = ({ plan, onPlanChange }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-success bg-success/10';
      case 'expiring':
        return 'text-warning bg-warning/10';
      case 'expired':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Plan Information */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Crown" size={24} color="var(--color-primary)" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{plan?.name} Plan</h2>
              <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${getStatusColor(plan?.status)}`}>
                <Icon 
                  name={plan?.status === 'active' ? 'CheckCircle' : 'AlertCircle'} 
                  size={14} 
                  className="mr-1.5" 
                />
                {plan?.status?.charAt(0)?.toUpperCase() + plan?.status?.slice(1)}
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-3xl font-bold text-foreground">${plan?.price}</span>
            <span className="text-muted-foreground">/{plan?.billing}</span>
            <span className="text-sm text-muted-foreground ml-2">
              Renews on {formatDate(plan?.renewalDate)}
            </span>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {plan?.features?.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <Icon name="Check" size={16} color="var(--color-success)" />
                <span className="text-sm text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:min-w-[200px]">
          <Button
            variant="default"
            size="lg"
            fullWidth
            onClick={() => onPlanChange?.({ name: 'Enterprise' }, 'upgrade')}
            className="flex items-center justify-center gap-2"
          >
            <Icon name="TrendingUp" size={18} />
            Upgrade Plan
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            fullWidth
            onClick={() => onPlanChange?.({ name: 'Basic' }, 'downgrade')}
            className="flex items-center justify-center gap-2"
          >
            <Icon name="TrendingDown" size={18} />
            Downgrade Plan
          </Button>

          <Button
            variant="ghost"
            size="lg"
            fullWidth
            className="flex items-center justify-center gap-2"
          >
            <Icon name="Settings" size={18} />
            Manage Billing
          </Button>
        </div>
      </div>

      {/* Usage Progress Indicators */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Students</span>
              <span className="font-medium text-foreground">347 / 500</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: '69.4%' }}></div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Storage</span>
              <span className="font-medium text-foreground">6.8 / 10 GB</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-warning h-2 rounded-full transition-all duration-300" style={{ width: '68%' }}></div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">API Calls</span>
              <span className="font-medium text-foreground">4.2K / 10K</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-success h-2 rounded-full transition-all duration-300" style={{ width: '42%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentPlanHero;