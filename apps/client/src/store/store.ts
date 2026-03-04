import { configureStore } from '@reduxjs/toolkit';
import { api } from './api/baseApi';
import { api as generatedApi } from './api/generated';

generatedApi.enhanceEndpoints({
  addTagTypes: ['Form', 'Response'],
  endpoints: {
    GetForms: {
      providesTags: ['Form'],
    },
    GetForm: {
      providesTags: (_result, _error, arg) => [{ type: 'Form', id: arg.id }],
    },
    CreateForm: {
      invalidatesTags: ['Form'],
    },
    GetResponses: {
      providesTags: (_result, _error, arg) => [{ type: 'Response', id: arg.formId }],
    },
    SubmitResponse: {
      invalidatesTags: (_result, _error, arg) => [{ type: 'Response', id: arg.input.formId }],
    }
  }
});

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
