import { join } from 'path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ResolversModule } from './resolvers/resolvers.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), '../../packages/shared/schema.graphql'),
      sortSchema: true,
      playground: true, // Enable GraphQL Playground
    }),
    ResolversModule,
  ],
})
export class AppModule { }
