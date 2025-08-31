import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const AssessmentTrendsChart = () => {
  const trendsData = [
    { month: 'Jan', exams: 45, tests: 78, quizzes: 123 },
    { month: 'Feb', exams: 52, tests: 89, quizzes: 145 },
    { month: 'Mar', exams: 48, tests: 92, quizzes: 134 },
    { month: 'Apr', exams: 61, tests: 105, quizzes: 167 },
    { month: 'May', exams: 55, tests: 98, quizzes: 156 },
    { month: 'Jun', exams: 67, tests: 112, quizzes: 189 },
    { month: 'Jul', exams: 59, tests: 87, quizzes: 145 },
    { month: 'Aug', exams: 72, tests: 125, quizzes: 198 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-modal">
          <p className="font-medium text-popover-foreground mb-2">{label} 2024</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {`${entry?.name}: ${entry?.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-2">Assessment Trends</h3>
        <p className="text-sm text-muted-foreground">Monthly assessment activity across all classes</p>
      </div>
      
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="month" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="exams" 
              stroke="var(--color-primary)" 
              strokeWidth={2}
              dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
              name="Exams"
            />
            <Line 
              type="monotone" 
              dataKey="tests" 
              stroke="var(--color-accent)" 
              strokeWidth={2}
              dot={{ fill: 'var(--color-accent)', strokeWidth: 2, r: 4 }}
              name="Tests"
            />
            <Line 
              type="monotone" 
              dataKey="quizzes" 
              stroke="var(--color-success)" 
              strokeWidth={2}
              dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 4 }}
              name="Quizzes"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AssessmentTrendsChart;