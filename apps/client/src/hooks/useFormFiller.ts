import { useState } from 'react';
import type { Question } from '../store/api/generated';

export function useFormFiller(questions: Question[]) {
  const [answers, setAnswers] = useState<Record<string, string[]>>({});

  const setAnswer = (questionId: string, values: string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: values
    }));
  };

  const getAnswersPayload = () => {
    return Object.entries(answers).map(([questionId, values]) => ({
      questionId,
      values
    }));
  };

  const validateRequired = () => {
    return questions.every(q => {
      if (!q.required) return true;
      const ans = answers[q.id];
      return ans && ans.length > 0 && ans[0].trim() !== '';
    });
  };

  const clearForm = () => setAnswers({});

  return { answers, setAnswer, getAnswersPayload, validateRequired, clearForm };
}
