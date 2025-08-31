import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SubscriptionOverview = ({ subscription, onUpgrade }) => {
  const progressPercentage = (subscription?.studentsUsed / subscription?.studentsIncluded) * 100;

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="CreditCard" size={24} className="text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Current Subscription</h2>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          subscription?.status === 'active' ?'bg-success/10 text-success'
            : subscription?.status === 'cancelled' ?'bg-error/10 text-error' :'bg-warning/10 text-warning'
        }`}>
          {subscription?.status?.charAt(0)?.toUpperCase() + subscription?.status?.slice(1)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Plan Details */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Current Plan</p>
          <p className="text-2xl font-bold text-primary">{subscription?.plan}</p>
        </div>

        {/* Next Billing */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Next Billing</p>
          <p className="text-lg font-semibold text-foreground">
            {new Date(subscription?.nextBillingDate)?.toLocaleDateString()}
          </p>
        </div>

        {/* Monthly Cost */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Monthly Cost</p>
          <p className="text-lg font-semibold text-foreground">
            {subscription?.currency} {subscription?.amount?.toLocaleString()}
          </p>
        </div>

        {/* Students Usage */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Students Used</p>
          <p className="text-lg font-semibold text-foreground">
            {subscription?.studentsUsed} / {subscription?.studentsIncluded}
          </p>
        </div>
      </div>

      {/* Usage Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">Student Capacity</span>
          <span className="text-sm font-medium text-foreground">
            {progressPercentage?.toFixed(1)}% used
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              progressPercentage > 90 
                ? 'bg-error' 
                : progressPercentage > 75 
                  ? 'bg-warning' :'bg-success'
            }`}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
        {progressPercentage > 90 && (
          <p className="text-sm text-warning mt-2 flex items-center">
            <Icon name="AlertTriangle" size={14} className="mr-1" />
            Approaching student limit. Consider upgrading your plan.
          </p>
        )}
      </div>

      {/* Features List */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-foreground mb-3">Plan Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {subscription?.features?.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Icon name="Check" size={16} className="text-success" />
              <span className="text-sm text-foreground">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={onUpgrade}
          className="flex-1 sm:flex-none"
          iconName="ArrowUp"
        >
          Upgrade Plan
        </Button>
        <Button
          variant="outline"
          className="flex-1 sm:flex-none"
          iconName="Settings"
        >
          Manage Subscription
        </Button>
        <Button
          variant="ghost"
          className="flex-1 sm:flex-none text-muted-foreground hover:text-foreground"
          iconName="Download"
        >
          Download Receipt
        </Button>
      </div>
    </div>
  );
};

export default SubscriptionOverview;