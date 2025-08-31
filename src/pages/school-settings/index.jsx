import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import GeneralSettings from './components/GeneralSettings';
import AcademicSettings from './components/AcademicSettings';
import UserManagementSettings from './components/UserManagementSettings';
import SystemPreferences from './components/SystemPreferences';

const SchoolSettings = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const tabs = [
    {
      id: 'general',
      label: 'General Information',
      icon: 'Building',
      description: 'School profile and basic information'
    },
    {
      id: 'academic',
      label: 'Academic Configuration',
      icon: 'BookOpen',
      description: 'Grade boundaries and assessment settings'
    },
    {
      id: 'users',
      label: 'User Management',
      icon: 'Users',
      description: 'Role-based access controls'
    },
    {
      id: 'system',
      label: 'System Preferences',
      icon: 'Settings',
      description: 'Notifications and integrations'
    }
  ];

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleSaveChanges = () => {
    // Mock save functionality
    console.log('Saving changes...');
    setHasUnsavedChanges(false);
  };

  const handleResetDefaults = () => {
    // Mock reset functionality
    console.log('Resetting to defaults...');
    setHasUnsavedChanges(false);
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings onChanges={setHasUnsavedChanges} />;
      case 'academic':
        return <AcademicSettings onChanges={setHasUnsavedChanges} />;
      case 'users':
        return <UserManagementSettings onChanges={setHasUnsavedChanges} />;
      case 'system':
        return <SystemPreferences onChanges={setHasUnsavedChanges} />;
      default:
        return <GeneralSettings onChanges={setHasUnsavedChanges} />;
    }
  };

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
              <h1 className="text-3xl font-bold text-foreground mb-2">School Settings</h1>
              <p className="text-muted-foreground">
                Configure your school's preferences and system settings
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {hasUnsavedChanges && (
                <div className="flex items-center space-x-2 text-warning text-sm">
                  <Icon name="AlertTriangle" size={16} />
                  <span>Unsaved changes</span>
                </div>
              )}
              <Button
                variant="outline"
                onClick={handleResetDefaults}
                className="hidden sm:flex"
              >
                Reset to Default
              </Button>
              <Button
                onClick={handleSaveChanges}
                disabled={!hasUnsavedChanges}
                className="bg-primary hover:bg-primary/90"
              >
                Save Changes
              </Button>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="mb-8">
            <div className="border-b border-border">
              <nav className="-mb-px flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-8 overflow-x-auto">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`
                      group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                      transition-colors duration-200
                      ${activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                      }
                    `}
                  >
                    <Icon 
                      name={tab?.icon} 
                      size={18} 
                      className={`mr-2 ${
                        activeTab === tab?.id ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                      }`}
                    />
                    <div className="text-left">
                      <div className="font-medium">{tab?.label}</div>
                      <div className="text-xs text-muted-foreground hidden sm:block">
                        {tab?.description}
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="transition-all duration-300 ease-in-out">
            {renderTabContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SchoolSettings;