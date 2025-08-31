import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import SubscriptionOverview from './components/SubscriptionOverview';
import InvoiceHistory from './components/InvoiceHistory';
import BillingDetails from './components/BillingDetails';
import PaymentMethods from './components/PaymentMethods';

const BillingManagement = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Mock subscription data
  const subscriptionData = {
    plan: 'Professional',
    status: 'active',
    nextBillingDate: '2024-02-15',
    amount: 150000,
    currency: 'UGX',
    studentsIncluded: 500,
    studentsUsed: 247,
    features: [
      'Unlimited Students',
      'Advanced Reports',
      'Parent Portal',
      'SMS Notifications',
      '24/7 Support'
    ]
  };

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleInvoiceClick = (invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  const handleDownloadInvoice = (invoice) => {
    console.log('Downloading invoice:', invoice?.id);
    // Mock download functionality
  };

  const handleUpgradePlan = () => {
    console.log('Upgrading plan...');
    // Mock upgrade functionality
  };

  const handleUpdateBilling = () => {
    console.log('Updating billing information...');
    // Mock update functionality
  };

  // Handle responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header 
        onMenuToggle={handleMenuToggle}
        isMenuOpen={sidebarOpen}
      />
      
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        isOpen={sidebarOpen}
        onClose={handleSidebarClose}
      />
      
      {/* Main Content */}
      <main 
        className={`
          pt-16 transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-72'}
        `}
      >
        <div className="p-6">
          {/* Breadcrumb */}
          <Breadcrumb />

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-foreground mb-2">Billing Management</h1>
              <p className="text-muted-foreground">
                Manage your subscription, view invoices, and update payment information
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleUpdateBilling}
                iconName="Settings"
              >
                Update Billing
              </Button>
              <Button
                onClick={handleUpgradePlan}
                className="bg-primary hover:bg-primary/90"
                iconName="ArrowUp"
              >
                Upgrade Plan
              </Button>
            </div>
          </div>

          {/* Subscription Overview */}
          <div className="mb-8">
            <SubscriptionOverview 
              subscription={subscriptionData}
              onUpgrade={handleUpgradePlan}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Invoice History - Takes 2 columns on xl screens */}
            <div className="xl:col-span-2">
              <InvoiceHistory 
                onInvoiceClick={handleInvoiceClick}
                onDownloadInvoice={handleDownloadInvoice}
              />
            </div>
            
            {/* Right Sidebar Content */}
            <div className="xl:col-span-1 space-y-6">
              <BillingDetails onUpdate={handleUpdateBilling} />
              <PaymentMethods />
            </div>
          </div>
        </div>
      </main>

      {/* Invoice Detail Modal */}
      {showInvoiceModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-modal max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">
                  Invoice #{selectedInvoice?.number}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowInvoiceModal(false)}
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Issue Date:</span>
                  <span className="font-medium">{selectedInvoice?.date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-bold text-lg">
                    UGX {selectedInvoice?.amount?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedInvoice?.status === 'paid' ?'bg-success/10 text-success'
                      : selectedInvoice?.status === 'overdue' ?'bg-error/10 text-error' :'bg-warning/10 text-warning'
                  }`}>
                    {selectedInvoice?.status?.charAt(0)?.toUpperCase() + selectedInvoice?.status?.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => handleDownloadInvoice(selectedInvoice)}
                  >
                    Download PDF
                  </Button>
                  <Button onClick={() => setShowInvoiceModal(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingManagement;