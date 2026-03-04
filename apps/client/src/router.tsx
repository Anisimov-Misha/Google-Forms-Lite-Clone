import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './components/RootLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        lazy: async () => {
          const { HomePage } = await import('./pages/HomePage');
          return { Component: HomePage };
        },
      },
      {
        path: 'forms/new',
        lazy: async () => {
          const { FormBuilderPage } = await import('./pages/FormBuilderPage');
          return { Component: FormBuilderPage };
        },
      },
      {
        path: 'forms/:id/fill',
        lazy: async () => {
          const { FormFillerPage } = await import('./pages/FormFillerPage');
          return { Component: FormFillerPage };
        },
      },
      {
        path: 'forms/:id/responses',
        lazy: async () => {
          const { ResponsesPage } = await import('./pages/ResponsesPage');
          return { Component: ResponsesPage };
        },
      },
    ],
  },
]);
