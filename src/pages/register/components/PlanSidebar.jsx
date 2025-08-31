import React from 'react';
import Icon from '../../../components/AppIcon';

const PlanSidebar = ({ selectedPlan }) => {
  const complianceFeatures = [
    'UNEB Standards Compliance',
    'Official Grade Boundaries',
    'Standardized Report Formats',
    'Academic Calendar Integration',
    'Ministry of Education Approved'
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    })?.format(price);
  };

  if (!selectedPlan) {
    return (
      <div className="hidden lg:block w-80 bg-card border-l border-border p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Package" size={32} className="text-muted-foreground" />
          </div>
          <h3 className="font-medium text-foreground mb-2">Select a Plan</h3>
          <p className="text-sm text-muted-foreground">
            Choose a subscription plan to see detailed information and pricing.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden lg:block w-80 bg-card border-l border-border">
      <div className="p-6 border-b border-border">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Crown" size={32} color="var(--color-primary-foreground)" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-1">{selectedPlan?.name} Plan</h3>
          <div className="text-2xl font-bold text-primary mb-2">
            {formatPrice(selectedPlan?.price)}
            <span className="text-sm font-normal text-muted-foreground">/month</span>
          </div>
          <p className="text-sm text-muted-foreground">{selectedPlan?.description}</p>
        </div>
      </div>
      <div className="p-6 space-y-6">
        <div>
          <h4 className="font-medium text-foreground mb-3 flex items-center">
            <Icon name="CheckCircle" size={16} className="text-success mr-2" />
            What's Included
          </h4>
          <div className="space-y-2">
            {selectedPlan?.features?.map((feature, index) => (
              <div key={index} className="flex items-start space-x-2">
                <Icon name="Check" size={14} className="text-success mt-0.5 flex-shrink-0" />
                <span className="text-sm text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <h4 className="font-medium text-foreground mb-3 flex items-center">
            <Icon name="Shield" size={16} className="text-primary mr-2" />
            UNEB Compliance
          </h4>
          <div className="space-y-2">
            {complianceFeatures?.map((feature, index) => (
              <div key={index} className="flex items-start space-x-2">
                <Icon name="Check" size={14} className="text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={16} className="text-success mt-0.5" />
            <div>
              <p className="text-sm font-medium text-success">30-Day Free Trial</p>
              <p className="text-xs text-success/80 mt-1">
                Start with a free trial. No payment required until trial ends.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center pt-4">
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Secure payment via Paystack</p>
            <p>Cancel anytime • No setup fees</p>
            <p>24/7 customer support</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanSidebar;