
import React, { useState } from 'react';
import type { QuizQuestion, QuizAnswers } from '../types';

interface QuizStepProps {
  questions: QuizQuestion[];
  onSubmit: (answers: QuizAnswers) => void;
  initialAnswers: QuizAnswers;
}

const QuizStep: React.FC<QuizStepProps> = ({ questions, onSubmit, initialAnswers }) => {
  const [answers, setAnswers] = useState<QuizAnswers>(initialAnswers);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(answers);
  };
  
  const allQuestionsAnswered = questions.every(q => answers[q.id]?.trim());

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-content-strong mb-6 text-center">Personality Quiz</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        {questions.map((q, index) => (
          <div key={q.id}>
            <label className="block text-lg font-semibold text-content-strong mb-3">
              {index + 1}. {q.question}
            </label>
            {q.type === 'text' ? (
              <input
                type="text"
                value={answers[q.id] || ''}
                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                className="w-full p-2 bg-base-100 border-2 border-base-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors"
                required
              />
            ) : (
              <div className="space-y-3">
                {q.options?.map((option) => (
                  <label
                    key={option}
                    className={`block w-full p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      answers[q.id] === option ? 'bg-brand-primary/20 border-brand-primary' : 'bg-base-100 border-base-300 hover:border-brand-secondary/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      value={option}
                      checked={answers[q.id] === option}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      className="hidden"
                      required
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={!allQuestionsAnswered}
            className="px-6 py-2 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-200 focus:ring-brand-primary transition-all disabled:bg-base-300 disabled:cursor-not-allowed"
          >
            Generate My Twin
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuizStep;
