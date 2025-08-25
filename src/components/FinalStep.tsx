
import React from 'react';

interface FinalStepProps {
    onRestart: () => void;
}

const FinalStep: React.FC<FinalStepProps> = ({ onRestart }) => {
  return (
    <div className="text-center animate-fade-in py-8">
      <div className="mx-auto w-16 h-16 flex items-center justify-center bg-green-500/20 rounded-full mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-content-strong mb-4">Thank You!</h2>
      <p className="text-lg text-content mb-8">
        Your Digital Twin experience is complete. Your feedback has been recorded.
      </p>
      <button
        onClick={onRestart}
        className="px-8 py-3 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-200 focus:ring-brand-primary transition-all"
      >
        Create Another Twin
      </button>
      <div className="mt-12 p-6 bg-base-100 rounded-lg border border-base-300">
        <h3 className="text-xl font-bold text-content-strong mb-3">Premium Features Coming Soon</h3>
        <p className="text-content">
            Soon you'll be able to permanently publish your Twin Card, share chat excerpts, and get an "Attested by Apus" badge. Stay tuned!
        </p>
      </div>
    </div>
  );
};

export default FinalStep;