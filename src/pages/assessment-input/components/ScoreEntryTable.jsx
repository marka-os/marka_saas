import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ScoreEntryTable = ({ configuration, students, onScoresChange, scores = {} }) => {
  const [localScores, setLocalScores] = useState(scores);
  const [selectedCell, setSelectedCell] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const tableRef = useRef(null);

  const mockStudents = [
    {
      id: 'std001',
      lin: 'LIN2024001',
      name: 'Nakato Sarah',
      class: 'P7',
      stream: 'A',
      photo: 'https://randomuser.me/api/portraits/women/1.jpg'
    },
    {
      id: 'std002',
      lin: 'LIN2024002',
      name: 'Mukasa John',
      class: 'P7',
      stream: 'A',
      photo: 'https://randomuser.me/api/portraits/men/2.jpg'
    },
    {
      id: 'std003',
      lin: 'LIN2024003',
      name: 'Namuli Grace',
      class: 'P7',
      stream: 'A',
      photo: 'https://randomuser.me/api/portraits/women/3.jpg'
    },
    {
      id: 'std004',
      lin: 'LIN2024004',
      name: 'Ssemakula David',
      class: 'P7',
      stream: 'A',
      photo: 'https://randomuser.me/api/portraits/men/4.jpg'
    },
    {
      id: 'std005',
      lin: 'LIN2024005',
      name: 'Akello Mary',
      class: 'P7',
      stream: 'A',
      photo: 'https://randomuser.me/api/portraits/women/5.jpg'
    },
    {
      id: 'std006',
      lin: 'LIN2024006',
      name: 'Okello Peter',
      class: 'P7',
      stream: 'A',
      photo: 'https://randomuser.me/api/portraits/men/6.jpg'
    },
    {
      id: 'std007',
      lin: 'LIN2024007',
      name: 'Nabirye Joan',
      class: 'P7',
      stream: 'A',
      photo: 'https://randomuser.me/api/portraits/women/7.jpg'
    },
    {
      id: 'std008',
      lin: 'LIN2024008',
      name: 'Kato Samuel',
      class: 'P7',
      stream: 'A',
      photo: 'https://randomuser.me/api/portraits/men/8.jpg'
    }
  ];

  const studentsToUse = students || mockStudents;

  useEffect(() => {
    setLocalScores(scores);
  }, [scores]);

  const calculateGrade = (totalScore) => {
    if (totalScore >= 80) return { grade: 'D1', color: 'text-success' };
    if (totalScore >= 70) return { grade: 'D2', color: 'text-success' };
    if (totalScore >= 60) return { grade: 'C3', color: 'text-accent' };
    if (totalScore >= 50) return { grade: 'C4', color: 'text-accent' };
    if (totalScore >= 45) return { grade: 'C5', color: 'text-warning' };
    if (totalScore >= 40) return { grade: 'C6', color: 'text-warning' };
    if (totalScore >= 35) return { grade: 'P7', color: 'text-error' };
    if (totalScore >= 30) return { grade: 'P8', color: 'text-error' };
    return { grade: 'F9', color: 'text-error' };
  };

  const handleScoreChange = (studentId, scoreType, value) => {
    const numValue = parseFloat(value) || 0;
    const maxScore = scoreType === 'ca' ? configuration?.maxCAScore || 40 : configuration?.maxExamScore || 60;
    
    // Validation
    const errors = { ...validationErrors };
    const errorKey = `${studentId}-${scoreType}`;
    
    if (numValue < 0 || numValue > maxScore) {
      errors[errorKey] = `Score must be between 0 and ${maxScore}`;
    } else {
      delete errors?.[errorKey];
    }
    
    setValidationErrors(errors);

    const updatedScores = {
      ...localScores,
      [studentId]: {
        ...localScores?.[studentId],
        [scoreType]: numValue,
        total: scoreType === 'ca' 
          ? numValue + (localScores?.[studentId]?.exam || 0)
          : (localScores?.[studentId]?.ca || 0) + numValue
      }
    };

    setLocalScores(updatedScores);
    onScoresChange(updatedScores);
  };

  const handleKeyDown = (e, studentIndex, scoreType) => {
    const student = studentsToUse?.[studentIndex];
    
    switch (e?.key) {
      case 'Tab':
        e?.preventDefault();
        if (scoreType === 'ca') {
          setSelectedCell({ studentId: student?.id, type: 'exam' });
        } else if (studentIndex < studentsToUse?.length - 1) {
          setSelectedCell({ studentId: studentsToUse?.[studentIndex + 1]?.id, type: 'ca' });
        }
        break;
      case 'Enter':
        e?.preventDefault();
        if (studentIndex < studentsToUse?.length - 1) {
          setSelectedCell({ studentId: studentsToUse?.[studentIndex + 1]?.id, type: scoreType });
        }
        break;
      case 'ArrowUp':
        e?.preventDefault();
        if (studentIndex > 0) {
          setSelectedCell({ studentId: studentsToUse?.[studentIndex - 1]?.id, type: scoreType });
        }
        break;
      case 'ArrowDown':
        e?.preventDefault();
        if (studentIndex < studentsToUse?.length - 1) {
          setSelectedCell({ studentId: studentsToUse?.[studentIndex + 1]?.id, type: scoreType });
        }
        break;
    }
  };

  const getCompletionStats = () => {
    const totalEntries = studentsToUse?.length * 2; // CA + Exam for each student
    const completedEntries = Object.values(localScores)?.reduce((count, scores) => {
      return count + (scores?.ca > 0 ? 1 : 0) + (scores?.exam > 0 ? 1 : 0);
    }, 0);
    
    return {
      completed: completedEntries,
      total: totalEntries,
      percentage: Math.round((completedEntries / totalEntries) * 100)
    };
  };

  const stats = getCompletionStats();

  if (!configuration?.subject || !configuration?.class) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <Icon name="AlertCircle" size={48} className="mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">Configuration Required</h3>
        <p className="text-muted-foreground">Please complete the assessment configuration to begin score entry.</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <Icon name="Table" size={20} color="var(--color-accent-foreground)" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Score Entry</h2>
              <p className="text-sm text-muted-foreground">
                {studentsToUse?.length} students • {configuration?.maxCAScore + configuration?.maxExamScore} total marks
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm font-medium text-foreground">{stats?.percentage}% Complete</div>
              <div className="text-xs text-muted-foreground">{stats?.completed}/{stats?.total} entries</div>
            </div>
            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-success transition-all duration-300"
                style={{ width: `${stats?.percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Icon name="Upload" size={16} />
              Import CSV
            </Button>
            <Button variant="outline" size="sm">
              <Icon name="Copy" size={16} />
              Copy Previous
            </Button>
            <Button variant="outline" size="sm">
              <Icon name="RotateCcw" size={16} />
              Clear All
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Icon name="Save" size={16} />
              Auto-save: On
            </Button>
            <Button variant="default" size="sm">
              <Icon name="Check" size={16} />
              Submit for Approval
            </Button>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto" ref={tableRef}>
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-4 font-medium text-foreground border-r border-border">Student</th>
              <th className="text-center p-4 font-medium text-foreground border-r border-border w-32">
                CA Score
                <div className="text-xs text-muted-foreground font-normal">/{configuration?.maxCAScore}</div>
              </th>
              <th className="text-center p-4 font-medium text-foreground border-r border-border w-32">
                Exam Score
                <div className="text-xs text-muted-foreground font-normal">/{configuration?.maxExamScore}</div>
              </th>
              <th className="text-center p-4 font-medium text-foreground border-r border-border w-32">
                Total
                <div className="text-xs text-muted-foreground font-normal">/{configuration?.maxCAScore + configuration?.maxExamScore}</div>
              </th>
              <th className="text-center p-4 font-medium text-foreground w-24">Grade</th>
            </tr>
          </thead>
          <tbody>
            {studentsToUse?.map((student, index) => {
              const studentScores = localScores?.[student?.id] || { ca: 0, exam: 0, total: 0 };
              const gradeInfo = calculateGrade(studentScores?.total);
              const isPassing = studentScores?.total >= (configuration?.passingGrade || 50);

              return (
                <tr key={student?.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="p-4 border-r border-border">
                    <div className="flex items-center space-x-3">
                      <img
                        src={student?.photo}
                        alt={student?.name}
                        className="w-8 h-8 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = '/assets/images/no_image.png';
                        }}
                      />
                      <div>
                        <div className="font-medium text-foreground">{student?.name}</div>
                        <div className="text-xs text-muted-foreground">{student?.lin}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 border-r border-border text-center">
                    <Input
                      type="number"
                      value={studentScores?.ca || ''}
                      onChange={(e) => handleScoreChange(student?.id, 'ca', e?.target?.value)}
                      onKeyDown={(e) => handleKeyDown(e, index, 'ca')}
                      onFocus={() => setSelectedCell({ studentId: student?.id, type: 'ca' })}
                      className={`text-center ${selectedCell?.studentId === student?.id && selectedCell?.type === 'ca' ? 'ring-2 ring-primary' : ''}`}
                      min="0"
                      max={configuration?.maxCAScore}
                      placeholder="0"
                      error={validationErrors?.[`${student?.id}-ca`]}
                    />
                  </td>
                  <td className="p-4 border-r border-border text-center">
                    <Input
                      type="number"
                      value={studentScores?.exam || ''}
                      onChange={(e) => handleScoreChange(student?.id, 'exam', e?.target?.value)}
                      onKeyDown={(e) => handleKeyDown(e, index, 'exam')}
                      onFocus={() => setSelectedCell({ studentId: student?.id, type: 'exam' })}
                      className={`text-center ${selectedCell?.studentId === student?.id && selectedCell?.type === 'exam' ? 'ring-2 ring-primary' : ''}`}
                      min="0"
                      max={configuration?.maxExamScore}
                      placeholder="0"
                      error={validationErrors?.[`${student?.id}-exam`]}
                    />
                  </td>
                  <td className="p-4 border-r border-border text-center">
                    <div className={`font-mono font-medium text-lg ${isPassing ? 'text-success' : 'text-error'}`}>
                      {studentScores?.total || 0}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className={`font-mono font-bold text-sm px-2 py-1 rounded ${gradeInfo?.color}`}>
                      {studentScores?.total > 0 ? gradeInfo?.grade : '-'}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Footer Summary */}
      <div className="p-4 bg-muted border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span className="text-muted-foreground">Passing: {Object.values(localScores)?.filter(s => s?.total >= (configuration?.passingGrade || 50))?.length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-error rounded-full"></div>
              <span className="text-muted-foreground">Failing: {Object.values(localScores)?.filter(s => s?.total > 0 && s?.total < (configuration?.passingGrade || 50))?.length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-muted-foreground rounded-full"></div>
              <span className="text-muted-foreground">Pending: {studentsToUse?.length - Object.keys(localScores)?.filter(id => localScores?.[id]?.total > 0)?.length}</span>
            </div>
          </div>
          
          <div className="text-muted-foreground">
            Last saved: {new Date()?.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreEntryTable;