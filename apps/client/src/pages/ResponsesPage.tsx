import { useParams, Link } from 'react-router-dom';
import { useGetResponsesQuery, useGetFormQuery } from '../store/api/generated';
import { ArrowLeft, UserCircle } from 'lucide-react';

export function ResponsesPage() {
  const { id } = useParams<{ id: string }>();
  const { data: formData, isLoading: isFormLoading } = useGetFormQuery({ id: id! }, { skip: !id });
  const { data: responsesData, isLoading: isResLoading, error } = useGetResponsesQuery({ formId: id! }, { skip: !id, pollingInterval: 3000 });

  if (isFormLoading || isResLoading) return <div className="p-8 text-center text-gray-500">Loading responses...</div>;
  if (error || !formData?.form) return <div className="p-8 text-center text-red-500">Error loading responses</div>;

  const form = formData.form;
  const responses = responsesData?.responses || [];

  // Map question ID to its Question object for easy lookup
  const questionMap = form.questions.reduce((acc, q) => {
    acc[q.id] = q;
    return acc;
  }, {} as Record<string, any>);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/" className="text-google-purple flex items-center gap-1 hover:underline text-sm font-medium">
          <ArrowLeft size={16} /> Back to forms
        </Link>
      </div>

      <div className="bg-white rounded-lg p-6 google-shadow border-t-8 border-t-google-purple">
        <h1 className="text-2xl sm:text-3xl font-medium text-gray-800 mb-2">{form.title}</h1>
        <p className="text-gray-600 mb-6">{responses.length} response{responses.length !== 1 ? 's' : ''}</p>

        {responses.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            Waiting for responses...
          </div>
        ) : (
          <div className="space-y-6">
            {responses.map((res, index) => (
              <div key={res.id} className="border border-gray-200 rounded-lg overflow-hidden group hover:border-google-purple transition-colors">
                <div className="bg-gray-50 p-3 sm:p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2 group-hover:bg-[#f8f5fd]">
                  <div className="flex items-center gap-2 font-medium text-gray-700">
                    <UserCircle className="text-gray-400" />
                    Response {index + 1}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(res.submittedAt).toLocaleString()}
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  {res.answers.map((ans) => {
                    const q = questionMap[ans.questionId];
                    if (!q) return null; // Question might have been deleted

                    return (
                      <div key={ans.questionId}>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">{q.text}</h4>
                        <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded">
                          {ans.values.length === 0 ? (
                            <span className="text-gray-400 italic">No answer</span>
                          ) : (
                            ans.values.join(', ')
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
