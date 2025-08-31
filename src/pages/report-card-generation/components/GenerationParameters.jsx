import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const GenerationParameters = ({ onParametersChange, onGenerate, isGenerating }) => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedTerm, setSelectedTerm] = useState('term-1');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStream, setSelectedStream] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [includeComments, setIncludeComments] = useState(true);
  const [includeBranding, setIncludeBranding] = useState(true);
  const [customGradeBoundaries, setCustomGradeBoundaries] = useState(false);

  const academicYears = [
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' }
  ];

  const terms = [
    { value: 'term-1', label: 'Term 1' },
    { value: 'term-2', label: 'Term 2' },
    { value: 'term-3', label: 'Term 3' }
  ];

  const classes = [
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

  const streams = [
    { value: 'a', label: 'Stream A' },
    { value: 'b', label: 'Stream B' },
    { value: 'c', label: 'Stream C' }
  ];

  const students = [
    { value: 'all', label: 'All Students (247 students)' },
    { value: 'selected', label: 'Selected Students Only' },
    { value: 'individual', label: 'Individual Student Selection' }
  ];

  const handleParameterChange = () => {
    const parameters = {
      academicYear: selectedYear,
      term: selectedTerm,
      class: selectedClass,
      stream: selectedStream,
      students: selectedStudents,
      includeComments,
      includeBranding,
      customGradeBoundaries
    };
    onParametersChange(parameters);
  };

  React.useEffect(() => {
    handleParameterChange();
  }, [selectedYear, selectedTerm, selectedClass, selectedStream, selectedStudents, includeComments, includeBranding, customGradeBoundaries]);

  const handleGenerate = () => {
    if (!selectedClass) {
      alert('Please select a class to generate reports');
      return;
    }
    onGenerate();
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 h-fit">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Icon name="Settings" size={16} color="var(--color-primary-foreground)" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Generation Parameters</h2>
          <p className="text-sm text-muted-foreground">Configure report generation settings</p>
        </div>
      </div>
      <div className="space-y-6">
        {/* Academic Period */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground flex items-center">
            <Icon name="Calendar" size={16} className="mr-2" />
            Academic Period
          </h3>
          
          <Select
            label="Academic Year"
            options={academicYears}
            value={selectedYear}
            onChange={setSelectedYear}
            className="mb-4"
            id="academic-year"
            name="academicYear"
            description="Select the academic year for report generation"
            error=""
          />

          <Select
            label="Term"
            options={terms}
            value={selectedTerm}
            onChange={setSelectedTerm}
            id="term"
            name="term"
            description="Select the term for report generation"
            error=""
          />
        </div>

        {/* Class Selection */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground flex items-center">
            <Icon name="Users" size={16} className="mr-2" />
            Class & Stream
          </h3>
          
          <Select
            label="Class"
            placeholder="Select class"
            options={classes}
            value={selectedClass}
            onChange={setSelectedClass}
            required
            className="mb-4"
            id="class"
            name="class"
            description="Select the class for report generation"
            error=""
          />

          {selectedClass && (
            <Select
              label="Stream"
              placeholder="Select stream (optional)"
              options={streams}
              value={selectedStream}
              onChange={setSelectedStream}
              id="stream"
              name="stream"
              description="Select the stream (optional)"
              error=""
            />
          )}
        </div>

        {/* Student Selection */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground flex items-center">
            <Icon name="UserCheck" size={16} className="mr-2" />
            Student Selection
          </h3>
          
          <Select
            label="Students"
            options={students}
            value={selectedStudents}
            onChange={setSelectedStudents}
            multiple
            id="students"
            name="students"
            description="Select which students to include in reports"
            error=""
          />
        </div>

        {/* Template Options */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground flex items-center">
            <Icon name="FileText" size={16} className="mr-2" />
            Template Options
          </h3>
          
          <div className="space-y-3">
            <Checkbox
              label="Include Teacher Comments"
              description="Add personalized comments for each subject"
              checked={includeComments}
              onChange={(e) => setIncludeComments(e?.target?.checked)}
            />
            
            <Checkbox
              label="School Branding"
              description="Include school logo and custom colors"
              checked={includeBranding}
              onChange={(e) => setIncludeBranding(e?.target?.checked)}
            />
            
            <Checkbox
              label="Custom Grade Boundaries"
              description="Use school-specific grading system"
              checked={customGradeBoundaries}
              onChange={(e) => setCustomGradeBoundaries(e?.target?.checked)}
            />
          </div>
        </div>

        {/* Generation Actions */}
        <div className="pt-4 border-t border-border space-y-3">
          <Button
            variant="default"
            fullWidth
            loading={isGenerating}
            iconName="FileText"
            iconPosition="left"
            onClick={handleGenerate}
            disabled={!selectedClass}
          >
            {isGenerating ? 'Generating Reports...' : 'Generate Reports'}
          </Button>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
              disabled={!selectedClass}
            >
              Preview
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              iconName="Send"
              iconPosition="left"
              disabled={!selectedClass}
            >
              Send Test
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-muted rounded-lg p-4">
          <h4 className="text-sm font-medium text-foreground mb-3">Quick Stats</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Selected Class:</span>
              <span className="font-medium text-foreground">
                {selectedClass ? classes?.find(c => c?.value === selectedClass)?.label : 'None'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Students:</span>
              <span className="font-medium text-foreground">
                {selectedClass ? '32 students' : '0 students'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Est. Time:</span>
              <span className="font-medium text-foreground">
                {selectedClass ? '2-3 minutes' : '--'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerationParameters;