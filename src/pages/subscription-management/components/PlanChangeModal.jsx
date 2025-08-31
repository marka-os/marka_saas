import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PlanChangeModal = ({ currentPlan, selectedPlan, onClose, onConfirm }) => {
  const [effectiveDate, setEffectiveDate] = useState('immediate');
  const [confirmationChecked, setConfirmationChecked] = useState(false);

  const isUpgrade = selectedPlan?.action === 'upgrade';
  const isDowngrade = selectedPlan?.action === 'downgrade';

  const getChangeImpact = () => {
    if (isUpgrade) {
      return {
        type: 'upgrade',
        title: `Upgrade to ${selectedPlan?.name}`,
        description: 'You\'ll gain access to additional features and higher limits.',
        priceChange: selectedPlan?.price - currentPlan?.price,
        features: {
          added: ['Advanced analytics', 'Priority support', 'Custom integrations'],
          removed: []
        }
      };
    } else {
      return {
        type: 'downgrade',
        title: `Downgrade to ${selectedPlan?.name}`,
        description: 'Some features and limits will be reduced.',
        priceChange: selectedPlan?.price - currentPlan?.price,
        features: {
          added: [],
          removed: ['Advanced analytics', 'Priority support', 'Custom integrations']
        }
      };
    }
  };

  const impact = getChangeImpact();

  const handleConfirm = () => {
    if (!confirmationChecked) return;

    onConfirm?.({
      currentPlan: currentPlan?.name,
      newPlan: selectedPlan?.name,
      action: selectedPlan?.action,
      effectiveDate,
      priceChange: impact?.priceChange
    });
  };

  const formatDate = (option) => {
    const today = new Date();
    if (option === 'immediate') {
      return 'Immediately';
    } else if (option === 'next_cycle') {
      const nextMonth = new Date(today?.getFullYear(), today?.getMonth() + 1, 1);
      return nextMonth?.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return option;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-1100">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isUpgrade ? 'bg-success/10' : 'bg-warning/10'
            }`}>
              <Icon 
                name={isUpgrade ? 'TrendingUp' : 'TrendingDown'} 
                size={20} 
                color={isUpgrade ? 'var(--color-success)' : 'var(--color-warning)'} 
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{impact?.title}</h2>
              <p className="text-sm text-muted-foreground">{impact?.description}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Plan Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-border rounded-lg p-4">
              <div className="text-center">
                <h3 className="font-medium text-foreground mb-2">Current Plan</h3>
                <div className="text-2xl font-bold text-foreground">{currentPlan?.name}</div>
                <div className="text-muted-foreground">${currentPlan?.price}/month</div>
              </div>
            </div>
            
            <div className="border border-primary rounded-lg p-4 bg-primary/5">
              <div className="text-center">
                <h3 className="font-medium text-foreground mb-2">New Plan</h3>
                <div className="text-2xl font-bold text-primary">{selectedPlan?.name}</div>
                <div className="text-muted-foreground">${selectedPlan?.price}/month</div>
              </div>
            </div>
          </div>

          {/* Price Impact */}
          <div className={`p-4 rounded-lg border ${
            impact?.priceChange > 0 
              ? 'bg-warning/10 border-warning/20' :'bg-success/10 border-success/20'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-foreground">
                  {impact?.priceChange > 0 ? 'Additional Cost' : 'Monthly Savings'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {impact?.priceChange > 0 ? 'You will be charged' : 'You will save'} this amount monthly
                </p>
              </div>
              <div className={`text-2xl font-bold ${
                impact?.priceChange > 0 ? 'text-warning' : 'text-success'
              }`}>
                {impact?.priceChange > 0 ? '+' : ''}${Math.abs(impact?.priceChange)}
              </div>
            </div>
          </div>

          {/* Feature Changes */}
          {(impact?.features?.added?.length > 0 || impact?.features?.removed?.length > 0) && (
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">What Changes</h4>
              
              {impact?.features?.added?.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-success">✓ Features You'll Gain</h5>
                  <div className="space-y-1">
                    {impact?.features?.added?.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-foreground">
                        <Icon name="Plus" size={14} color="var(--color-success)" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {impact?.features?.removed?.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-warning">⚠ Features You'll Lose</h5>
                  <div className="space-y-1">
                    {impact?.features?.removed?.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-foreground">
                        <Icon name="Minus" size={14} color="var(--color-warning)" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Effective Date */}
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">When should this take effect?</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/30 cursor-pointer transition-colors duration-200">
                <input
                  type="radio"
                  name="effectiveDate"
                  value="immediate"
                  checked={effectiveDate === 'immediate'}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                  className="w-4 h-4 text-primary"
                />
                <div className="flex-1">
                  <div className="font-medium text-foreground text-sm">Immediately</div>
                  <div className="text-xs text-muted-foreground">
                    {isUpgrade ? 'Pro-rated charges will apply' : 'Credits will be applied to next bill'}
                  </div>
                </div>
              </label>
              
              <label className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/30 cursor-pointer transition-colors duration-200">
                <input
                  type="radio"
                  name="effectiveDate"
                  value="next_cycle"
                  checked={effectiveDate === 'next_cycle'}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                  className="w-4 h-4 text-primary"
                />
                <div className="flex-1">
                  <div className="font-medium text-foreground text-sm">Next billing cycle</div>
                  <div className="text-xs text-muted-foreground">
                    Changes will take effect on {formatDate('next_cycle')}
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Confirmation */}
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmationChecked}
                onChange={(e) => setConfirmationChecked(e.target.checked)}
                className="w-4 h-4 text-primary mt-0.5"
              />
              <div className="text-sm text-foreground">
                I understand the changes to my subscription and authorize the {isUpgrade ? 'upgrade' : 'downgrade'} to {selectedPlan?.name} plan.
                {effectiveDate === 'immediate' && (
                  <span className="block text-muted-foreground mt-1">
                    {isUpgrade 
                      ? 'I will be charged a pro-rated amount for the remaining billing period.' 
                      : 'Any unused credits will be applied to my next billing cycle.'}
                  </span>
                )}
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Effective: {formatDate(effectiveDate)}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleConfirm}
              disabled={!confirmationChecked}
              className={isUpgrade ? 'bg-success hover:bg-success/90' : 'bg-warning hover:bg-warning/90'}
            >
              {isUpgrade ? 'Upgrade Plan' : 'Downgrade Plan'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanChangeModal;