import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GenerationQueue = ({ isGenerating, onDownloadAll, onSendToParents }) => {
  const [queueItems, setQueueItems] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const mockQueueItems = [
    {
      id: 1,
      studentName: 'John Doe Mukasa',
      class: 'Primary 5A',
      status: 'completed',
      progress: 100,
      generatedAt: new Date(Date.now() - 300000),
      fileSize: '2.4 MB',
      error: null
    },
    {
      id: 2,
      studentName: 'Mary Jane Nakato',
      class: 'Primary 5A',
      status: 'completed',
      progress: 100,
      generatedAt: new Date(Date.now() - 240000),
      fileSize: '2.1 MB',
      error: null
    },
    {
      id: 3,
      studentName: 'David Kimani',
      class: 'Primary 5A',
      status: 'processing',
      progress: 75,
      generatedAt: null,
      fileSize: null,
      error: null
    },
    {
      id: 4,
      studentName: 'Sarah Achieng',
      class: 'Primary 5A',
      status: 'pending',
      progress: 0,
      generatedAt: null,
      fileSize: null,
      error: null
    },
    {
      id: 5,
      studentName: 'Michael Ochieng',
      class: 'Primary 5A',
      status: 'error',
      progress: 0,
      generatedAt: null,
      fileSize: null,
      error: 'Missing assessment data for Mathematics'
    }
  ];

  useEffect(() => {
    if (isGenerating) {
      setQueueItems(mockQueueItems);
      setTotalCount(mockQueueItems?.length);
      setCompletedCount(mockQueueItems?.filter(item => item?.status === 'completed')?.length);
      
      // Simulate progress updates
      const interval = setInterval(() => {
        setQueueItems(prevItems => {
          return prevItems?.map(item => {
            if (item?.status === 'processing' && item?.progress < 100) {
              const newProgress = Math.min(item?.progress + 25, 100);
              return {
                ...item,
                progress: newProgress,
                status: newProgress === 100 ? 'completed' : 'processing',
                generatedAt: newProgress === 100 ? new Date() : null,
                fileSize: newProgress === 100 ? '2.3 MB' : null
              };
            }
            if (item?.status === 'pending') {
              return { ...item, status: 'processing', progress: 25 };
            }
            return item;
          });
        });
        
        setCompletedCount(prev => {
          const newCompleted = queueItems?.filter(item => item?.status === 'completed')?.length;
          return newCompleted;
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <Icon name="CheckCircle" size={16} color="var(--color-success)" />;
      case 'processing':
        return <Icon name="Loader2" size={16} className="animate-spin" color="var(--color-accent)" />;
      case 'pending':
        return <Icon name="Clock" size={16} color="var(--color-muted-foreground)" />;
      case 'error':
        return <Icon name="XCircle" size={16} color="var(--color-error)" />;
      default:
        return <Icon name="FileText" size={16} />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'processing':
        return 'Processing';
      case 'pending':
        return 'Pending';
      case 'error':
        return 'Error';
      default:
        return 'Unknown';
    }
  };

  const formatTime = (date) => {
    if (!date) return '--';
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  const handleDownloadSingle = (item) => {
    console.log('Downloading report for:', item?.studentName);
  };

  const handleRetry = (item) => {
    setQueueItems(prevItems =>
      prevItems?.map(queueItem =>
        queueItem?.id === item?.id
          ? { ...queueItem, status: 'pending', progress: 0, error: null }
          : queueItem
      )
    );
  };

  const completedItems = queueItems?.filter(item => item?.status === 'completed');
  const errorItems = queueItems?.filter(item => item?.status === 'error');
  const processingItems = queueItems?.filter(item => item?.status === 'processing' || item?.status === 'pending');

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden h-fit">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-success rounded-lg flex items-center justify-center">
              <Icon name="Download" size={16} color="var(--color-success-foreground)" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Generation Queue</h2>
              <p className="text-sm text-muted-foreground">
                {completedCount} of {totalCount} reports completed
              </p>
            </div>
          </div>
          
          {isGenerating && (
            <div className="flex items-center space-x-2">
              <div className="animate-spin">
                <Icon name="Loader2" size={16} />
              </div>
              <span className="text-sm text-muted-foreground">Processing...</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {totalCount > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-1">
              <span>Overall Progress</span>
              <span>{Math.round((completedCount / totalCount) * 100)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-success h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
      {/* Queue Items */}
      <div className="max-h-96 overflow-y-auto">
        {queueItems?.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="FileText" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Reports in Queue</h3>
            <p className="text-muted-foreground">
              Configure parameters and click "Generate Reports" to start
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {queueItems?.map((item) => (
              <div key={item?.id} className="p-4 hover:bg-muted/50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    {getStatusIcon(item?.status)}
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground truncate">{item?.studentName}</p>
                      <p className="text-sm text-muted-foreground">{item?.class}</p>
                      {item?.error && (
                        <p className="text-sm text-error mt-1">{item?.error}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {/* Progress for processing items */}
                    {item?.status === 'processing' && (
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-muted rounded-full h-1.5">
                          <div
                            className="bg-accent h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${item?.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground min-w-[35px]">
                          {item?.progress}%
                        </span>
                      </div>
                    )}

                    {/* File info for completed items */}
                    {item?.status === 'completed' && (
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{item?.fileSize}</p>
                        <p className="text-xs text-muted-foreground">{formatTime(item?.generatedAt)}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center space-x-1">
                      {item?.status === 'completed' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadSingle(item)}
                          className="h-8 w-8 p-0"
                        >
                          <Icon name="Download" size={14} />
                        </Button>
                      )}
                      
                      {item?.status === 'error' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRetry(item)}
                          className="h-8 w-8 p-0"
                        >
                          <Icon name="RotateCcw" size={14} />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Actions */}
      {completedItems?.length > 0 && (
        <div className="border-t border-border p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="default"
              size="sm"
              iconName="Download"
              iconPosition="left"
              onClick={onDownloadAll}
              fullWidth
            >
              Download All ({completedItems?.length})
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              iconName="Send"
              iconPosition="left"
              onClick={onSendToParents}
              fullWidth
            >
              Send to Parents
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 pt-3 border-t border-border">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1">
                <Icon name="CheckCircle" size={14} color="var(--color-success)" />
                <span className="text-sm font-medium text-success">{completedItems?.length}</span>
              </div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1">
                <Icon name="Loader2" size={14} color="var(--color-accent)" />
                <span className="text-sm font-medium text-accent">{processingItems?.length}</span>
              </div>
              <p className="text-xs text-muted-foreground">Processing</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1">
                <Icon name="XCircle" size={14} color="var(--color-error)" />
                <span className="text-sm font-medium text-error">{errorItems?.length}</span>
              </div>
              <p className="text-xs text-muted-foreground">Errors</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerationQueue;