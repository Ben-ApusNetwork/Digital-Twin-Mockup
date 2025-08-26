
import React, { useState, useRef } from 'react';

type DataSourceMode = 'bio' | 'paste' | 'upload';

interface DataSourceStepProps {
  onSubmit: (dataSource: string) => void;
}

const ModeButton: React.FC<{
  label: string;
  description: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  icon: JSX.Element;
}> = ({ label, description, isActive, onClick, icon }) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-4 border-2 rounded-lg text-left transition-all w-full flex items-start space-x-4 ${
      isActive
        ? 'bg-brand-primary/20 border-brand-primary shadow-lg'
        : 'bg-base-100 border-base-300 hover:border-brand-secondary/50'
    }`}
  >
    <div className="flex-shrink-0 w-6 h-6 mt-1 text-brand-primary">{icon}</div>
    <div>
      <h3 className="font-bold text-content-strong">{label}</h3>
      <p className="text-sm text-content">{description}</p>
    </div>
  </button>
);

const DataSourceStep: React.FC<DataSourceStepProps> = ({ onSubmit }) => {
  const [mode, setMode] = useState<DataSourceMode>('bio');
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'text/plain' && file.size < 1024 * 1024) { // 1MB limit
        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (event) => {
          setContent(event.target?.result as string);
        };
        reader.readAsText(file);
      } else {
        if(file.size >= 1024 * 1024) {
            alert('File size exceeds 1MB limit.');
        } else {
            alert('Please upload a valid .txt file.');
        }
        setFileName('');
        setContent('');
        e.target.value = ''; // Reset file input
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const minCharCount = 500;
  const charCount = content.length;
  const isSufficient = charCount >= minCharCount;

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-content-strong mb-2 text-center">Provide Your Data Source</h2>
      <p className="text-center text-content mb-6">
        The more data you provide, the more accurate your twin will be.
      </p>

      <div className="space-y-3 mb-6">
        <ModeButton
          label="Quick Start"
          description={<>
            Quickly copy your bio from{' '}
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">LinkedIn</a>,{' '}
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">Twitter</a>, or{' '}
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">Facebook</a>
            {' and paste below. You can also write a short bio here yourself.'}
          </>}
          isActive={mode === 'bio'}
          onClick={() => setMode('bio')}
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>}
        />
        <ModeButton
          label="Precision: Paste Text"
          description="Paste a large body of your writing (e.g., chat logs, emails) into the text box below."
          isActive={mode === 'paste'}
          onClick={() => setMode('paste')}
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 5.25 6h.008a2.25 2.25 0 0 1 2.242 2.15 48.062 48.062 0 0 1 .858 5.482.75.75 0 0 0 .73.658h.407a.75.75 0 0 0 .73-.658 48.06 48.06 0 0 1 .858-5.482A2.25 2.25 0 0 1 11.25 6h.008a2.25 2.25 0 0 1 2.242 2.15 48.063 48.063 0 0 1 .533 3.402M9 12h3.75M9 15h3.75M9 18h3.75" /></svg>}
        />
        <ModeButton
          label="Precision: Upload File"
          description="Upload a .txt file containing your writing."
          isActive={mode === 'upload'}
          onClick={() => setMode('upload')}
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>}
        />
      </div>

      <form onSubmit={handleSubmit}>
        {mode === 'bio' && (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="e.g., Coffee enthusiast, love hiking with my dog. I tend to write in short, punchy sentences and use a lot of emojis. My friends say I'm pretty sarcastic."
            className="w-full h-40 p-3 bg-base-100 border-2 border-base-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors"
            required
          />
        )}
        {mode === 'paste' && (
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Paste at least ${minCharCount} characters of your writing here for best results...`}
              className="w-full h-64 p-3 bg-base-100 border-2 border-base-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors"
              required
            />
            <div className={`text-sm text-right mt-1 ${isSufficient ? 'text-green-400' : 'text-content'}`}>
                {charCount.toLocaleString()} / {minCharCount.toLocaleString()} characters {isSufficient && '✓'}
            </div>
            {!isSufficient && charCount > 0 && <p className="text-xs text-center text-content mt-2">More text will result in a higher quality twin.</p>}
          </div>
        )}
        {mode === 'upload' && (
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".txt,text/plain"
            />
            <button
              type="button"
              onClick={handleUploadClick}
              className="w-full p-4 bg-base-100 border-2 border-dashed border-base-300 rounded-lg flex flex-col items-center justify-center hover:border-brand-primary transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-base-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
              <span className="mt-2 font-semibold text-content-strong">
                {fileName || 'Click to upload a .txt file'}
              </span>
              <span className="text-sm text-content">Max 1MB</span>
            </button>
            {content && (
                 <div className={`text-sm text-center mt-2 ${isSufficient ? 'text-green-400' : 'text-content'}`}>
                    {charCount.toLocaleString()} characters loaded. {isSufficient ? 'Excellent source material!' : 'More text is recommended.'}
                </div>
            )}
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={!content.trim()}
            className="px-6 py-2 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-200 focus:ring-brand-primary transition-all disabled:bg-base-300 disabled:cursor-not-allowed"
          >
            Next: Personality Quiz
          </button>
        </div>
      </form>
    </div>
  );
};

export default DataSourceStep;