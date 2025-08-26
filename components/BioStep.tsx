
import React, { useState } from 'react';

interface BioStepProps {
  onSubmit: (bio: string) => void;
}

const BioStep: React.FC<BioStepProps> = ({ onSubmit }) => {
  const [bio, setBio] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bio.trim()) {
      onSubmit(bio);
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-content-strong mb-4 text-center">Tell Us About Yourself</h2>
      <p className="text-center text-content mb-6">
        Quickly copy your bio from{' '}
        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">LinkedIn</a>,{' '}
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">Twitter</a>, or{' '}
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">Facebook</a>
        {' and paste below. You can also write a short bio here yourself.'}
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="e.g., Coffee enthusiast, love hiking with my dog. I tend to write in short, punchy sentences and use a lot of emojis. My friends say I'm pretty sarcastic."
          className="w-full h-40 p-3 bg-base-100 border-2 border-base-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors"
          required
        />
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={!bio.trim()}
            className="px-6 py-2 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-200 focus:ring-brand-primary transition-all disabled:bg-base-300 disabled:cursor-not-allowed"
          >
            Next: Personality Quiz
          </button>
        </div>
      </form>
    </div>
  );
};

export default BioStep;