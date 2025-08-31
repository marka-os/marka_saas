import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const ReportPreview = ({ parameters, isGenerating }) => {
  const [previewStudent, setPreviewStudent] = useState('john-doe');
  const [zoomLevel, setZoomLevel] = useState(100);

  const sampleStudents = [
    { value: 'john-doe', label: 'John Doe Mukasa' },
    { value: 'mary-jane', label: 'Mary Jane Nakato' },
    { value: 'david-kim', label: 'David Kimani' }
  ];

  const sampleSubjects = [
    { name: 'Mathematics', ca: 28, exam: 67, total: 95, grade: 'A', comment: 'Excellent performance in all areas' },
    { name: 'English', ca: 25, exam: 58, total: 83, grade: 'B+', comment: 'Good comprehension and writing skills' },
    { name: 'Science', ca: 30, exam: 62, total: 92, grade: 'A', comment: 'Shows great interest in practical work' },
    { name: 'Social Studies', ca: 22, exam: 55, total: 77, grade: 'B', comment: 'Good understanding of concepts' },
    { name: 'Religious Education', ca: 27, exam: 60, total: 87, grade: 'B+', comment: 'Active participation in discussions' }
  ];

  const handleZoomIn = () => {
    if (zoomLevel < 150) {
      setZoomLevel(zoomLevel + 25);
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel > 50) {
      setZoomLevel(zoomLevel - 25);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Preview Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Icon name="Eye" size={16} color="var(--color-accent-foreground)" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Report Preview</h2>
              <p className="text-sm text-muted-foreground">Real-time preview with sample data</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Student Selector */}
            <select
              value={previewStudent}
              onChange={(e) => setPreviewStudent(e?.target?.value)}
              className="px-3 py-2 text-sm border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {sampleStudents?.map(student => (
                <option key={student?.value} value={student?.value}>
                  {student?.label}
                </option>
              ))}
            </select>

            {/* Zoom Controls */}
            <div className="flex items-center space-x-1 border border-border rounded-lg">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 50}
              >
                <Icon name="ZoomOut" size={16} />
              </Button>
              <span className="px-2 text-sm text-muted-foreground min-w-[60px] text-center">
                {zoomLevel}%
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 150}
              >
                <Icon name="ZoomIn" size={16} />
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              iconName="Printer"
              iconPosition="left"
              onClick={handlePrint}
            >
              Print
            </Button>
          </div>
        </div>
      </div>
      {/* Preview Content */}
      <div className="p-6 bg-muted min-h-[600px] overflow-auto">
        <div 
          className="mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
          style={{ 
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center',
            width: '210mm',
            minHeight: '297mm'
          }}
        >
          {/* Report Card Header */}
          <div className="bg-primary text-primary-foreground p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {parameters?.includeBranding && (
                  <div className="w-16 h-16 bg-primary-foreground rounded-lg flex items-center justify-center">
                    <span className="text-primary font-bold text-xl">KIS</span>
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold">Kampala International School</h1>
                  <p className="text-primary-foreground/80">Excellence in Education Since 1995</p>
                  <p className="text-sm text-primary-foreground/70">P.O. Box 12345, Kampala, Uganda</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">STUDENT REPORT CARD</p>
                <p className="text-primary-foreground/80">Academic Year: {parameters?.academicYear || '2024'}</p>
                <p className="text-primary-foreground/80">Term: {parameters?.term?.replace('-', ' ')?.toUpperCase() || 'TERM 1'}</p>
              </div>
            </div>
          </div>

          {/* Student Information */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Student Name:</span>
                  <p className="text-lg font-semibold text-gray-900">
                    {sampleStudents?.find(s => s?.value === previewStudent)?.label}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Class:</span>
                  <p className="font-medium text-gray-900">Primary 5A</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">LIN:</span>
                  <p className="font-medium text-gray-900">UG2024P5001234</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Registration Number:</span>
                  <p className="font-medium text-gray-900">KIS/2024/P5/001</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Date of Birth:</span>
                  <p className="font-medium text-gray-900">15/03/2014</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Gender:</span>
                  <p className="font-medium text-gray-900">Male</p>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Performance */}
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Academic Performance</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Subject</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">CA (30)</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">Exam (70)</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">Total (100)</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">Grade</th>
                    {parameters?.includeComments && (
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Teacher's Comment</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {sampleSubjects?.map((subject, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium text-gray-900">{subject?.name}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">{subject?.ca}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">{subject?.exam}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-semibold">{subject?.total}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded text-sm font-medium ${
                          subject?.grade === 'A' ? 'bg-green-100 text-green-800' : subject?.grade?.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {subject?.grade}
                        </span>
                      </td>
                      {parameters?.includeComments && (
                        <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">{subject?.comment}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="mt-6 grid grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Overall Performance</h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Marks:</span>
                    <span className="font-medium">434/500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Percentage:</span>
                    <span className="font-medium">86.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Overall Grade:</span>
                    <span className="font-bold text-green-600">A</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Class Position</h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Position:</span>
                    <span className="font-medium">3rd</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Out of:</span>
                    <span className="font-medium">32 students</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Class Average:</span>
                    <span className="font-medium">78.2%</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Attendance</h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Days Present:</span>
                    <span className="font-medium">87</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Days Absent:</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Attendance:</span>
                    <span className="font-medium">96.7%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Class Teacher's Comment */}
            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Class Teacher's Comment</h3>
              <p className="text-gray-700">
                John is an exceptional student who consistently demonstrates strong academic performance across all subjects. 
                His dedication to learning and positive attitude make him a role model for his peers. He shows particular 
                strength in Mathematics and Science. I encourage him to continue with this excellent work.
              </p>
              <div className="mt-3 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">Mrs. Sarah Nakato</p>
                  <p className="text-sm text-gray-600">Class Teacher - Primary 5A</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Date: 31/08/2024</p>
                  <p className="text-sm text-gray-600">Signature: ________________</p>
                </div>
              </div>
            </div>

            {/* Next Term Information */}
            <div className="mt-6 border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-900 mb-2">Next Term Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Term Opens:</span>
                  <span className="ml-2 font-medium">15th September 2024</span>
                </div>
                <div>
                  <span className="text-gray-600">School Fees Due:</span>
                  <span className="ml-2 font-medium">10th September 2024</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Loading Overlay */}
      {isGenerating && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin">
              <Icon name="Loader2" size={20} />
            </div>
            <span className="text-foreground">Updating preview...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportPreview;