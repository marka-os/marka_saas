import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import GenerationParameters from './components/GenerationParameters';
import ReportPreview from './components/ReportPreview';
import GenerationQueue from './components/GenerationQueue';
import TemplateCustomization from './components/TemplateCustomization';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ReportCardGeneration = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('parameters');
  const [generationParameters, setGenerationParameters] = useState({});
  const [templateSettings, setTemplateSettings] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleParametersChange = (parameters) => {
    setGenerationParameters(parameters);
  };

  const handleTemplateChange = (settings) => {
    setTemplateSettings(settings);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate generation process
    setTimeout(() => {
      setIsGenerating(false);
      setActiveTab('queue');
    }, 3000);
  };

  const handleDownloadAll = () => {
    console.log('Downloading all completed reports');
  };

  const handleSendToParents = () => {
    console.log('Sending reports to parents');
  };

  const tabs = [
    { id: 'parameters', label: 'Parameters', icon: 'Settings' },
    { id: 'template', label: 'Template', icon: 'Palette' },
    { id: 'queue', label: 'Queue', icon: 'Download' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuToggle={handleMenuToggle} isMenuOpen={sidebarOpen} />
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        isOpen={sidebarOpen} 
        onClose={handleSidebarClose} 
      />
      <main className={`pt-16 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'}`}>
        <div className="p-6">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <Icon name="FileText" size={24} color="var(--color-primary-foreground)" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Report Card Generation</h1>
                  <p className="text-muted-foreground mt-1">
                    Generate UNEB-compliant report cards with customizable templates
                  </p>
                </div>
              </div>

              <div className="hidden lg:flex items-center space-x-3">
                <Button
                  variant="outline"
                  iconName="History"
                  iconPosition="left"
                  onClick={() => console.log('View history')}
                >
                  Generation History
                </Button>
                
                <Button
                  variant="outline"
                  iconName="Settings"
                  iconPosition="left"
                  onClick={() => console.log('Settings')}
                >
                  Settings
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                    <Icon name="FileCheck" size={16} color="var(--color-success)" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">This Month</p>
                    <p className="text-xl font-semibold text-foreground">1,247</p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Icon name="Clock" size={16} color="var(--color-accent)" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Time</p>
                    <p className="text-xl font-semibold text-foreground">2.3 min</p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="Users" size={16} color="var(--color-primary)" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Classes</p>
                    <p className="text-xl font-semibold text-foreground">24</p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
                    <Icon name="AlertTriangle" size={16} color="var(--color-warning)" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-xl font-semibold text-foreground">3</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Tab Navigation */}
          <div className="lg:hidden mb-6">
            <div className="flex space-x-1 bg-muted rounded-lg p-1">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    activeTab === tab?.id
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-6">
            {/* Left Panel - Parameters & Template */}
            <div className="lg:col-span-3 space-y-6">
              <GenerationParameters
                onParametersChange={handleParametersChange}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />
              
              <TemplateCustomization
                onTemplateChange={handleTemplateChange}
              />
            </div>

            {/* Center Panel - Preview */}
            <div className="lg:col-span-6">
              <ReportPreview
                parameters={generationParameters}
                isGenerating={isGenerating}
              />
            </div>

            {/* Right Panel - Queue */}
            <div className="lg:col-span-3">
              <GenerationQueue
                isGenerating={isGenerating}
                onDownloadAll={handleDownloadAll}
                onSendToParents={handleSendToParents}
              />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden">
            {activeTab === 'parameters' && (
              <div className="space-y-6">
                <GenerationParameters
                  onParametersChange={handleParametersChange}
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
                />
                
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="Eye"
                    iconPosition="left"
                    onClick={() => setShowMobilePreview(true)}
                  >
                    Preview Report
                  </Button>
                  
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="Download"
                    iconPosition="left"
                    onClick={() => setActiveTab('queue')}
                  >
                    View Queue
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'template' && (
              <TemplateCustomization
                onTemplateChange={handleTemplateChange}
              />
            )}

            {activeTab === 'queue' && (
              <GenerationQueue
                isGenerating={isGenerating}
                onDownloadAll={handleDownloadAll}
                onSendToParents={handleSendToParents}
              />
            )}
          </div>

          {/* Mobile Preview Modal */}
          {showMobilePreview && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
              <div className="absolute inset-4 bg-card rounded-lg overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <h3 className="text-lg font-semibold text-foreground">Report Preview</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowMobilePreview(false)}
                  >
                    <Icon name="X" size={20} />
                  </Button>
                </div>
                <div className="h-[calc(100%-4rem)] overflow-auto">
                  <ReportPreview
                    parameters={generationParameters}
                    isGenerating={isGenerating}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions - Mobile */}
          <div className="lg:hidden fixed bottom-6 right-6 space-y-3">
            <Button
              variant="default"
              size="icon"
              className="w-14 h-14 rounded-full shadow-lg"
              onClick={() => setActiveTab('parameters')}
            >
              <Icon name="Settings" size={20} />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportCardGeneration;