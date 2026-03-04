import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetFormQuery, useSubmitResponseMutation, QuestionType } from '../store/api/generated';
import { useFormFiller } from '../hooks/useFormFiller';
import { CheckCircle } from 'lucide-react';

export function FormFillerPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useGetFormQuery({ id: id! }, { skip: !id });
  const [submitResponse, { isLoading: isSubmitting, isSuccess }] = useSubmitResponseMutation();
  const [submitted, setSubmitted] = useState(false);

  const form = data?.form;
  const { answers, setAnswer, getAnswersPayload, validateRequired, clearForm } = useFormFiller(form?.questions || []);
  const [validationFailed, setValidationFailed] = useState(false);

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading form...</div>;
  if (error || !form) return <div className="p-8 text-center text-red-500">Form not found or error loading</div>;

  if (submitted || isSuccess) {
    return (
      <div className="max-w-[770px] mx-auto bg-white rounded-lg p-8 google-shadow border-t-8 border-t-google-purple text-center">
        <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
        <h2 className="text-2xl font-normal text-gray-800 mb-2">Response submitted</h2>
        <p className="text-gray-600 mb-6">Your response to "{form.title}" has been recorded.</p>
        <Link to="/" className="text-google-purple hover:underline font-medium">Return to Home</Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRequired()) {
      setValidationFailed(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    await submitResponse({
      input: {
        formId: form.id,
        answers: getAnswersPayload()
      }
    });
    setSubmitted(true);
  };

  const handleClear = () => {
    const confirm = window.confirm('Are you sure you want to clear this form? This will remove all your answers.');
    if (confirm) {
      clearForm();
      setValidationFailed(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-[770px] mx-auto space-y-4">
      <div className="bg-white rounded-lg p-4 sm:px-6 sm:py-8 google-shadow border-t-8 border-t-google-purple">
        <h1 className="text-2xl sm:text-3xl font-medium text-gray-800 mb-4">{form.title}</h1>
        {form.description && <p className="text-gray-600 mb-4 whitespace-pre-wrap">{form.description}</p>}
        {validationFailed && (
          <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded text-sm font-medium">
            Please fill out all required fields.
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 pb-12">
        {form.questions.map((q) => {
          const isRequired = q.required;
          const currentAns = answers[q.id] || [];

          return (
            <div key={q.id} className={`bg-white rounded-lg p-6 google-shadow border ${validationFailed && isRequired && currentAns.length === 0 ? 'border-red-400' : 'border-transparent'} transition-colors`}>
              <div className="flex gap-1 mb-4">
                <h3 className="text-base text-gray-800 font-medium">{q.text}</h3>
                {isRequired && <span className="text-red-500">*</span>}
              </div>

              {q.type === QuestionType.Text && (
                <input
                  type="text"
                  placeholder="Your answer"
                  value={currentAns[0] || ''}
                  onChange={(e) => setAnswer(q.id, [e.target.value])}
                  className="w-full sm:w-1/2 border-b border-gray-300 hover:border-gray-500 focus:border-google-purple focus:outline-none focus:ring-0 pb-1 font-normal text-sm bg-transparent transition-colors"
                />
              )}

              {q.type === QuestionType.Date && (
                <input
                  type="date"
                  value={currentAns[0] || ''}
                  onChange={(e) => setAnswer(q.id, [e.target.value])}
                  className="border-b border-gray-300 hover:border-gray-500 focus:border-google-purple focus:outline-none pb-1 font-normal text-sm bg-transparent cursor-pointer"
                />
              )}

              {q.type === QuestionType.MultipleChoice && (
                <div className="space-y-3">
                  {q.options?.map((opt, idx) => (
                    <label key={idx} className="flex items-center gap-3 cursor-pointer group w-max">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${currentAns[0] === opt ? 'border-google-purple' : 'border-gray-400 group-hover:border-gray-600'}`}>
                        {currentAns[0] === opt && <div className="w-2.5 h-2.5 bg-google-purple rounded-full" />}
                      </div>
                      <input
                        type="radio"
                        name={q.id}
                        value={opt}
                        checked={currentAns[0] === opt}
                        onChange={() => setAnswer(q.id, [opt])}
                        className="sr-only"
                      />
                      <span className="text-gray-700">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.type === QuestionType.Checkbox && (
                <div className="space-y-3">
                  {q.options?.map((opt, idx) => {
                    const isChecked = currentAns.includes(opt);
                    return (
                      <label key={idx} className="flex items-center gap-3 cursor-pointer group w-max">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isChecked ? 'bg-google-purple border-google-purple' : 'border-gray-400 group-hover:border-gray-600'}`}>
                          {isChecked && <CheckCircle size={14} className="text-white" strokeWidth={3} />}
                        </div>
                        <input
                          type="checkbox"
                          value={opt}
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) setAnswer(q.id, [...currentAns, opt]);
                            else setAnswer(q.id, currentAns.filter(v => v !== opt));
                          }}
                          className="sr-only"
                        />
                        <span className="text-gray-700">{opt}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-google-purple text-white font-medium rounded hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-google-purple disabled:opacity-50 shadow-sm transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 p-3 sm:px-4 sm:py-2 rounded hover:bg-red-100 transition-colors w-full sm:w-auto mt-2 sm:mt-0"
          >
            Clear form
          </button>
        </div>
      </form>
    </div>
  );
}
