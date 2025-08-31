import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const BillingDetails = ({ onUpdate }) => {
  // Mock billing details
  const billingInfo = {
    companyName: 'Kampala International School',
    contactEmail: 'billing@kis.ac.ug',
    phone: '+256-700-123456',
    address: {
      street: '123 Education Avenue',
      city: 'Kampala',
      state: 'Central Region',
      postalCode: '256001',
      country: 'Uganda'
    },
    taxId: 'TIN-123456789'
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="FileText" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Billing Details</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onUpdate}
          iconName="Edit"
        >
          Edit
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-muted-foreground">Organization</label>
          <p className="font-medium text-foreground">{billingInfo?.companyName}</p>
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Contact Email</label>
          <p className="font-medium text-foreground">{billingInfo?.contactEmail}</p>
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Phone</label>
          <p className="font-medium text-foreground">{billingInfo?.phone}</p>
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Billing Address</label>
          <div className="text-foreground">
            <p>{billingInfo?.address?.street}</p>
            <p>{billingInfo?.address?.city}, {billingInfo?.address?.state}</p>
            <p>{billingInfo?.address?.postalCode}</p>
            <p>{billingInfo?.address?.country}</p>
          </div>
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Tax ID</label>
          <p className="font-medium text-foreground">{billingInfo?.taxId}</p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={16} className="text-accent mt-1" />
          <div>
            <p className="text-sm text-foreground mb-1">
              <strong>Important:</strong> Billing information is used for invoices and receipts.
            </p>
            <p className="text-xs text-muted-foreground">
              Changes will be applied to future invoices. Contact support for invoice corrections.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingDetails;