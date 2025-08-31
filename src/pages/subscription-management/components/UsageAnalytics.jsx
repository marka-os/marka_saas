import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';

const UsageAnalytics = () => {
  const monthlyUsage = [
    { month: 'Jan', students: 280, assessments: 145, storage: 4.2 },
    { month: 'Feb', students: 295, assessments: 162, storage: 4.8 },
    { month: 'Mar', students: 312, assessments: 178, storage: 5.3 },
    { month: 'Apr', students: 328, assessments: 198, storage: 5.9 },
    { month: 'May', students: 341, assessments: 215, storage: 6.4 },
    { month: 'Jun', students: 347, assessments: 234, storage: 6.8 }
  ];

  const storageBreakdown = [
    { name: 'Student Records', value: 2.1, color: 'var(--color-primary)' },
    { name: 'Assessment Data', value: 2.8, color: 'var(--color-warning)' },
    { name: 'Report Files', value: 1.5, color: 'var(--color-success)' },
    { name: 'System Logs', value: 0.4, color: 'var(--color-muted-foreground)' }
  ];

  const usageStats = [
    {
      title: 'Active Students',
      current: 347,
      limit: 500,
      percentage: 69.4,
      trend: '+12 this month',
      trendType: 'positive',
      icon: 'Users',
      color: 'primary'
    },
    {
      title: 'Storage Used',
      current: '6.8 GB',
      limit: '10 GB',
      percentage: 68,
      trend: '+0.4 GB this month',
      trendType: 'neutral',
      icon: 'HardDrive',
      color: 'warning'
    },
    {
      title: 'API Requests',
      current: '4.2K',
      limit: '10K',
      percentage: 42,
      trend: '+250 this month',
      trendType: 'positive',
      icon: 'Zap',
      color: 'success'
    },
    {
      title: 'Report Generation',
      current: 234,
      limit: 'Unlimited',
      percentage: null,
      trend: '+18 this month',
      trendType: 'positive',
      icon: 'FileText',
      color: 'accent'
    }
  ];

  const getColorClass = (color, type = 'bg') => {
    const colorMap = {
      primary: type === 'bg' ? 'bg-primary' : 'text-primary',
      warning: type === 'bg' ? 'bg-warning' : 'text-warning',
      success: type === 'bg' ? 'bg-success' : 'text-success',
      accent: type === 'bg' ? 'bg-accent' : 'text-accent'
    };
    return colorMap?.[color] || 'bg-muted';
  };

  const getTrendIcon = (trendType) => {
    switch (trendType) {
      case 'positive':
        return <Icon name="TrendingUp" size={14} color="var(--color-success)" />;
      case 'negative':
        return <Icon name="TrendingDown" size={14} color="var(--color-error)" />;
      default:
        return <Icon name="Minus" size={14} color="var(--color-muted-foreground)" />;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-2">Usage Analytics</h3>
        <p className="text-muted-foreground">
          Monitor your current usage and track trends over time.
        </p>
      </div>
      {/* Usage Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {usageStats?.map((stat, index) => (
          <div key={index} className="bg-muted/30 border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${getColorClass(stat?.color)}/10 rounded-lg flex items-center justify-center`}>
                <Icon name={stat?.icon} size={20} color={`var(--color-${stat?.color})`} />
              </div>
              {getTrendIcon(stat?.trendType)}
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-foreground text-sm">{stat?.title}</h4>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground">{stat?.current}</span>
                {stat?.limit !== 'Unlimited' && (
                  <span className="text-muted-foreground text-sm">/ {stat?.limit}</span>
                )}
              </div>
              
              {stat?.percentage !== null && (
                <div className="space-y-1">
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div 
                      className={`${getColorClass(stat?.color)} h-1.5 rounded-full transition-all duration-300`}
                      style={{ width: `${stat?.percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{stat?.percentage?.toFixed(1)}% used</span>
                  </div>
                </div>
              )}
              
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {getTrendIcon(stat?.trendType)}
                {stat?.trend}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Usage Trends */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Usage Trends (6 Months)</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyUsage}>
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
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-popover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="students" 
                  stroke="var(--color-primary)" 
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-primary)', strokeWidth: 2 }}
                  name="Students"
                />
                <Line 
                  type="monotone" 
                  dataKey="assessments" 
                  stroke="var(--color-warning)" 
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-warning)', strokeWidth: 2 }}
                  name="Assessments"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Storage Breakdown */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Storage Breakdown</h4>
          <div className="flex flex-col lg:flex-row items-center gap-4">
            <div className="h-48 w-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={storageBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {storageBreakdown?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry?.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'var(--color-popover)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px'
                    }}
                    formatter={(value) => [`${value} GB`, 'Size']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-3 flex-1">
              {storageBreakdown?.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item?.color }}
                  ></div>
                  <div className="flex-1 flex justify-between">
                    <span className="text-sm text-foreground">{item?.name}</span>
                    <span className="text-sm font-medium text-foreground">{item?.value} GB</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Usage Alerts */}
      <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
        <div className="flex items-start gap-3">
          <Icon name="AlertTriangle" size={20} color="var(--color-warning)" />
          <div className="flex-1">
            <h5 className="font-medium text-foreground mb-1">Approaching Limit</h5>
            <p className="text-sm text-muted-foreground">
              Your storage usage is at 68% capacity. Consider upgrading your plan or cleaning up old files to avoid service interruptions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageAnalytics;