import React from 'react';
import { AppStep } from '../types';

interface StepIndicatorProps {
  currentStep: AppStep;
}

const steps = ['Bio & Quiz', 'Chat', 'Rate'];

const getStepIndex = (step: AppStep): number => {
  switch (step) {
    case AppStep.BIO:
    case AppStep.QUIZ:
    case AppStep.GENERATING:
      return 0;
    case AppStep.CHAT:
      return 1;
    case AppStep.RATING:
      return 2;
    default:
      return 0;
  }
};

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const currentStepIndex = getStepIndex(currentStep);

  return (
    <div className="w-full max-w-xs mx-auto mb-14">
      <div className="relative flex items-start justify-between">
        {/* Connecting Line */}
        <div className="absolute left-0 top-4 w-full h-0.5 bg-base-300" />

        {steps.map((label, index) => {
          const isActive = index === currentStepIndex;
          
          return (
            <div key={label} className="relative z-10 flex flex-col items-center w-20">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 bg-base-100 ${
                  isActive ? 'bg-brand-primary text-white' : 'bg-base-300 text-content-strong'
                }`}
              >
                <span className="font-bold">{index + 1}</span>
              </div>
              <p className="mt-2 text-sm text-center font-medium text-content">
                {label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
