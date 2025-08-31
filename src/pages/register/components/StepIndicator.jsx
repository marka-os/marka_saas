import React from 'react';
import Icon from '../../../components/AppIcon';

const StepIndicator = ({ currentStep, totalSteps }) => {
  const steps = [
    { number: 1, title: 'School Information', description: 'Basic details' },
    { number: 2, title: 'Administrator Account', description: 'Admin setup' },
    { number: 3, title: 'Subscription Plan', description: 'Choose plan' }
  ];

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-6 left-0 w-full h-0.5 bg-border">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          />
        </div>

        {/* Step Items */}
        {steps?.map((step) => {
          const isCompleted = step?.number < currentStep;
          const isCurrent = step?.number === currentStep;
          const isUpcoming = step?.number > currentStep;

          return (
            <div key={step?.number} className="flex flex-col items-center relative z-10">
              <div 
                className={`
                  w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300
                  ${isCompleted 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : isCurrent 
                      ? 'bg-card border-primary text-primary' :'bg-card border-border text-muted-foreground'
                  }
                `}
              >
                {isCompleted ? (
                  <Icon name="Check" size={20} />
                ) : (
                  <span className="font-semibold text-sm">{step?.number}</span>
                )}
              </div>
              <div className="mt-3 text-center max-w-24">
                <p className={`text-sm font-medium ${
                  isCurrent ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step?.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {step?.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;