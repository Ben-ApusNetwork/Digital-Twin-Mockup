
import React, { useState, useCallback } from 'react';
import BioStep from './components/BioStep';
import QuizStep from './components/QuizStep';
import GeneratingStep from './components/GeneratingStep';
import ChatStep from './components/ChatStep';
import RatingStep from './components/RatingStep';
import FinalStep from './components/FinalStep';
import StepIndicator from './components/StepIndicator';
import { generatePersona } from './services/geminiService';
import { quizQuestions } from './constants';
import type { AppStep, QuizAnswers, Ratings } from './types';
import { AppStep as AppStepEnum } from './types';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStepEnum.BIO);
  const [bio, setBio] = useState<string>('');
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>({});
  const [persona, setPersona] = useState<string>('');
  const [ratings, setRatings] = useState<Ratings>({ accuracy: 3, consciousness: 3, note: '' });
  const [error, setError] = useState<string | null>(null);

  const handleBioSubmit = (userBio: string) => {
    setBio(userBio);
    setStep(AppStepEnum.QUIZ);
  };

  const handleQuizSubmit = useCallback(async (answers: QuizAnswers) => {
    setQuizAnswers(answers);
    setStep(AppStepEnum.GENERATING);
    setError(null);
    try {
      const generatedPersona = await generatePersona(bio, answers);
      setPersona(generatedPersona);
      setStep(AppStepEnum.CHAT);
    } catch (e) {
      console.error(e);
      let errorMessage = 'Failed to generate your Digital Twin. Please try again.';
      if (e instanceof Error) {
        if (e.message.includes('PERMISSION_DENIED') || e.message.includes('Region not supported')) {
          errorMessage = 'Sorry, the AI service is not available in your region.';
        } else if (e.message.includes('API_KEY')) {
          errorMessage = 'The API key is invalid or missing. Please contact support.';
        }
      }
      setError(errorMessage);
      setStep(AppStepEnum.QUIZ);
    }
  }, [bio]);

  const handleChatComplete = () => {
    setStep(AppStepEnum.RATING);
  };

  const handleRatingSubmit = (userRatings: Ratings) => {
    setRatings(userRatings);
    setStep(AppStepEnum.FINAL);
  };

  const restart = () => {
    setBio('');
    setQuizAnswers({});
    setPersona('');
    setRatings({ accuracy: 3, consciousness: 3, note: '' });
    setError(null);
    setStep(AppStepEnum.BIO);
  };

  const renderStep = () => {
    switch (step) {
      case AppStepEnum.BIO:
        return <BioStep onSubmit={handleBioSubmit} />;
      case AppStepEnum.QUIZ:
        return <QuizStep questions={quizQuestions} onSubmit={handleQuizSubmit} initialAnswers={quizAnswers} />;
      case AppStepEnum.GENERATING:
        return <GeneratingStep />;
      case AppStepEnum.CHAT:
        return <ChatStep persona={persona} onComplete={handleChatComplete} />;
      case AppStepEnum.RATING:
        return <RatingStep onSubmit={handleRatingSubmit} />;
      case AppStepEnum.FINAL:
        return <FinalStep onRestart={restart} />;
      default:
        return <BioStep onSubmit={handleBioSubmit} />;
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-content-strong mb-2">Create Your Digital Twin</h1>
          <p className="text-lg text-content">An AI that learns your communication style.</p>
        </header>
        
        {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative mb-6" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        )}

        {step !== AppStepEnum.FINAL && <StepIndicator currentStep={step} />}

        <main className="bg-base-200 p-6 sm:p-8 rounded-2xl shadow-2xl w-full">
          {renderStep()}
        </main>
        <footer className="text-center mt-8 text-sm text-base-300">
          <p>Digital Twin MVP &copy; 2024</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
