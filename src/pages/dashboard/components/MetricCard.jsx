import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricCard = ({ title, value, change, changeType, icon, description, onClick }) => {
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-success';
    if (changeType === 'negative') return 'text-error';
    return 'text-muted-foreground';
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') return 'TrendingUp';
    if (changeType === 'negative') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div 
      className={`bg-card border border-border rounded-lg p-6 transition-all duration-200 hover:shadow-md ${
        onClick ? 'cursor-pointer hover:border-primary/20' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name={icon} size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h3 className="font-medium text-card-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold text-card-foreground mb-1">{value}</p>
          {change && (
            <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
              <Icon name={getChangeIcon()} size={14} />
              <span className="text-sm font-medium">{change}</span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;