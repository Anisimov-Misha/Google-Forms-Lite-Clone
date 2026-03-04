import { Link } from 'react-router-dom';
import { useGetFormsQuery } from '../store/api/generated';
import { Plus, FileText, Users } from 'lucide-react';

export function HomePage() {
  const { data, isLoading, error } = useGetFormsQuery(undefined, { refetchOnMountOrArgChange: true });

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading forms...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error loading forms. Is the server running?</div>;
  }

  const forms = data?.forms || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-white p-4 sm:p-6 rounded-lg border border-purple-300/80 shadow-sm gap-4">
        <div>
          <h2 className="text-2xl font-normal text-gray-800">Recent Forms</h2>
          <p className="text-gray-500 text-sm mt-1">Manage all your forms and responses here.</p>
        </div>

        <Link
          to="/forms/new"
          className="flex items-center justify-center gap-2 bg-google-purple text-white px-5 py-3 sm:py-2.5 rounded-md hover:bg-purple-800 transition-colors font-medium shadow-sm w-full sm:w-auto"
        >
          <Plus size={20} />
          Create New Form
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {forms.length === 0 ? (
          <div className="col-span-full text-center p-12 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">No forms created yet. Click the button above to start.</p>
          </div>
        ) : (
          forms.map(form => (
            <div key={form.id} className="bg-white rounded-lg border border-purple-300/80 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-200 overflow-hidden flex flex-col h-full group cursor-pointer">
              <div className="h-32 bg-google-lightPurple flex items-center justify-center border-b border-gray-100 group-hover:bg-[#e4dcf1] transition-colors">
                <FileText size={48} className="text-google-purple opacity-50" />
              </div>
              <div className="p-4 flex-1">
                <h3 className="font-medium text-gray-800 truncate" title={form.title}>{form.title}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{form.description || 'No description'}</p>
                <div className="text-xs text-gray-400 mt-3">
                  Created: {new Date(form.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="p-3 bg-gray-50 border-t border-gray-100 flex gap-2 justify-between">
                <Link
                  to={`/forms/${form.id}/fill`}
                  className="text-sm text-google-purple font-medium hover:bg-purple-50 px-3 py-1.5 rounded transition-colors"
                >
                  Fill Out
                </Link>
                <Link
                  to={`/forms/${form.id}/responses`}
                  className="text-sm text-gray-600 font-medium hover:bg-gray-200 px-3 py-1.5 rounded transition-colors flex items-center gap-1"
                >
                  <Users size={16} /> Responses
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
