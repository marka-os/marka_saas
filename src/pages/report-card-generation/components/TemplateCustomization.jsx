import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const TemplateCustomization = ({ onTemplateChange }) => {
  const [templateSettings, setTemplateSettings] = useState({
    schoolLogo: true,
    schoolColors: true,
    headerStyle: 'modern',
    gradeSystem: 'uneb-standard',
    includePhotos: true,
    includeSignatures: true,
    watermark: false,
    customFooter: '',
    reportLayout: 'detailed'
  });

  const headerStyles = [
    { value: 'modern', label: 'Modern Design' },
    { value: 'classic', label: 'Classic Layout' },
    { value: 'minimal', label: 'Minimal Style' },
    { value: 'formal', label: 'Formal Template' }
  ];

  const gradeSystems = [
    { value: 'uneb-standard', label: 'UNEB Standard (A-F)' },
    { value: 'percentage', label: 'Percentage Only' },
    { value: 'points', label: 'Points System (1-9)' },
    { value: 'custom', label: 'Custom Boundaries' }
  ];

  const reportLayouts = [
    { value: 'detailed', label: 'Detailed Report' },
    { value: 'summary', label: 'Summary Report' },
    { value: 'compact', label: 'Compact Layout' },
    { value: 'extended', label: 'Extended Format' }
  ];

  const handleSettingChange = (key, value) => {
    const newSettings = { ...templateSettings, [key]: value };
    setTemplateSettings(newSettings);
    onTemplateChange(newSettings);
  };

  const handlePreviewTemplate = () => {
    console.log('Previewing template with settings:', templateSettings);
  };

  const handleSaveTemplate = () => {
    console.log('Saving template settings:', templateSettings);
  };

  const handleResetTemplate = () => {
    const defaultSettings = {
      schoolLogo: true,
      schoolColors: true,
      headerStyle: 'modern',
      gradeSystem: 'uneb-standard',
      includePhotos: true,
      includeSignatures: true,
      watermark: false,
      customFooter: '',
      reportLayout: 'detailed'
    };
    setTemplateSettings(defaultSettings);
    onTemplateChange(defaultSettings);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-warning rounded-lg flex items-center justify-center">
            <Icon name="Palette" size={16} color="var(--color-warning-foreground)" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Template Customization</h2>
            <p className="text-sm text-muted-foreground">Customize report card appearance</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Eye"
            iconPosition="left"
            onClick={handlePreviewTemplate}
          >
            Preview
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="RotateCcw"
            iconPosition="left"
            onClick={handleResetTemplate}
          >
            Reset
          </Button>
        </div>
      </div>
      <div className="space-y-6">
        {/* Layout & Style */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground flex items-center">
            <Icon name="Layout" size={16} className="mr-2" />
            Layout & Style
          </h3>
          
          <Select
            label="Header Style"
            description="Choose the header design for your reports"
            options={headerStyles}
            value={templateSettings?.headerStyle}
            onChange={(value) => handleSettingChange('headerStyle', value)}
            className="mb-4"
            id="headerStyle"
            name="headerStyle"
            error=""
          />

          <Select
            label="Report Layout"
            description="Select the overall report structure"
            options={reportLayouts}
            value={templateSettings?.reportLayout}
            onChange={(value) => handleSettingChange('reportLayout', value)}
            id="reportLayout"
            name="reportLayout"
            error=""
          />
        </div>

        {/* Branding Options */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground flex items-center">
            <Icon name="Building" size={16} className="mr-2" />
            School Branding
          </h3>
          
          <div className="space-y-3">
            <Checkbox
              label="Include School Logo"
              description="Display school logo in report header"
              checked={templateSettings?.schoolLogo}
              onChange={(e) => handleSettingChange('schoolLogo', e?.target?.checked)}
            />
            
            <Checkbox
              label="Use School Colors"
              description="Apply school brand colors to report design"
              checked={templateSettings?.schoolColors}
              onChange={(e) => handleSettingChange('schoolColors', e?.target?.checked)}
            />
            
            <Checkbox
              label="Add Watermark"
              description="Include school watermark on report background"
              checked={templateSettings?.watermark}
              onChange={(e) => handleSettingChange('watermark', e?.target?.checked)}
            />
          </div>
        </div>

        {/* Grading System */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground flex items-center">
            <Icon name="Award" size={16} className="mr-2" />
            Grading System
          </h3>
          
          <Select
            label="Grade System"
            description="Choose how grades are displayed"
            options={gradeSystems}
            value={templateSettings?.gradeSystem}
            onChange={(value) => handleSettingChange('gradeSystem', value)}
            id="gradeSystem"
            name="gradeSystem"
            error=""
          />

          {templateSettings?.gradeSystem === 'custom' && (
            <div className="bg-muted rounded-lg p-4 space-y-3">
              <h4 className="text-sm font-medium text-foreground">Custom Grade Boundaries</h4>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Grade A"
                  placeholder="80-100"
                  size="sm"
                />
                <Input
                  label="Grade B"
                  placeholder="70-79"
                  size="sm"
                />
                <Input
                  label="Grade C"
                  placeholder="60-69"
                  size="sm"
                />
                <Input
                  label="Grade D"
                  placeholder="50-59"
                  size="sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Content Options */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground flex items-center">
            <Icon name="FileText" size={16} className="mr-2" />
            Content Options
          </h3>
          
          <div className="space-y-3">
            <Checkbox
              label="Include Student Photos"
              description="Add student photos to report cards"
              checked={templateSettings?.includePhotos}
              onChange={(e) => handleSettingChange('includePhotos', e?.target?.checked)}
            />
            
            <Checkbox
              label="Include Signature Lines"
              description="Add signature lines for teachers and parents"
              checked={templateSettings?.includeSignatures}
              onChange={(e) => handleSettingChange('includeSignatures', e?.target?.checked)}
            />
          </div>

          <Input
            label="Custom Footer Text"
            description="Add custom text to appear at the bottom of reports"
            placeholder="e.g., Excellence in Education Since 1995"
            value={templateSettings?.customFooter}
            onChange={(e) => handleSettingChange('customFooter', e?.target?.value)}
          />
        </div>

        {/* Preview Section */}
        <div className="bg-muted rounded-lg p-4">
          <h4 className="text-sm font-medium text-foreground mb-3">Template Preview</h4>
          <div className="bg-white rounded border border-border p-4 min-h-[200px] flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-primary rounded-lg mx-auto flex items-center justify-center">
                {templateSettings?.schoolLogo ? (
                  <span className="text-primary-foreground font-bold text-lg">KIS</span>
                ) : (
                  <Icon name="Building" size={24} color="var(--color-primary-foreground)" />
                )}
              </div>
              <h5 className="font-semibold text-gray-900">Kampala International School</h5>
              <p className="text-sm text-gray-600">STUDENT REPORT CARD</p>
              <div className="border-t border-gray-200 pt-2 mt-4">
                <p className="text-xs text-gray-500">
                  {templateSettings?.headerStyle?.charAt(0)?.toUpperCase() + templateSettings?.headerStyle?.slice(1)} Style
                </p>
                <p className="text-xs text-gray-500">
                  {templateSettings?.reportLayout?.charAt(0)?.toUpperCase() + templateSettings?.reportLayout?.slice(1)} Layout
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4 border-t border-border">
          <Button
            variant="default"
            iconName="Save"
            iconPosition="left"
            onClick={handleSaveTemplate}
            className="flex-1"
          >
            Save Template
          </Button>
          
          <Button
            variant="outline"
            iconName="Download"
            iconPosition="left"
            onClick={() => console.log('Exporting template')}
          >
            Export
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TemplateCustomization;