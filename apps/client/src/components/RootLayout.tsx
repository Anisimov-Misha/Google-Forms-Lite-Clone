import { Outlet, Link } from 'react-router-dom';

export function RootLayout() {
  return (
    <div className="min-h-screen bg-google-bg font-sans">
      {/* Simple Header */}
      <header className="bg-white px-6 py-4 flex items-center shadow-sm border-b border-google-border sticky top-0 z-50">
        <Link to="/" className="text-xl font-medium text-google-text tracking-wide relative flex items-center gap-2 hover:opacity-80 transition-opacity">
          {/* Faux Icon */}
          <div className="w-6 h-6 rounded bg-google-purple flex items-center justify-center">
            <div className="w-3 h-1 bg-white rounded-sm mt-1 mx-1" />
          </div>
          Forms Lite
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[770px] mx-auto p-4 sm:p-6 pb-20">
        <Outlet />
      </main>
    </div>
  );
}
