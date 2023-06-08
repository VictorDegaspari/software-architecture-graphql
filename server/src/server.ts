import { ApolloServer } from 'apollo-server';
import path from 'node:path';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { BooksResolvers } from './resolvers/books-resolvers';
import { UsersResolvers } from './resolvers/users-resolvers';

async function bootstrap() {
  const schema = await buildSchema({
    resolvers: [
      BooksResolvers,
      UsersResolvers
    ],
    emitSchemaFile: path.resolve(__dirname, 'schema.gql')
  });

  const server = new ApolloServer({
    schema
  });
  
  const { url } = await server.listen();
  console.log(`🚀  Server ready at: ${ url }`);
}

bootstrap();

