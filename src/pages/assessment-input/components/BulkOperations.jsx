import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

import Select from '../../../components/ui/Select';

const BulkOperations = ({ onBulkImport, onBulkCopy, configuration }) => {
  const [importFile, setImportFile] = useState(null);
  const [copySource, setCopySource] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const previousAssessments = [
    { value: 'math_bot_2024', label: 'Mathematics BOT 2024 - P7A' },
    { value: 'math_mot_2024', label: 'Mathematics MOT 2024 - P7A' },
    { value: 'english_bot_2024', label: 'English BOT 2024 - P7A' },
    { value: 'science_bot_2024', label: 'Science BOT 2024 - P7A' }
  ];

  const handleFileUpload = (event) => {
    const file = event?.target?.files?.[0];
    if (file && file?.type === 'text/csv') {
      setImportFile(file);
    } else {
      alert('Please select a valid CSV file');
    }
  };

  const handleImport = async () => {
    if (!importFile) return;
    
    setIsImporting(true);
    
    // Simulate file processing
    setTimeout(() => {
      const mockImportedData = {
        'std001': { ca: 35, exam: 52, total: 87 },
        'std002': { ca: 28, exam: 45, total: 73 },
        'std003': { ca: 32, exam: 48, total: 80 },
        'std004': { ca: 25, exam: 38, total: 63 },
        'std005': { ca: 38, exam: 55, total: 93 },
        'std006': { ca: 30, exam: 42, total: 72 },
        'std007': { ca: 33, exam: 47, total: 80 },
        'std008': { ca: 27, exam: 41, total: 68 }
      };
      
      onBulkImport(mockImportedData);
      setIsImporting(false);
      setImportFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('csv-upload');
      if (fileInput) fileInput.value = '';
    }, 2000);
  };

  const handleCopy = async () => {
    if (!copySource) return;
    
    setIsCopying(true);
    
    // Simulate copying from previous assessment
    setTimeout(() => {
      const mockCopiedData = {
        'std001': { ca: 32, exam: 48, total: 80 },
        'std002': { ca: 29, exam: 43, total: 72 },
        'std003': { ca: 35, exam: 51, total: 86 },
        'std004': { ca: 26, exam: 39, total: 65 },
        'std005': { ca: 36, exam: 53, total: 89 },
        'std006': { ca: 31, exam: 44, total: 75 },
        'std007': { ca: 34, exam: 49, total: 83 },
        'std008': { ca: 28, exam: 42, total: 70 }
      };
      
      onBulkCopy(mockCopiedData);
      setIsCopying(false);
      setCopySource('');
    }, 1500);
  };

  const downloadTemplate = () => {
    const csvContent = `Student ID,Student Name,CA Score,Exam Score
std001,Nakato Sarah,0,0
std002,Mukasa John,0,0
std003,Namuli Grace,0,0
std004,Ssemakula David,0,0
std005,Akello Mary,0,0
std006,Okello Peter,0,0
std007,Nabirye Joan,0,0
std008,Kato Samuel,0,0`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `assessment_template_${configuration?.subject || 'subject'}_${configuration?.class || 'class'}.csv`;
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
    window.URL?.revokeObjectURL(url);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
          <Icon name="Layers" size={20} color="var(--color-secondary-foreground)" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Bulk Operations</h2>
          <p className="text-sm text-muted-foreground">Import scores or copy from previous assessments</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CSV Import */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-3">
            <Icon name="Upload" size={16} />
            <h3 className="font-medium text-foreground">Import from CSV</h3>
          </div>

          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
            <Icon name="FileText" size={32} className="mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground mb-4">
              Upload a CSV file with student scores
            </p>
            
            <input
              id="csv-upload"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <Button
              variant="outline"
              onClick={() => document.getElementById('csv-upload')?.click()}
              className="mb-3"
            >
              <Icon name="Upload" size={16} />
              Choose CSV File
            </Button>
            
            {importFile && (
              <div className="text-sm text-foreground mb-3">
                Selected: {importFile?.name}
              </div>
            )}
            
            <Button
              variant="default"
              onClick={handleImport}
              disabled={!importFile || isImporting}
              loading={isImporting}
              fullWidth
            >
              {isImporting ? 'Importing...' : 'Import Scores'}
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={downloadTemplate}
            fullWidth
          >
            <Icon name="Download" size={16} />
            Download CSV Template
          </Button>
        </div>

        {/* Copy from Previous */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-3">
            <Icon name="Copy" size={16} />
            <h3 className="font-medium text-foreground">Copy from Previous Assessment</h3>
          </div>

          <Select
            id="copy-source-select"
            name="copySource"
            label="Previous Assessment"
            placeholder="Select assessment to copy from"
            options={previousAssessments}
            value={copySource}
            onChange={setCopySource}
            description="Scores will be copied as starting values"
            error=""
          />

          <Button
            variant="default"
            onClick={handleCopy}
            disabled={!copySource || isCopying}
            loading={isCopying}
            fullWidth
          >
            {isCopying ? 'Copying...' : 'Copy Scores'}
          </Button>

          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Icon name="Info" size={16} color="var(--color-accent)" className="mt-0.5" />
              <div className="text-sm">
                <p className="text-accent font-medium mb-1">Copy Guidelines</p>
                <ul className="text-muted-foreground space-y-1 text-xs">
                  <li>• Only matching students will be copied</li>
                  <li>• Scores will be adjusted to current max values</li>
                  <li>• You can edit copied scores before saving</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-border">
        <h3 className="font-medium text-foreground mb-4 flex items-center space-x-2">
          <Icon name="Zap" size={16} />
          <span>Quick Actions</span>
        </h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Button variant="outline" size="sm" fullWidth>
            <Icon name="Users" size={16} />
            Fill All CA: 0
          </Button>
          <Button variant="outline" size="sm" fullWidth>
            <Icon name="BookOpen" size={16} />
            Fill All Exam: 0
          </Button>
          <Button variant="outline" size="sm" fullWidth>
            <Icon name="Calculator" size={16} />
            Auto-Calculate
          </Button>
          <Button variant="outline" size="sm" fullWidth>
            <Icon name="RotateCcw" size={16} />
            Clear All
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkOperations;