import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import CurrentPlanHero from './components/CurrentPlanHero';
import PlanComparison from './components/PlanComparison';
import UsageAnalytics from './components/UsageAnalytics';
import SubscriptionTimeline from './components/SubscriptionTimeline';
import PlanChangeModal from './components/PlanChangeModal';

const SubscriptionManagement = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [currentPlan, setCurrentPlan] = useState({
    name: 'Professional',
    price: 299,
    billing: 'monthly',
    renewalDate: '2025-09-30',
    status: 'active',
    features: [
      'Up to 500 students',
      'Unlimited assessments',
      'Advanced analytics',
      '10GB storage',
      'Priority support'
    ]
  });

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handlePlanChange = (plan, action) => {
    setSelectedPlan({ ...plan, action });
    setShowPlanModal(true);
  };

  const handleModalClose = () => {
    setShowPlanModal(false);
    setSelectedPlan(null);
  };

  const handlePlanConfirm = (planData) => {
    console.log('Plan change confirmed:', planData);
    // Here you would typically make an API call to update the subscription
    setShowPlanModal(false);
    setSelectedPlan(null);
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Subscription Management</h1>
            <p className="text-muted-foreground">
              Manage your subscription plan, monitor usage, and upgrade or downgrade as needed.
            </p>
          </div>

          {/* Current Plan Hero Section */}
          <div className="mb-8">
            <CurrentPlanHero 
              plan={currentPlan}
              onPlanChange={handlePlanChange}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            {/* Plan Comparison - Takes 2 columns */}
            <div className="xl:col-span-2">
              <PlanComparison 
                currentPlan={currentPlan?.name}
                onPlanChange={handlePlanChange}
              />
            </div>

            {/* Subscription Timeline */}
            <div className="xl:col-span-1">
              <SubscriptionTimeline />
            </div>
          </div>

          {/* Usage Analytics */}
          <div className="mb-8">
            <UsageAnalytics />
          </div>
        </div>
      </main>

      {/* Plan Change Modal */}
      {showPlanModal && selectedPlan && (
        <PlanChangeModal
          currentPlan={currentPlan}
          selectedPlan={selectedPlan}
          onClose={handleModalClose}
          onConfirm={handlePlanConfirm}
        />
      )}
    </div>
  );
};

export default SubscriptionManagement;