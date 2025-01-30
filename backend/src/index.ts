import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { PrismaClient } from '@prisma/client';
import { MaintenanceResolver } from './resolver/MaintenanceResolver';

async function main() {
    const app = express();
    const prisma = new PrismaClient();

    const schema = await buildSchema({
        resolvers: [MaintenanceResolver],
        validate: false,
    });

    const server = new ApolloServer({
        schema,
        context: { prisma }
    });

    await server.start();
    server.applyMiddleware({ app });

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    });
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});