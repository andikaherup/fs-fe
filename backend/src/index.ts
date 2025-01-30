import 'reflect-metadata';
import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { buildSchema } from 'type-graphql';
import { PrismaClient } from '@prisma/client';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { MaintenanceResolver } from './resolver/MaintenanceResolver';
import cors from 'cors';
import { PubSub } from 'graphql-subscriptions';

interface Context {
    req: Request;
    res: Response;
    prisma: PrismaClient;
    pubsub: PubSub;
}

async function bootstrap() {
    const app = express();
    const httpServer = createServer(app);

    const prisma = new PrismaClient();
    const pubsub = new PubSub();

    const schema = await buildSchema({
        resolvers: [MaintenanceResolver],
        validate: false,
    });

    // Create WebSocket server
    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/graphql',
    });

    // WebSocket server cleanup
    const serverCleanup = useServer({
        schema,
        context: () => ({ prisma, pubsub }),
    }, wsServer);

    const server = new ApolloServer<Context>({
        schema,
        plugins: [
            // Proper shutdown for the HTTP server.
            ApolloServerPluginDrainHttpServer({ httpServer }),
            // Proper shutdown for the WebSocket server.
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

    app.use(
        '/graphql',
        cors<cors.CorsRequest>(),
        express.json(),
        expressMiddleware(server, {
            context: async ({ req, res }) => ({
                req,
                res,
                prisma,
                pubsub,
            }),
        }),
    );

    const PORT = process.env.PORT || 4000;
    httpServer.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}/graphql`);
        console.log(`WebSocket server is running at ws://localhost:${PORT}/graphql`);
    });
}

bootstrap().catch((err) => {
    console.error('Error starting server:', err);
    process.exit(1);
});