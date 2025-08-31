import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PaymentMethods = () => {
  const [paymentMethods] = useState([
    {
      id: 1,
      type: 'mobile_money',
      provider: 'MTN Mobile Money',
      number: '***-***-1234',
      isDefault: true,
      lastUsed: '2024-01-15'
    },
    {
      id: 2,
      type: 'bank_transfer',
      provider: 'Bank Transfer',
      account: 'Stanbic Bank ***-123',
      isDefault: false,
      lastUsed: '2023-12-15'
    }
  ]);

  const getPaymentIcon = (type) => {
    switch (type) {
      case 'mobile_money':
        return 'Smartphone';
      case 'bank_transfer':
        return 'Building';
      case 'card':
        return 'CreditCard';
      default:
        return 'DollarSign';
    }
  };

  const getProviderColor = (provider) => {
    if (provider?.includes('MTN')) return 'text-warning';
    if (provider?.includes('Airtel')) return 'text-error';
    return 'text-primary';
  };

  const handleAddPaymentMethod = () => {
    console.log('Adding new payment method...');
    // Mock add payment method functionality
  };

  const handleSetDefault = (methodId) => {
    console.log('Setting payment method as default:', methodId);
    // Mock set default functionality
  };

  const handleRemoveMethod = (methodId) => {
    console.log('Removing payment method:', methodId);
    // Mock remove payment method functionality
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Wallet" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Payment Methods</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddPaymentMethod}
          iconName="Plus"
        >
          Add Method
        </Button>
      </div>

      <div className="space-y-4">
        {paymentMethods?.map((method) => (
          <div 
            key={method?.id} 
            className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-muted`}>
                  <Icon 
                    name={getPaymentIcon(method?.type)} 
                    size={20} 
                    className={getProviderColor(method?.provider)}
                  />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-foreground">{method?.provider}</p>
                    {method?.isDefault && (
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {method?.number || method?.account}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Last used: {new Date(method?.lastUsed)?.toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                {!method?.isDefault && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSetDefault(method?.id)}
                    className="text-xs"
                  >
                    Set Default
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveMethod(method?.id)}
                  iconName="Trash2"
                  className="text-error hover:text-error"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-start space-x-3">
          <Icon name="Shield" size={16} className="text-success mt-1" />
          <div>
            <p className="text-sm text-foreground mb-1">
              <strong>Secure Payments</strong>
            </p>
            <p className="text-xs text-muted-foreground">
              All payment information is encrypted and processed securely. We never store sensitive payment data.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-start space-x-3">
          <Icon name="Clock" size={16} className="text-warning mt-1" />
          <div>
            <p className="text-sm text-foreground mb-1">
              <strong>Auto-renewal Notice</strong>
            </p>
            <p className="text-xs text-muted-foreground">
              Your subscription will automatically renew using your default payment method 3 days before the billing date.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;