import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const GradeDistributionChart = () => {
  const gradeData = [
    { grade: 'A', students: 145, percentage: 12 },
    { grade: 'B+', students: 234, percentage: 19 },
    { grade: 'B', students: 298, percentage: 24 },
    { grade: 'C+', students: 267, percentage: 21 },
    { grade: 'C', students: 189, percentage: 15 },
    { grade: 'D+', students: 78, percentage: 6 },
    { grade: 'D', students: 36, percentage: 3 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-modal">
          <p className="font-medium text-popover-foreground">{`Grade ${label}`}</p>
          <p className="text-sm text-muted-foreground">
            {`Students: ${payload?.[0]?.value}`}
          </p>
          <p className="text-sm text-muted-foreground">
            {`Percentage: ${payload?.[0]?.payload?.percentage}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-2">Grade Distribution</h3>
        <p className="text-sm text-muted-foreground">Current academic year performance overview</p>
      </div>
      
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={gradeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="grade" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="students" 
              fill="var(--color-primary)" 
              radius={[4, 4, 0, 0]}
              name="Number of Students"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GradeDistributionChart;