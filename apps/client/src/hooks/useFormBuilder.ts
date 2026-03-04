import { useState } from 'react';
import { QuestionType, type QuestionInput } from '../store/api/generated';

// Helper to generate temporary UI IDs for questions
let tempId = 0;
const getTempId = () => `temp_${tempId++}`;

export function useFormBuilder() {
  const [title, setTitle] = useState('Untitled Form');
  const [description, setDescription] = useState('');
  // We use QuestionInput type as defined by our GraphQL schema, but extend it with a tempId for React keys
  const [questions, setQuestions] = useState<(QuestionInput & { _tempId: string })[]>([{
    _tempId: getTempId(),
    text: 'Untitled Question',
    type: QuestionType.Text,
    required: false,
    options: [],
  }]);

  const addQuestion = (type: QuestionType = QuestionType.Text) => {
    setQuestions([...questions, {
      _tempId: getTempId(),
      text: '',
      type,
      required: false,
      options: type === QuestionType.MultipleChoice || type === QuestionType.Checkbox ? ['Option 1'] : [],
    }]);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q._tempId !== id));
  };

  const updateQuestion = (id: string, updates: Partial<QuestionInput>) => {
    setQuestions(questions.map(q => {
      if (q._tempId !== id) return q;

      const updated = { ...q, ...updates };
      // Handle type change logic (e.g. if switching from TEXT to MULTIPLE_CHOICE, initialize options)
      if (updates.type && updates.type !== q.type) {
        if (updates.type === QuestionType.MultipleChoice || updates.type === QuestionType.Checkbox) {
          updated.options = q.options?.length ? q.options : ['Option 1'];
        } else {
          updated.options = [];
        }
      }
      return updated;
    }));
  };

  const addOption = (questionId: string) => {
    setQuestions(questions.map(q => {
      if (q._tempId !== questionId) return q;
      return {
        ...q,
        options: [...(q.options || []), `Option ${(q.options?.length || 0) + 1}`]
      };
    }));
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    setQuestions(questions.map(q => {
      if (q._tempId !== questionId) return q;
      return {
        ...q,
        options: q.options?.filter((_, idx) => idx !== optionIndex)
      };
    }));
  };

  const updateOptionText = (questionId: string, optionIndex: number, text: string) => {
    setQuestions(questions.map(q => {
      if (q._tempId !== questionId) return q;
      const newOptions = [...(q.options || [])];
      newOptions[optionIndex] = text;
      return { ...q, options: newOptions };
    }));
  };

  // Helper to cleanly format state into GraphQL payload without UI-only _tempId
  const getMutationPayload = () => {
    return {
      title,
      description,
      questions: questions.map(({ _tempId, ...rest }) => rest),
    };
  };

  // Basic client-side validation
  const isValid = title.trim().length > 0 && questions.length > 0 && questions.every(q => {
    if (!q.text.trim()) return false;
    if ((q.type === QuestionType.MultipleChoice || q.type === QuestionType.Checkbox) && (!q.options || q.options.length === 0)) {
      return false;
    }
    return true;
  });

  return {
    title, setTitle,
    description, setDescription,
    questions,
    addQuestion, removeQuestion, updateQuestion,
    addOption, removeOption, updateOptionText,
    getMutationPayload, isValid
  };
}
