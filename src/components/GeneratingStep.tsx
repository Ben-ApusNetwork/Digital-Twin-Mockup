
import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const GeneratingStep: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 animate-fade-in">
      <LoadingSpinner />
      <h2 className="text-2xl font-bold text-content-strong mt-6">Generating Your Digital Twin...</h2>
      <p className="text-content mt-2">The AI is analyzing your style. This might take a moment.</p>
    </div>
  );
};

export default GeneratingStep;