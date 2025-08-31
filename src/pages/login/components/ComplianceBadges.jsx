import React from 'react';
import Icon from '../../../components/AppIcon';

const ComplianceBadges = () => {
  const badges = [
    {
      icon: 'Shield',
      title: 'UNEB',
      subtitle: 'Compliant',
      color: 'success',
      description: 'Uganda National Examinations Board approved'
    },
    {
      icon: 'Award',
      title: 'MoES',
      subtitle: 'Certified',
      color: 'primary',
      description: 'Ministry of Education and Sports certified'
    },
    {
      icon: 'Lock',
      title: 'ISO 27001',
      subtitle: 'Secured',
      color: 'warning',
      description: 'International security standards compliant'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      success: {
        bg: 'bg-success/10',
        border: 'border-success/20',
        icon: 'var(--color-success)',
        text: 'text-success'
      },
      primary: {
        bg: 'bg-primary/10',
        border: 'border-primary/20',
        icon: 'var(--color-primary)',
        text: 'text-primary'
      },
      warning: {
        bg: 'bg-warning/10',
        border: 'border-warning/20',
        icon: 'var(--color-warning)',
        text: 'text-warning'
      }
    };
    return colorMap?.[color] || colorMap?.primary;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
        Compliance & Certifications
      </h3>
      <div className="space-y-3">
        {badges?.map((badge, index) => {
          const colors = getColorClasses(badge?.color);
          
          return (
            <div
              key={index}
              className={`${colors?.bg} ${colors?.border} border rounded-lg p-4 transition-all duration-200 hover:shadow-sm`}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Icon 
                    name={badge?.icon} 
                    size={24} 
                    color={colors?.icon}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline space-x-2">
                    <h4 className={`font-semibold text-sm ${colors?.text}`}>
                      {badge?.title}
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      {badge?.subtitle}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {badge?.description}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Icon 
                    name="CheckCircle" 
                    size={16} 
                    color={colors?.icon}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Additional Trust Indicators */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border/50">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Users" size={16} color="var(--color-muted-foreground)" />
          <span className="text-sm font-medium text-foreground">500+ Schools</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Trusted by educational institutions across Uganda for secure and compliant 
          student data management.
        </p>
      </div>
      <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border/50">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Database" size={16} color="var(--color-muted-foreground)" />
          <span className="text-sm font-medium text-foreground">99.9% Uptime</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Reliable cloud infrastructure ensuring your school data is always accessible 
          when you need it.
        </p>
      </div>
    </div>
  );
};

export default ComplianceBadges;