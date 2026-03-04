# Google Forms Lite Clone

A simplified clone of Google Forms built as a full-stack monorepo using React, Redux Toolkit, Tailwind CSS, NestJS, and GraphQL.

## Overview

- **Front-end (`apps/client`)**: Vite, React 18, TypeScript, Tailwind CSS v3, Redux Toolkit (RTK Query), React Router v6.
- **Back-end (`apps/server`)**: NestJS, GraphQL (Code-first approach), Apollo Server, In-memory store (no database required).
- **Shared (`packages/shared`)**: Automatically generated TypeScript types and RTK Query hooks driven by the GraphQL schema.
- **Monorepo**: Powered by `pnpm workspaces` and `Turborepo`.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) (v8+ recommended)

## Setup & Running Locally

1. **Install dependencies:**
   From the root of the repository, run:
   ```bash
   pnpm install
   ```

2. **Generate GraphQL Types & Hooks:**
   The server needs to be built first to emit the GraphQL schema, and then codegen uses that schema to generate types for the client.
   ```bash
   # Build the NestJS server (emits shared/schema.graphql)
   pnpm --filter @gf/server build
   
   # Run the codegen to create TypeScript types and RTK hooks
   pnpm codegen
   ```

3. **Start the Development Servers:**
   Run both the client and server concurrently:
   ```bash
   pnpm dev
   ```

   - **Client App:** [http://localhost:5173](http://localhost:5173)
   - **GraphQL Server & Playground:** [http://localhost:3000/graphql](http://localhost:3000/graphql)

## Architecture Decisions

- **Why NestJS (Code-First) over Express?**
  The prompt required sharing types between the client and server without `any`. NestJS's "Code-First" approach allows defining a single source of truth (TypeScript classes with decorators). The SDL (`schema.graphql`) is auto-generated and serves as the input for client-side code generation.
  
- **Why RTK Query Codegen?**
  Writing manual fetch logic in React components usually leads to bloated code and `any` types. Using `@graphql-codegen/typescript-rtk-query`, the client automatically gets fully-typed React hooks (e.g., `useGetFormsQuery`, `useCreateFormMutation`) directly from `.graphql` operation files.

- **Zero TS in UI Components:**
  As requested, complex business logic for form building and filling has been securely extracted into custom hooks (`useFormBuilder.ts`, `useFormFiller.ts`). The UI components (e.g., `FormBuilderPage.tsx`, `FormFillerPage.tsx`) remain strictly focused on presentation and rendering.
