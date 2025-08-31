import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const AcademicSettings = ({ onChanges }) => {
  const [gradeBoundaries, setGradeBoundaries] = useState([
    { grade: 'A', min: 85, max: 100, color: '#22c55e' },
    { grade: 'B', min: 75, max: 84, color: '#3b82f6' },
    { grade: 'C', min: 65, max: 74, color: '#f59e0b' },
    { grade: 'D', min: 55, max: 64, color: '#ef4444' },
    { grade: 'F', min: 0, max: 54, color: '#6b7280' }
  ]);

  const [assessmentTypes, setAssessmentTypes] = useState([
    { name: 'Continuous Assessment', weight: 40, enabled: true },
    { name: 'Mid-term Exams', weight: 20, enabled: true },
    { name: 'Final Exams', weight: 40, enabled: true }
  ]);

  const [academicSettings, setAcademicSettings] = useState({
    currentTerm: 'Term 1',
    currentYear: '2024',
    passingGrade: 'D',
    maxGrade: 'A',
    reportingPeriods: 'Termly',
    classSize: '35'
  });

  const termOptions = [
    { value: 'Term 1', label: 'Term 1' },
    { value: 'Term 2', label: 'Term 2' },
    { value: 'Term 3', label: 'Term 3' }
  ];

  const reportingOptions = [
    { value: 'Weekly', label: 'Weekly' },
    { value: 'Monthly', label: 'Monthly' },
    { value: 'Termly', label: 'Termly' }
  ];

  const handleGradeBoundaryChange = (index, field, value) => {
    const updated = [...gradeBoundaries];
    updated[index] = { ...updated?.[index], [field]: value };
    setGradeBoundaries(updated);
    onChanges?.(true);
  };

  const handleAssessmentTypeChange = (index, field, value) => {
    const updated = [...assessmentTypes];
    updated[index] = { ...updated?.[index], [field]: value };
    setAssessmentTypes(updated);
    onChanges?.(true);
  };

  const handleSettingChange = (field, value) => {
    setAcademicSettings(prev => ({ ...prev, [field]: value }));
    onChanges?.(true);
  };

  const addGradeBoundary = () => {
    setGradeBoundaries(prev => [...prev, {
      grade: '',
      min: 0,
      max: 0,
      color: '#6b7280'
    }]);
    onChanges?.(true);
  };

  const removeGradeBoundary = (index) => {
    setGradeBoundaries(prev => prev?.filter((_, i) => i !== index));
    onChanges?.(true);
  };

  return (
    <div className="space-y-8">
      {/* Academic Year Settings */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="Calendar" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Academic Year Configuration</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Input
            label="Academic Year"
            type="number"
            value={academicSettings?.currentYear}
            onChange={(e) => handleSettingChange('currentYear', e?.target?.value)}
            placeholder="2024"
          />

          <Select
            label="Current Term"
            value={academicSettings?.currentTerm}
            onChange={(value) => handleSettingChange('currentTerm', value)}
            options={termOptions}
            id="currentTerm"
            name="currentTerm"
            description=""
            error=""
          />

          <Select
            label="Reporting Periods"
            value={academicSettings?.reportingPeriods}
            onChange={(value) => handleSettingChange('reportingPeriods', value)}
            options={reportingOptions}
            id="reportingPeriods"
            name="reportingPeriods"
            description=""
            error=""
          />
        </div>
      </div>

      {/* Grade Boundaries */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Icon name="Target" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Grade Boundaries</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={addGradeBoundary}
            iconName="Plus"
          >
            Add Grade
          </Button>
        </div>

        <div className="space-y-4">
          {gradeBoundaries?.map((boundary, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: boundary?.color }}
                />
                <Input
                  value={boundary?.grade}
                  onChange={(e) => handleGradeBoundaryChange(index, 'grade', e?.target?.value)}
                  placeholder="A"
                  className="w-16"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={boundary?.min}
                  onChange={(e) => handleGradeBoundaryChange(index, 'min', parseInt(e?.target?.value))}
                  placeholder="0"
                  className="w-20"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="number"
                  value={boundary?.max}
                  onChange={(e) => handleGradeBoundaryChange(index, 'max', parseInt(e?.target?.value))}
                  placeholder="100"
                  className="w-20"
                />
                <span className="text-muted-foreground">%</span>
              </div>

              <div className="flex-1">
                <Input
                  type="color"
                  value={boundary?.color}
                  onChange={(e) => handleGradeBoundaryChange(index, 'color', e?.target?.value)}
                  className="w-12 h-10"
                />
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeGradeBoundary(index)}
                className="text-error hover:text-error"
                iconName="Trash2"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Assessment Configuration */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="ClipboardCheck" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Assessment Configuration</h3>
        </div>

        <div className="space-y-4">
          {assessmentTypes?.map((assessment, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={assessment?.enabled}
                  onChange={(e) => handleAssessmentTypeChange(index, 'enabled', e?.target?.checked)}
                  className="w-4 h-4 text-primary"
                />
              </div>

              <div className="flex-1">
                <Input
                  value={assessment?.name}
                  onChange={(e) => handleAssessmentTypeChange(index, 'name', e?.target?.value)}
                  placeholder="Assessment Type"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={assessment?.weight}
                  onChange={(e) => handleAssessmentTypeChange(index, 'weight', parseInt(e?.target?.value))}
                  placeholder="0"
                  className="w-20"
                  min="0"
                  max="100"
                />
                <span className="text-muted-foreground">%</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-accent/10 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="Info" size={16} className="text-accent" />
            <span className="text-sm text-accent">
              Total weight: {assessmentTypes?.reduce((sum, assessment) => sum + (assessment?.enabled ? assessment?.weight : 0), 0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Class Structure */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="Users" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Class Structure</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Maximum Class Size"
            type="number"
            value={academicSettings?.classSize}
            onChange={(e) => handleSettingChange('classSize', e?.target?.value)}
            placeholder="35"
            description="Maximum number of students per class"
          />

          <Select
            label="Minimum Passing Grade"
            value={academicSettings?.passingGrade}
            onChange={(value) => handleSettingChange('passingGrade', value)}
            options={gradeBoundaries?.map(boundary => ({
              value: boundary?.grade,
              label: boundary?.grade
            }))}
            id="passingGrade"
            name="passingGrade"
            description=""
            error=""
          />
        </div>
      </div>
    </div>
  );
};

export default AcademicSettings;