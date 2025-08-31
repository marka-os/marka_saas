import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import MetricCard from './components/MetricCard';
import GradeDistributionChart from './components/GradeDistributionChart';
import AssessmentTrendsChart from './components/AssessmentTrendsChart';
import ClassPerformanceChart from './components/ClassPerformanceChart';
import RecentActivityFeed from './components/RecentActivityFeed';
import QuickActions from './components/QuickActions';
import SubscriptionStatus from './components/SubscriptionStatus';

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock data for metrics
  const metricsData = [
    {
      title: 'Total Students',
      value: '1,247',
      change: '+12%',
      changeType: 'positive',
      icon: 'Users',
      description: 'Active enrollments',
      onClick: () => navigate('/student-management')
    },
    {
      title: 'Active Assessments',
      value: '89',
      change: '+5%',
      changeType: 'positive',
      icon: 'ClipboardList',
      description: 'Ongoing evaluations',
      onClick: () => navigate('/assessment-input')
    },
    {
      title: 'Pending Reports',
      value: '23',
      change: '-8%',
      changeType: 'negative',
      icon: 'FileText',
      description: 'Awaiting generation',
      onClick: () => navigate('/report-card-generation')
    },
    {
      title: 'System Health',
      value: '98.5%',
      change: '+0.2%',
      changeType: 'positive',
      icon: 'Activity',
      description: 'Uptime status'
    }
  ];

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's an overview of your school's performance and activities.
            </p>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {metricsData?.map((metric, index) => (
              <MetricCard
                key={index}
                title={metric?.title}
                value={metric?.value}
                change={metric?.change}
                changeType={metric?.changeType}
                icon={metric?.icon}
                description={metric?.description}
                onClick={metric?.onClick}
              />
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            <div className="xl:col-span-1">
              <GradeDistributionChart />
            </div>
            <div className="xl:col-span-1">
              <ClassPerformanceChart />
            </div>
          </div>

          {/* Assessment Trends - Full Width */}
          <div className="mb-8">
            <AssessmentTrendsChart />
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Recent Activity - Takes 2 columns on xl screens */}
            <div className="xl:col-span-2">
              <RecentActivityFeed />
            </div>
            
            {/* Right Sidebar Content */}
            <div className="xl:col-span-1 space-y-6">
              <SubscriptionStatus />
              <QuickActions />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;