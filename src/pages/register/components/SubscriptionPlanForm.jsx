import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SubscriptionPlanForm = ({ formData, setFormData, errors }) => {
  const plans = [
    {
      id: 'standard',
      name: 'Standard',
      price: 150000,
      currency: 'UGX',
      period: 'month',
      description: 'Perfect for small to medium schools',
      features: [
        'Up to 500 students',
        'Basic report card generation',
        'Student management',
        'Assessment input',
        'Email support',
        'UNEB compliance'
      ],
      limitations: [
        'Limited customization',
        'Basic analytics'
      ],
      popular: false
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 300000,
      currency: 'UGX',
      period: 'month',
      description: 'Advanced features for growing schools',
      features: [
        'Up to 1,500 students',
        'Advanced report cards',
        'Custom branding',
        'Bulk operations',
        'Advanced analytics',
        'Parent portal access',
        'Priority support',
        'UNEB compliance',
        'Data export tools'
      ],
      limitations: [],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 500000,
      currency: 'UGX',
      period: 'month',
      description: 'Complete solution for large institutions',
      features: [
        'Unlimited students',
        'Multi-campus support',
        'Full customization',
        'API access',
        'Advanced integrations',
        'Dedicated support',
        'Custom training',
        'UNEB compliance',
        'White-label options'
      ],
      limitations: [],
      popular: false
    }
  ];

  const handlePlanSelect = (planId) => {
    const selectedPlan = plans?.find(plan => plan?.id === planId);
    setFormData(prev => ({
      ...prev,
      subscription: {
        ...prev?.subscription,
        planId: planId,
        planName: selectedPlan?.name,
        price: selectedPlan?.price,
        currency: selectedPlan?.currency
      }
    }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    })?.format(price);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Choose Your Plan</h2>
        <p className="text-muted-foreground">Select the subscription plan that best fits your school's needs</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans?.map((plan) => {
          const isSelected = formData?.subscription?.planId === plan?.id;
          
          return (
            <div
              key={plan?.id}
              className={`
                relative border-2 rounded-xl p-6 cursor-pointer transition-all duration-300
                ${isSelected 
                  ? 'border-primary bg-primary/5 shadow-lg' 
                  : 'border-border bg-card hover:border-primary/50 hover:shadow-md'
                }
              `}
              onClick={() => handlePlanSelect(plan?.id)}
            >
              {plan?.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">{plan?.name}</h3>
                <div className="mb-2">
                  <span className="text-3xl font-bold text-foreground">{formatPrice(plan?.price)}</span>
                  <span className="text-muted-foreground">/{plan?.period}</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan?.description}</p>
              </div>
              <div className="space-y-3 mb-6">
                {plan?.features?.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Icon name="Check" size={16} className="text-success mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
                
                {plan?.limitations?.map((limitation, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Icon name="X" size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{limitation}</span>
                  </div>
                ))}
              </div>
              <Button
                variant={isSelected ? "default" : "outline"}
                fullWidth
                className="mb-4"
              >
                {isSelected ? 'Selected' : 'Select Plan'}
              </Button>
              {isSelected && (
                <div className="absolute inset-0 border-2 border-primary rounded-xl pointer-events-none">
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Icon name="Check" size={14} color="var(--color-primary-foreground)" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {formData?.subscription?.planId && (
        <div className="bg-muted rounded-lg p-6 mt-8">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="CreditCard" size={24} color="var(--color-primary-foreground)" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-foreground mb-2">Payment Information</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Your subscription will be processed securely through Paystack. You can cancel or change your plan anytime.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Selected Plan:</span>
                  <span className="ml-2 font-medium text-foreground">
                    {plans?.find(p => p?.id === formData?.subscription?.planId)?.name}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Monthly Cost:</span>
                  <span className="ml-2 font-medium text-foreground">
                    {formatPrice(formData?.subscription?.price)}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Billing Cycle:</span>
                  <span className="ml-2 font-medium text-foreground">Monthly</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Next Billing:</span>
                  <span className="ml-2 font-medium text-foreground">
                    {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)?.toLocaleDateString('en-GB')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {errors?.subscription && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="AlertCircle" size={20} className="text-error mt-0.5" />
            <p className="text-sm text-error">{errors?.subscription}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlanForm;