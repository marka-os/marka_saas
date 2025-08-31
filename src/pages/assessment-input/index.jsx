import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import AssessmentConfiguration from './components/AssessmentConfiguration';
import ScoreEntryTable from './components/ScoreEntryTable';
import BulkOperations from './components/BulkOperations';
import AssessmentSummary from './components/AssessmentSummary';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const AssessmentInput = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [configuration, setConfiguration] = useState({});
  const [scores, setScores] = useState({});
  const [activeTab, setActiveTab] = useState('entry');
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  // Auto-save functionality
  useEffect(() => {
    if (Object.keys(scores)?.length > 0) {
      setIsAutoSaving(true);
      const saveTimer = setTimeout(() => {
        // Simulate auto-save
        console.log('Auto-saving scores...', scores);
        setIsAutoSaving(false);
      }, 1000);

      return () => clearTimeout(saveTimer);
    }
  }, [scores]);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleConfigurationChange = (newConfig) => {
    setConfiguration(newConfig);
  };

  const handleScoresChange = (newScores) => {
    setScores(newScores);
  };

  const handleBulkImport = (importedScores) => {
    setScores(prevScores => ({ ...prevScores, ...importedScores }));
  };

  const handleBulkCopy = (copiedScores) => {
    setScores(prevScores => ({ ...prevScores, ...copiedScores }));
  };

  const handleSubmitForApproval = () => {
    const completedEntries = Object.values(scores)?.filter(score => score?.total > 0)?.length;
    if (completedEntries === 0) {
      alert('Please enter at least one student score before submitting.');
      return;
    }
    
    const confirmed = window.confirm(
      `Submit ${completedEntries} student scores for approval?\n\nOnce submitted, scores cannot be modified without supervisor approval.`
    );
    
    if (confirmed) {
      console.log('Submitting assessment for approval...', { configuration, scores });
      alert('Assessment submitted successfully for approval!');
    }
  };

  const tabs = [
    { id: 'entry', label: 'Score Entry', icon: 'Edit3' },
    { id: 'bulk', label: 'Bulk Operations', icon: 'Layers' },
    { id: 'summary', label: 'Summary', icon: 'BarChart3' }
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
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Icon name="ClipboardList" size={24} color="var(--color-primary-foreground)" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Assessment Input</h1>
                <p className="text-muted-foreground">Enter and manage student assessment scores</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {isAutoSaving && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span>Auto-saving...</span>
                </div>
              )}
              
              <Button variant="outline" size="sm">
                <Icon name="Save" size={16} />
                Save Draft
              </Button>
              
              <Button 
                variant="default" 
                size="sm"
                onClick={handleSubmitForApproval}
                disabled={Object.keys(scores)?.length === 0}
              >
                <Icon name="Send" size={16} />
                Submit for Approval
              </Button>
            </div>
          </div>

          {/* Assessment Configuration */}
          <div className="mb-8">
            <AssessmentConfiguration 
              configuration={configuration}
              onConfigurationChange={handleConfigurationChange}
            />
          </div>

          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="border-b border-border">
              <nav className="flex space-x-8">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-8">
            {activeTab === 'entry' && (
              <ScoreEntryTable
                configuration={configuration}
                scores={scores}
                onScoresChange={handleScoresChange}
              />
            )}

            {activeTab === 'bulk' && (
              <BulkOperations
                configuration={configuration}
                onBulkImport={handleBulkImport}
                onBulkCopy={handleBulkCopy}
              />
            )}

            {activeTab === 'summary' && (
              <AssessmentSummary
                configuration={configuration}
                scores={scores}
                students={[]} // Add missing required prop
              />
            )}
          </div>

          {/* Quick Stats Footer */}
          {Object.keys(scores)?.length > 0 && (
            <div className="mt-8 bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <Icon name="Users" size={16} className="text-muted-foreground" />
                    <span className="text-muted-foreground">Total Students:</span>
                    <span className="font-medium text-foreground">8</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="CheckCircle" size={16} className="text-success" />
                    <span className="text-muted-foreground">Completed:</span>
                    <span className="font-medium text-foreground">
                      {Object.values(scores)?.filter(score => score?.total > 0)?.length}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Clock" size={16} className="text-warning" />
                    <span className="text-muted-foreground">Pending:</span>
                    <span className="font-medium text-foreground">
                      {8 - Object.values(scores)?.filter(score => score?.total > 0)?.length}
                    </span>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Last updated: {new Date()?.toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AssessmentInput;