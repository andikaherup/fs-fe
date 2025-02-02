import 'reflect-metadata';
import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { PrismaClient } from '../prisma/generated/client'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { buildSchema } from 'type-graphql';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { MaintenanceResolver } from './resolver/MaintenanceResolver';
import cors from 'cors';
import { PubSub } from 'graphql-subscriptions';
import { UrgencyService } from './services/UrgencyServices';
import { Container } from 'typedi';



interface Context {
    req: Request;
    res: Response;
    prisma: PrismaClient;
    pubsub: PubSub;
}

async function bootstrap() {
    const app = express();
    const httpServer = createServer(app);

    const prisma = new PrismaClient()
    const pubsub = new PubSub();

    // Set up DI container
    Container.set(PrismaClient, prisma);
    Container.set(PubSub, pubsub);
    Container.set('PUBSUB_INSTANCE', pubsub);

    const urgencyService = new UrgencyService(prisma, pubsub);

    const schema = await buildSchema({
        resolvers: [MaintenanceResolver],
        validate: false,
        container: Container,
        pubSub: {
            publish: async (topic: string, payload: any) => {
                return pubsub.publish(topic, payload);
            },
            subscribe: (topic: string): AsyncIterable<unknown> => {
                return {
                    [Symbol.asyncIterator]: () => pubsub.asyncIterator(topic)
                };
            }
        }
    });

    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/graphql',
    });

    const serverCleanup = useServer({
        schema,
        context: () => ({ prisma, pubsub }),
    }, wsServer);

    const server = new ApolloServer<Context>({
        schema,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
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

    process.on('SIGINT', async () => {
        urgencyService.stop();
        await prisma.$disconnect();
        process.exit(0);
    });

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