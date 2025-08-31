import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SubscriptionStatus = () => {
  const subscriptionData = {
    plan: 'Pro Plan',
    status: 'Active',
    expiryDate: '2024-12-31',
    studentsUsed: 847,
    studentsLimit: 1000,
    features: [
      'Unlimited Assessments',
      'Advanced Analytics',
      'Custom Report Templates',
      'Priority Support'
    ]
  };

  const usagePercentage = (subscriptionData?.studentsUsed / subscriptionData?.studentsLimit) * 100;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground mb-2">Subscription Status</h3>
          <p className="text-sm text-muted-foreground">Current plan and usage details</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full"></div>
          <span className="text-sm font-medium text-success">{subscriptionData?.status}</span>
        </div>
      </div>
      <div className="space-y-4">
        {/* Plan Information */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Crown" size={20} color="var(--color-primary)" />
            </div>
            <div>
              <h4 className="font-medium text-card-foreground">{subscriptionData?.plan}</h4>
              <p className="text-sm text-muted-foreground">
                Expires on {new Date(subscriptionData.expiryDate)?.toLocaleDateString('en-GB')}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Manage Plan
          </Button>
        </div>

        {/* Usage Statistics */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-card-foreground">Student Usage</span>
            <span className="text-sm text-muted-foreground">
              {subscriptionData?.studentsUsed} / {subscriptionData?.studentsLimit}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${usagePercentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-muted-foreground">
            {(100 - usagePercentage)?.toFixed(1)}% capacity remaining
          </p>
        </div>

        {/* Features List */}
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-card-foreground">Included Features</h5>
          <div className="grid grid-cols-1 gap-2">
            {subscriptionData?.features?.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Icon name="Check" size={14} color="var(--color-success)" />
                <span className="text-sm text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button variant="outline" size="sm" iconName="CreditCard" iconPosition="left">
            Billing History
          </Button>
          <Button variant="ghost" size="sm" iconName="ArrowUpCircle" iconPosition="left">
            Upgrade Plan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionStatus;