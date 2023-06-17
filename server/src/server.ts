import { ApolloServer } from 'apollo-server';
import path from 'node:path';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { BooksResolvers } from './resolvers/books-resolver';
import { UsersResolvers } from './resolvers/users-resolvers';

// Custom context type
export interface MyContext {
  usersResolver: UsersResolvers;
  booksResolver: BooksResolvers;
  // Add any additional context properties you need
}

async function bootstrap() {
  const usersResolver = new UsersResolvers();
  const booksResolver = new BooksResolvers();

  const schema = await buildSchema({
    resolvers: [
      BooksResolvers,
      UsersResolvers
    ],
    emitSchemaFile: path.resolve(__dirname, 'schema.gql')
  });

  const server = new ApolloServer({
    schema,
    context: (): MyContext => ({
      usersResolver,
      booksResolver
    }),
  });
  
  const { url } = await server.listen();
  console.log(`🚀  Server ready at: ${ url }`);
}

bootstrap();

