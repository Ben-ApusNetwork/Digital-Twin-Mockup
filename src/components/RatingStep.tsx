
import React, { useState } from 'react';
import type { Ratings } from '../types';

interface RatingStepProps {
  onSubmit: (ratings: Ratings) => void;
}

const RatingStep: React.FC<RatingStepProps> = ({ onSubmit }) => {
  const [accuracy, setAccuracy] = useState(3);
  const [consciousness, setConsciousness] = useState(3);
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ accuracy, consciousness, note });
  };

  const Slider = ({ label, description, value, onChange }: { label: string, description: string, value: number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <div>
      <label className="block text-lg font-semibold text-content-strong">{label}</label>
      <p className="text-sm text-content mb-3">{description}</p>
      <div className="flex items-center space-x-4">
        <span className="text-sm">1</span>
        <input
          type="range"
          min="1"
          max="5"
          value={value}
          onChange={onChange}
          className="w-full h-2 bg-base-300 rounded-lg appearance-none cursor-pointer accent-brand-primary"
        />
        <span className="text-sm">5</span>
        <span className="font-bold text-lg text-content-strong w-4 text-center">{value}</span>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-content-strong mb-6 text-center">Rate Your Twin</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        <Slider 
          label="Accuracy" 
          description="How well did the twin match your writing style (tone, phrasing, pacing)?"
          value={accuracy} 
          onChange={(e) => setAccuracy(parseInt(e.target.value))}
        />
        <Slider 
          label="Perceived Consciousness"
          description="How 'human-like' or aware did the twin feel?"
          value={consciousness} 
          onChange={(e) => setConsciousness(parseInt(e.target.value))}
        />
        <div>
          <label htmlFor="note" className="block text-lg font-semibold text-content-strong mb-2">Private Note (Optional)</label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Any additional feedback or thoughts..."
            className="w-full h-24 p-3 bg-base-100 border-2 border-base-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors"
          />
        </div>
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-200 focus:ring-brand-primary transition-all"
          >
            Submit Feedback
          </button>
        </div>
      </form>
    </div>
  );
};

export default RatingStep;