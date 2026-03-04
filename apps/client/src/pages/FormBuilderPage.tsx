import { useNavigate } from 'react-router-dom';
import { Plus, X, Calendar, Trash2 } from 'lucide-react';
import { useFormBuilder } from '../hooks/useFormBuilder';
import { useCreateFormMutation } from '../store/api/generated';
import { QuestionType } from '../store/api/generated';

const typeLabels = {
  [QuestionType.Text]: 'Short Answer',
  [QuestionType.MultipleChoice]: 'Multiple Choice',
  [QuestionType.Checkbox]: 'Checkboxes',
  [QuestionType.Date]: 'Date',
};

export function FormBuilderPage() {
  const builder = useFormBuilder();
  const [createForm, { isLoading }] = useCreateFormMutation();
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!builder.isValid) return;
    try {
      await createForm({ input: builder.getMutationPayload() }).unwrap();
      navigate('/');
    } catch {
      // error handled below via isError if needed
    }
  };

  return (
    <div className="max-w-[770px] mx-auto space-y-4 pb-20 relative">
      {/* Top action bar */}
      <div className="sticky top-0 z-40 bg-google-bg/90 backdrop-blur pb-2 pt-4 flex justify-end">
        <button
          onClick={handleSave}
          disabled={!builder.isValid || isLoading}
          className="px-6 py-2 bg-google-purple text-white font-medium rounded hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-colors"
        >
          {isLoading ? 'Saving...' : 'Save Form'}
        </button>
      </div>

      {/* Form Header */}
      <div className="bg-white rounded-lg p-4 sm:px-6 sm:py-8 google-shadow border-t-8 border-t-google-purple">
        <input
          type="text"
          value={builder.title}
          onChange={(e) => builder.setTitle(e.target.value)}
          placeholder="Form title"
          className="w-full text-2xl sm:text-3xl font-medium text-gray-800 border-b border-transparent hover:border-gray-200 focus:border-google-purple focus:outline-none focus:ring-0 pb-2 transition-colors mb-4 placeholder-gray-500"
        />
        <textarea
          value={builder.description}
          onChange={(e) => builder.setDescription(e.target.value)}
          placeholder="Form description"
          className="w-full text-sm text-gray-600 border-b border-transparent hover:border-gray-200 focus:border-google-purple focus:outline-none focus:ring-0 pb-1 transition-colors resize-none placeholder-gray-500"
          rows={2}
        />
      </div>

      {/* Questions */}
      {builder.questions.map((q) => (
        <div key={q._tempId} className="bg-white rounded-lg p-4 sm:p-6 google-shadow border border-transparent hover:border-gray-200 transition-colors group relative">

          {/* Question Controls Row */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="text"
              value={q.text}
              onChange={(e) => builder.updateQuestion(q._tempId, { text: e.target.value })}
              placeholder="Question"
              className="flex-1 bg-gray-50 p-4 border-b-2 border-gray-300 focus:border-google-purple focus:bg-gray-100 focus:outline-none text-base"
            />

            <select
              value={q.type}
              onChange={(e) => builder.updateQuestion(q._tempId, { type: e.target.value as QuestionType })}
              className="md:w-56 p-3 border border-gray-300 rounded focus:border-google-purple focus:ring-1 focus:ring-google-purple outline-none bg-white font-medium text-gray-700"
            >
              {Object.values(QuestionType).map(t => (
                <option key={t} value={t}>{typeLabels[t]}</option>
              ))}
            </select>
          </div>

          {/* Question Body (Type specific UI) */}
          <div className="pl-0 sm:pl-4">
            {q.type === QuestionType.Text && (
              <div className="border-b border-gray-300 border-dotted w-full sm:w-1/2 pb-1 text-gray-400 text-sm">
                Short answer text
              </div>
            )}

            {q.type === QuestionType.Date && (
              <div className="border-b border-gray-300 border-dotted w-1/3 pb-1 text-gray-400 text-sm flex items-center gap-2">
                Month, day, year <Calendar size={16} />
              </div>
            )}

            {(q.type === QuestionType.MultipleChoice || q.type === QuestionType.Checkbox) && (
              <div className="space-y-3">
                {q.options?.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="text-gray-400">
                      {q.type === QuestionType.MultipleChoice ? <div className="w-4 h-4 rounded-full border-2 border-gray-400" /> : <div className="w-4 h-4 rounded-sm border-2 border-gray-400" />}
                    </div>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => builder.updateOptionText(q._tempId, idx, e.target.value)}
                      className="flex-1 border-b border-transparent hover:border-gray-200 focus:border-google-purple focus:outline-none py-1"
                    />
                    <button
                      onClick={() => builder.removeOption(q._tempId, idx)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                      disabled={(q.options?.length || 0) <= 1} // Don't delete last option
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}

                <div className="flex items-center gap-3">
                  <div className="text-gray-400">
                    {q.type === QuestionType.MultipleChoice ? <div className="w-4 h-4 rounded-full border-2 border-gray-400" /> : <div className="w-4 h-4 rounded-sm border-2 border-gray-400" />}
                  </div>
                  <button
                    onClick={() => builder.addOption(q._tempId)}
                    className="text-gray-500 hover:text-gray-800 text-sm font-medium border-b border-transparent py-1"
                  >
                    Add option
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 flex flex-wrap justify-end items-center gap-4">
            <button
              onClick={() => builder.removeQuestion(q._tempId)}
              className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Delete question"
            >
              <Trash2 size={20} />
            </button>
            <div className="w-px h-6 bg-gray-300" />
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              Required
              <input
                type="checkbox"
                checked={q.required}
                onChange={(e) => builder.updateQuestion(q._tempId, { required: e.target.checked })}
                className="w-4 h-4 text-google-purple focus:ring-google-purple pointer-events-auto"
              />
            </label>
          </div>
        </div>
      ))}

      {/* Floating Actions Sidebar (Desktop) or Bottom/Inline (Mobile) */}
      <div className="fixed bottom-6 right-6 md:absolute md:top-24 md:-right-16 md:bottom-auto bg-white p-2 rounded-lg google-shadow flex flex-col gap-2 z-10 w-fit">
        <button
          onClick={() => builder.addQuestion()}
          className="p-2 text-gray-600 hover:bg-gray-100 hover:text-google-purple rounded-full transition-colors"
          title="Add Question"
        >
          <Plus size={24} />
        </button>
      </div>

    </div>
  );
}
