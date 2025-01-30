import 'reflect-metadata';
import express from 'express';
import { createServer } from 'http';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { PrismaClient } from '@prisma/client';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { MaintenanceResolver } from './resolver/MaintenanceResolver';
import cors from 'cors';
import { PubSub as GraphQLPubSub } from 'graphql-subscriptions';

async function bootstrap() {
    const app = express();
    app.use(cors());

    const prisma = new PrismaClient();
    const pubSub = new GraphQLPubSub();

    const schema = await buildSchema({
        resolvers: [MaintenanceResolver],
        validate: false,
    });

    // Create HTTP server
    const httpServer = createServer(app);

    // Create WebSocket server
    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/graphql',
    });

    // Set up WebSocket server
    const serverCleanup = useServer(
        {
            schema,
            context: () => ({ prisma, pubSub }),
        },
        wsServer
    );

    const server = new ApolloServer({
        schema,
        context: ({ req, res }) => ({ req, res, prisma, pubSub }),
        plugins: [
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ],
    });

    await server.start();
    server.applyMiddleware({ app });

    const PORT = process.env.PORT || 4000;
    httpServer.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}${server.graphqlPath}`);
        console.log(`WebSocket server is running at ws://localhost:${PORT}${server.graphqlPath}`);
    });
}

bootstrap().catch(console.error);