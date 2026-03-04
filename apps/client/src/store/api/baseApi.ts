import { createApi } from '@reduxjs/toolkit/query/react';
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: graphqlRequestBaseQuery({
        url: import.meta.env.VITE_API_URL || 'http://localhost:3000/graphql',
  }),
  tagTypes: ['Form', 'Response'],
  endpoints: () => ({}),
});
