import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AssessmentSummary = ({ configuration, scores, students }) => {
  const mockStudents = [
    { id: 'std001', name: 'Nakato Sarah' },
    { id: 'std002', name: 'Mukasa John' },
    { id: 'std003', name: 'Namuli Grace' },
    { id: 'std004', name: 'Ssemakula David' },
    { id: 'std005', name: 'Akello Mary' },
    { id: 'std006', name: 'Okello Peter' },
    { id: 'std007', name: 'Nabirye Joan' },
    { id: 'std008', name: 'Kato Samuel' }
  ];

  const studentsToUse = students || mockStudents;

  const calculateStatistics = () => {
    const validScores = Object.values(scores)?.filter(score => score?.total > 0);
    
    if (validScores?.length === 0) {
      return {
        totalStudents: studentsToUse?.length,
        completedEntries: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        passingCount: 0,
        failingCount: 0,
        gradeDistribution: {}
      };
    }

    const totals = validScores?.map(score => score?.total);
    const passingGrade = configuration?.passingGrade || 50;
    
    const gradeDistribution = validScores?.reduce((dist, score) => {
      let grade;
      if (score?.total >= 80) grade = 'D1';
      else if (score?.total >= 70) grade = 'D2';
      else if (score?.total >= 60) grade = 'C3';
      else if (score?.total >= 50) grade = 'C4';
      else if (score?.total >= 45) grade = 'C5';
      else if (score?.total >= 40) grade = 'C6';
      else if (score?.total >= 35) grade = 'P7';
      else if (score?.total >= 30) grade = 'P8';
      else grade = 'F9';
      
      dist[grade] = (dist?.[grade] || 0) + 1;
      return dist;
    }, {});

    return {
      totalStudents: studentsToUse?.length,
      completedEntries: validScores?.length,
      averageScore: Math.round(totals?.reduce((sum, score) => sum + score, 0) / totals?.length),
      highestScore: Math.max(...totals),
      lowestScore: Math.min(...totals),
      passingCount: validScores?.filter(score => score?.total >= passingGrade)?.length,
      failingCount: validScores?.filter(score => score?.total < passingGrade)?.length,
      gradeDistribution
    };
  };

  const stats = calculateStatistics();
  const completionPercentage = Math.round((stats?.completedEntries / stats?.totalStudents) * 100);

  const gradeColors = {
    'D1': 'bg-success text-success-foreground',
    'D2': 'bg-success text-success-foreground',
    'C3': 'bg-accent text-accent-foreground',
    'C4': 'bg-accent text-accent-foreground',
    'C5': 'bg-warning text-warning-foreground',
    'C6': 'bg-warning text-warning-foreground',
    'P7': 'bg-error text-error-foreground',
    'P8': 'bg-error text-error-foreground',
    'F9': 'bg-error text-error-foreground'
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="BarChart3" size={20} color="var(--color-primary-foreground)" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Assessment Summary</h2>
            <p className="text-sm text-muted-foreground">Real-time statistics and grade distribution</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Icon name="Download" size={16} />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <Icon name="Printer" size={16} />
            Print Summary
          </Button>
        </div>
      </div>
      {/* Progress Overview */}
      <div className="bg-muted rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-foreground">Entry Progress</span>
          <span className="text-sm text-muted-foreground">{stats?.completedEntries}/{stats?.totalStudents} students</span>
        </div>
        <div className="w-full bg-background rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>0%</span>
          <span className="font-medium">{completionPercentage}% Complete</span>
          <span>100%</span>
        </div>
      </div>
      {/* Key Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-background rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-foreground">{stats?.averageScore}</div>
          <div className="text-sm text-muted-foreground">Average Score</div>
          <div className="text-xs text-muted-foreground mt-1">
            /{(configuration?.maxCAScore || 40) + (configuration?.maxExamScore || 60)}
          </div>
        </div>
        
        <div className="bg-background rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-success">{stats?.highestScore}</div>
          <div className="text-sm text-muted-foreground">Highest Score</div>
          <div className="text-xs text-success mt-1">Best Performance</div>
        </div>
        
        <div className="bg-background rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-error">{stats?.lowestScore}</div>
          <div className="text-sm text-muted-foreground">Lowest Score</div>
          <div className="text-xs text-error mt-1">Needs Support</div>
        </div>
        
        <div className="bg-background rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-accent">
            {stats?.completedEntries > 0 ? Math.round((stats?.passingCount / stats?.completedEntries) * 100) : 0}%
          </div>
          <div className="text-sm text-muted-foreground">Pass Rate</div>
          <div className="text-xs text-muted-foreground mt-1">{stats?.passingCount}/{stats?.completedEntries}</div>
        </div>
      </div>
      {/* Performance Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pass/Fail Distribution */}
        <div>
          <h3 className="font-medium text-foreground mb-4 flex items-center space-x-2">
            <Icon name="PieChart" size={16} />
            <span>Performance Distribution</span>
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-success/10 border border-success/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-success rounded-full"></div>
                <span className="text-sm font-medium text-foreground">Passing Students</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-success">{stats?.passingCount}</div>
                <div className="text-xs text-muted-foreground">
                  {stats?.completedEntries > 0 ? Math.round((stats?.passingCount / stats?.completedEntries) * 100) : 0}%
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-error/10 border border-error/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-error rounded-full"></div>
                <span className="text-sm font-medium text-foreground">Failing Students</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-error">{stats?.failingCount}</div>
                <div className="text-xs text-muted-foreground">
                  {stats?.completedEntries > 0 ? Math.round((stats?.failingCount / stats?.completedEntries) * 100) : 0}%
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted border border-border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-muted-foreground rounded-full"></div>
                <span className="text-sm font-medium text-foreground">Pending Entries</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-muted-foreground">{stats?.totalStudents - stats?.completedEntries}</div>
                <div className="text-xs text-muted-foreground">
                  {Math.round(((stats?.totalStudents - stats?.completedEntries) / stats?.totalStudents) * 100)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grade Distribution */}
        <div>
          <h3 className="font-medium text-foreground mb-4 flex items-center space-x-2">
            <Icon name="BarChart" size={16} />
            <span>Grade Distribution</span>
          </h3>
          
          <div className="space-y-2">
            {Object.entries(stats?.gradeDistribution)?.map(([grade, count]) => (
              <div key={grade} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`px-2 py-1 rounded text-xs font-mono font-bold ${gradeColors?.[grade]}`}>
                    {grade}
                  </div>
                  <span className="text-sm text-foreground">{count} student{count !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${stats?.completedEntries > 0 ? (count / stats?.completedEntries) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8 text-right">
                    {stats?.completedEntries > 0 ? Math.round((count / stats?.completedEntries) * 100) : 0}%
                  </span>
                </div>
              </div>
            ))}
            
            {Object.keys(stats?.gradeDistribution)?.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="BarChart" size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No grades to display yet</p>
                <p className="text-xs">Start entering scores to see distribution</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Action Items */}
      {stats?.completedEntries > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <h3 className="font-medium text-foreground mb-4 flex items-center space-x-2">
            <Icon name="AlertTriangle" size={16} />
            <span>Action Items</span>
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {stats?.failingCount > 0 && (
              <div className="bg-error/10 border border-error/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="AlertCircle" size={16} color="var(--color-error)" />
                  <span className="font-medium text-error">Students Need Support</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {stats?.failingCount} student{stats?.failingCount !== 1 ? 's' : ''} scored below passing grade ({configuration?.passingGrade || 50})
                </p>
              </div>
            )}
            
            {stats?.completedEntries < stats?.totalStudents && (
              <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Clock" size={16} color="var(--color-warning)" />
                  <span className="font-medium text-warning">Incomplete Entries</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {stats?.totalStudents - stats?.completedEntries} student{stats?.totalStudents - stats?.completedEntries !== 1 ? 's' : ''} still need score entry
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentSummary;