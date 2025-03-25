import React from 'react';

interface StepperProps {
  steps: string[];
  currentStep: number;
  onChange?: (step: number) => void;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onChange,
  className = '',
}) => {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <React.Fragment key={index}>
              {/* Step circle */}
              <div 
                className={`relative flex items-center justify-center w-8 h-8 rounded-full 
                  ${isCompleted 
                    ? 'bg-primary-500 text-white' 
                    : isCurrent 
                      ? 'bg-primary-100 text-primary-700 border border-primary-500' 
                      : 'bg-gray-100 text-gray-500'
                  } ${onChange ? 'cursor-pointer' : ''}`}
                onClick={() => onChange && onChange(index)}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              
              {/* Line between steps */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-2">
                  <div 
                    className={`h-1 ${index < currentStep ? 'bg-primary-500' : 'bg-gray-200'}`} 
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      {/* Step labels */}
      <div className="flex items-center justify-between mt-2">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={`text-xs font-medium ${
              index <= currentStep ? 'text-primary-700' : 'text-gray-500'
            }`}
            style={{ width: `${100 / steps.length}%`, textAlign: 'center' }}
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );
};