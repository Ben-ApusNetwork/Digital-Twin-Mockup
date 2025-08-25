import type { QuizQuestion } from './types';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'A friend texts you "Hey, what are you up to this weekend?". How do you reply?',
    type: 'choice',
    options: [
      'Just chilling, hbu?',
      'Not much planned yet, maybe catch a movie or something. You got any ideas?',
      'I am currently evaluating my options for the upcoming weekend. I will let you know once my schedule is finalized.',
      '🎉 not sure yet! open to adventures tho! 🚀 what about you?',
    ],
  },
  {
    id: 'q2',
    question: 'How often do you use emojis in your texts?',
    type: 'choice',
    options: ['In almost every message', 'Sometimes, to add emphasis', 'Rarely', 'Never'],
  },
  {
    id: 'q3',
    question: 'Someone asks you a question you don\'t know the answer to. What do you say?',
    type: 'choice',
    options: [
      '"idk"',
      '"Hmm, good question. I\'m not sure but I can look it up."',
      '"I do not possess the information required to answer that query."',
      '"That\'s a stumper! Let me google that real quick."',
    ],
  },
  {
    id: 'q4',
    question: 'Describe your sense of humor in one or two words.',
    type: 'choice',
    options: ['Sarcastic', 'Witty / Dry', 'Silly / Goofy', 'Dark'],
  },
  {
    id: 'q5',
    question: 'What\'s your go-to conversation starter?',
    type: 'choice',
    options: [
        'Any fun plans for the weekend?',
        'Seen any good movies/shows lately?',
        'Something observational about the current situation.',
        'A random, interesting fact.'
    ],
  },
   {
    id: 'q6',
    question: 'When you share good news, are you more likely to be...',
    type: 'choice',
    options: [
      'Short and sweet: "Got the job!"',
      'Enthusiastic and detailed, with lots of exclamation points.',
      'Humble and understated.',
      'Funny and maybe a little self-deprecating about it.',
    ],
  },
];