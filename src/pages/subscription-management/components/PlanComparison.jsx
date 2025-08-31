import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PlanComparison = ({ currentPlan, onPlanChange }) => {
  const plans = [
    {
      name: 'Basic',
      price: 99,
      billing: 'monthly',
      description: 'Perfect for small schools getting started',
      features: {
        students: '100',
        assessments: 'Unlimited',
        storage: '2GB',
        support: 'Email',
        analytics: 'Basic',
        customization: 'Limited',
        integrations: '5',
        users: '3'
      },
      highlights: ['Cost-effective', 'Easy setup']
    },
    {
      name: 'Professional',
      price: 299,
      billing: 'monthly',
      description: 'Great for growing schools with advanced needs',
      popular: true,
      features: {
        students: '500',
        assessments: 'Unlimited',
        storage: '10GB',
        support: 'Priority',
        analytics: 'Advanced',
        customization: 'Full',
        integrations: '25',
        users: '10'
      },
      highlights: ['Most popular', 'Advanced features']
    },
    {
      name: 'Enterprise',
      price: 599,
      billing: 'monthly',
      description: 'For large institutions with custom requirements',
      features: {
        students: 'Unlimited',
        assessments: 'Unlimited',
        storage: '100GB',
        support: 'Dedicated',
        analytics: 'Enterprise',
        customization: 'Custom',
        integrations: 'Unlimited',
        users: 'Unlimited'
      },
      highlights: ['Maximum scale', 'Custom solutions']
    }
  ];

  const featureLabels = {
    students: 'Students',
    assessments: 'Assessments',
    storage: 'Storage',
    support: 'Support',
    analytics: 'Analytics',
    customization: 'Customization',
    integrations: 'Integrations',
    users: 'Admin Users'
  };

  const getButtonText = (planName) => {
    if (planName === currentPlan) return 'Current Plan';
    return planName === 'Basic' ? 'Downgrade' : 'Upgrade';
  };

  const getButtonAction = (planName) => {
    if (planName === currentPlan) return null;
    return planName === 'Basic' ? 'downgrade' : 'upgrade';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-2">Compare Plans</h3>
        <p className="text-muted-foreground">
          Choose the plan that best fits your school's needs and scale.
        </p>
      </div>
      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-4 pr-4 text-sm font-medium text-muted-foreground">Features</th>
                {plans?.map((plan) => (
                  <th key={plan?.name} className="text-center py-4 px-4 min-w-[200px]">
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <h4 className="font-semibold text-foreground">{plan?.name}</h4>
                        {plan?.popular && (
                          <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                            Popular
                          </span>
                        )}
                        {plan?.name === currentPlan && (
                          <span className="bg-success text-success-foreground text-xs px-2 py-1 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-2xl font-bold text-foreground">${plan?.price}</span>
                        <span className="text-muted-foreground text-sm">/{plan?.billing}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{plan?.description}</p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(featureLabels)?.map(([key, label]) => (
                <tr key={key} className="border-t border-border">
                  <td className="py-3 pr-4 text-sm font-medium text-foreground">{label}</td>
                  {plans?.map((plan) => (
                    <td key={plan?.name} className="py-3 px-4 text-center">
                      <span className="text-sm text-foreground">{plan?.features?.[key]}</span>
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-border">
                <td className="py-6 pr-4"></td>
                {plans?.map((plan) => (
                  <td key={plan?.name} className="py-6 px-4 text-center">
                    <Button
                      variant={plan?.name === currentPlan ? 'outline' : 'default'}
                      size="sm"
                      disabled={plan?.name === currentPlan}
                      onClick={() => onPlanChange?.(plan, getButtonAction(plan?.name))}
                      fullWidth
                    >
                      {getButtonText(plan?.name)}
                    </Button>
                    <div className="mt-2 space-y-1">
                      {plan?.highlights?.map((highlight, index) => (
                        <div key={index} className="flex items-center justify-center gap-1">
                          <Icon name="Star" size={12} color="var(--color-warning)" />
                          <span className="text-xs text-muted-foreground">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* Mobile Card View */}
      <div className="lg:hidden space-y-6">
        {plans?.map((plan) => (
          <div key={plan?.name} className="border border-border rounded-lg p-4 relative">
            {plan?.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            )}
            {plan?.name === currentPlan && (
              <div className="absolute -top-3 right-4">
                <span className="bg-success text-success-foreground text-xs px-3 py-1 rounded-full">
                  Current Plan
                </span>
              </div>
            )}

            <div className="text-center mb-4">
              <h4 className="text-lg font-semibold text-foreground">{plan?.name}</h4>
              <div className="flex items-baseline justify-center gap-1 mt-1">
                <span className="text-2xl font-bold text-foreground">${plan?.price}</span>
                <span className="text-muted-foreground">/{plan?.billing}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{plan?.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {Object.entries(plan?.features)?.map(([key, value]) => (
                <div key={key} className="text-center">
                  <div className="text-sm font-medium text-foreground">{value}</div>
                  <div className="text-xs text-muted-foreground">{featureLabels?.[key]}</div>
                </div>
              ))}
            </div>

            <Button
              variant={plan?.name === currentPlan ? 'outline' : 'default'}
              size="sm"
              disabled={plan?.name === currentPlan}
              onClick={() => onPlanChange?.(plan, getButtonAction(plan?.name))}
              fullWidth
              className="mb-3"
            >
              {getButtonText(plan?.name)}
            </Button>

            <div className="flex flex-wrap justify-center gap-2">
              {plan?.highlights?.map((highlight, index) => (
                <div key={index} className="flex items-center gap-1">
                  <Icon name="Star" size={12} color="var(--color-warning)" />
                  <span className="text-xs text-muted-foreground">{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanComparison;