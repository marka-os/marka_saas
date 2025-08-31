import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AssessmentConfiguration = ({ onConfigurationChange, configuration }) => {
  const [localConfig, setLocalConfig] = useState({
    subject: configuration?.subject || '',
    class: configuration?.class || '',
    stream: configuration?.stream || '',
    examType: configuration?.examType || '',
    term: configuration?.term || '',
    academicYear: configuration?.academicYear || '',
    maxCAScore: configuration?.maxCAScore || 40,
    maxExamScore: configuration?.maxExamScore || 60,
    passingGrade: configuration?.passingGrade || 50,
    ...configuration
  });

  const subjectOptions = [
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'english', label: 'English Language' },
    { value: 'science', label: 'Science' },
    { value: 'social_studies', label: 'Social Studies' },
    { value: 'religious_education', label: 'Religious Education' },
    { value: 'physical_education', label: 'Physical Education' },
    { value: 'art_craft', label: 'Art & Craft' },
    { value: 'music_dance_drama', label: 'Music, Dance & Drama' }
  ];

  const classOptions = [
    { value: 'p1', label: 'Primary 1' },
    { value: 'p2', label: 'Primary 2' },
    { value: 'p3', label: 'Primary 3' },
    { value: 'p4', label: 'Primary 4' },
    { value: 'p5', label: 'Primary 5' },
    { value: 'p6', label: 'Primary 6' },
    { value: 'p7', label: 'Primary 7' },
    { value: 's1', label: 'Senior 1' },
    { value: 's2', label: 'Senior 2' },
    { value: 's3', label: 'Senior 3' },
    { value: 's4', label: 'Senior 4' }
  ];

  const streamOptions = [
    { value: 'a', label: 'Stream A' },
    { value: 'b', label: 'Stream B' },
    { value: 'c', label: 'Stream C' },
    { value: 'd', label: 'Stream D' }
  ];

  const examTypeOptions = [
    { value: 'bot', label: 'Beginning of Term (BOT)' },
    { value: 'mot', label: 'Middle of Term (MOT)' },
    { value: 'eot', label: 'End of Term (EOT)' },
    { value: 'mock', label: 'Mock Examination' },
    { value: 'final', label: 'Final Examination' }
  ];

  const termOptions = [
    { value: 'term1', label: 'Term 1' },
    { value: 'term2', label: 'Term 2' },
    { value: 'term3', label: 'Term 3' }
  ];

  const academicYearOptions = [
    { value: '2024', label: '2024' },
    { value: '2025', label: '2025' },
    { value: '2026', label: '2026' }
  ];

  const handleInputChange = (field, value) => {
    const updatedConfig = { ...localConfig, [field]: value };
    setLocalConfig(updatedConfig);
    onConfigurationChange(updatedConfig);
  };

  const gradeBoundaries = [
    { grade: 'D1', min: 80, max: 100, color: 'text-success' },
    { grade: 'D2', min: 70, max: 79, color: 'text-success' },
    { grade: 'C3', min: 60, max: 69, color: 'text-accent' },
    { grade: 'C4', min: 50, max: 59, color: 'text-accent' },
    { grade: 'C5', min: 45, max: 49, color: 'text-warning' },
    { grade: 'C6', min: 40, max: 44, color: 'text-warning' },
    { grade: 'P7', min: 35, max: 39, color: 'text-error' },
    { grade: 'P8', min: 30, max: 34, color: 'text-error' },
    { grade: 'F9', min: 0, max: 29, color: 'text-error' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Settings" size={20} color="var(--color-primary-foreground)" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Assessment Configuration</h2>
            <p className="text-sm text-muted-foreground">Configure assessment parameters and grade boundaries</p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <Icon name="Save" size={16} />
          Save Template
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Configuration */}
        <div className="space-y-4">
          <h3 className="font-medium text-foreground flex items-center space-x-2">
            <Icon name="BookOpen" size={16} />
            <span>Basic Information</span>
          </h3>
          
          <Select
            label="Subject"
            placeholder="Select subject"
            options={subjectOptions}
            value={localConfig?.subject}
            onChange={(value) => handleInputChange('subject', value)}
            required
            id="subject"
            name="subject"
            description=""
            error=""
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Class"
              placeholder="Select class"
              options={classOptions}
              value={localConfig?.class}
              onChange={(value) => handleInputChange('class', value)}
              required
              id="class"
              name="class"
              description=""
              error=""
            />
            <Select
              label="Stream"
              placeholder="Select stream"
              options={streamOptions}
              value={localConfig?.stream}
              onChange={(value) => handleInputChange('stream', value)}
              required
              id="stream"
              name="stream"
              description=""
              error=""
            />
          </div>

          <Select
            label="Exam Type"
            placeholder="Select exam type"
            options={examTypeOptions}
            value={localConfig?.examType}
            onChange={(value) => handleInputChange('examType', value)}
            required
            id="examType"
            name="examType"
            description=""
            error=""
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Term"
              placeholder="Select term"
              options={termOptions}
              value={localConfig?.term}
              onChange={(value) => handleInputChange('term', value)}
              required
              id="term"
              name="term"
              description=""
              error=""
            />
            <Select
              label="Academic Year"
              placeholder="Select year"
              options={academicYearOptions}
              value={localConfig?.academicYear}
              onChange={(value) => handleInputChange('academicYear', value)}
              required
              id="academicYear"
              name="academicYear"
              description=""
              error=""
            />
          </div>
        </div>

        {/* Score Configuration */}
        <div className="space-y-4">
          <h3 className="font-medium text-foreground flex items-center space-x-2">
            <Icon name="Calculator" size={16} />
            <span>Score Configuration</span>
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Max CA Score"
              type="number"
              placeholder="40"
              value={localConfig?.maxCAScore}
              onChange={(e) => handleInputChange('maxCAScore', parseInt(e?.target?.value) || 0)}
              min="0"
              max="100"
              required
            />
            <Input
              label="Max Exam Score"
              type="number"
              placeholder="60"
              value={localConfig?.maxExamScore}
              onChange={(e) => handleInputChange('maxExamScore', parseInt(e?.target?.value) || 0)}
              min="0"
              max="100"
              required
            />
          </div>

          <Input
            label="Passing Grade"
            type="number"
            placeholder="50"
            value={localConfig?.passingGrade}
            onChange={(e) => handleInputChange('passingGrade', parseInt(e?.target?.value) || 0)}
            min="0"
            max="100"
            description="Minimum total score for passing"
            required
          />

          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-medium text-sm text-foreground mb-3">Grade Boundaries (UNEB Standard)</h4>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {gradeBoundaries?.map((boundary) => (
                <div key={boundary?.grade} className="flex items-center justify-between p-2 bg-background rounded">
                  <span className={`font-mono font-medium ${boundary?.color}`}>{boundary?.grade}</span>
                  <span className="text-muted-foreground">{boundary?.min}-{boundary?.max}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Configuration Summary */}
      {localConfig?.subject && localConfig?.class && (
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Info" size={16} color="var(--color-accent)" />
            <span className="font-medium text-accent">Configuration Summary</span>
          </div>
          <div className="text-sm text-foreground">
            <span className="font-medium">
              {subjectOptions?.find(s => s?.value === localConfig?.subject)?.label} - {' '}
              {classOptions?.find(c => c?.value === localConfig?.class)?.label}
              {localConfig?.stream && ` (${streamOptions?.find(s => s?.value === localConfig?.stream)?.label})`}
            </span>
            <br />
            <span className="text-muted-foreground">
              {examTypeOptions?.find(e => e?.value === localConfig?.examType)?.label} • {' '}
              {termOptions?.find(t => t?.value === localConfig?.term)?.label} {localConfig?.academicYear} • {' '}
              Total: {localConfig?.maxCAScore + localConfig?.maxExamScore} marks
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentConfiguration;