import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './packages/shared/schema.graphql',
  documents: ['apps/client/src/graphql/**/*.graphql'],
  generates: {
    'packages/shared/src/generated.ts': {
      plugins: ['typescript'],
      config: {
        enumsAsTypes: true,
      }
    },
    'apps/client/src/store/api/generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-rtk-query'
      ],
      config: {
        importBaseApiFrom: './baseApi',
        importBaseApiAlternateName: 'api',
        exportHooks: true,
        overrideExisting: true,
        queries: {
          GetForms: {
            providesTags: [{ type: 'Form', id: 'LIST' }],
          },
          GetForm: {
            providesTags: ['Form'],
          },
          GetResponses: {
            providesTags: [{ type: 'Response', id: 'LIST' }],
          },
        },
        mutations: {
          CreateForm: {
            invalidatesTags: [{ type: 'Form', id: 'LIST' }],
          },
          SubmitResponse: {
            invalidatesTags: [{ type: 'Response', id: 'LIST' }],
          },
        },
      }
    }
  }
};

export default config;
