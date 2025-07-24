import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { AppDataSource } from './data-source';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';
import { notificationQueue } from './queue/notificationQueue';
import * as dotenv from 'dotenv';
import { log } from 'console';

dotenv.config();

async function startServer() {
  await AppDataSource.initialize();
  console.log("Database connection initialized successfully!");
  

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: Number(process.env.PORT) || 4000 },
  });

  console.log(`🚀 Server ready at ${url}`);
}

startServer();
