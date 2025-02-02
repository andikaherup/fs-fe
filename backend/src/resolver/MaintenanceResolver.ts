import { Resolver, Query, Mutation, Arg, Ctx, Subscription, Root } from 'type-graphql';
import { MaintenanceRequest, Metrics, CreateMaintenanceInput, UpdateMaintenanceInput, RequestType } from '../models/types';
import { PrismaClient } from "../../prisma/generated/client";
import { PubSub } from 'graphql-subscriptions';
import { Service, Inject } from 'typedi';



interface Context {
    prisma: PrismaClient;
    pubsub: PubSub;
}

@Service()
@Resolver(MaintenanceRequest)
export class MaintenanceResolver {

    @Query(() => [MaintenanceRequest])
    async maintenanceRequests(@Ctx() { prisma }: Context) {
        return await prisma.maintenanceRequest.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }

    @Query(() => Metrics)
    async metrics(@Ctx() { prisma }: Context): Promise<Metrics> {
        const requests = await prisma.maintenanceRequest.findMany();

        const openRequests = requests.filter((r: RequestType) => r.status === 'OPEN').length;
        const urgentRequests = requests.filter((r: RequestType) =>
            r.status === 'OPEN' &&
            (r.urgency === 'URGENT' || r.urgency === 'EMERGENCY')
        ).length;

        const resolvedRequests = requests.filter((r: RequestType) => r.resolvedAt);
        const totalTime = resolvedRequests.reduce((acc: number, req: RequestType) => {
            const resolvedTime = new Date(req.resolvedAt!).getTime();
            const createdTime = new Date(req.createdAt).getTime();
            return acc + (resolvedTime - createdTime);
        }, 0);

        const averageResolutionTime = resolvedRequests.length
            ? totalTime / resolvedRequests.length / (1000 * 60 * 60)
            : 0;

        return {
            openRequests,
            urgentRequests,
            averageResolutionTime
        };
    }

    @Mutation(() => MaintenanceRequest)
    async createRequest(
        @Arg('input') input: CreateMaintenanceInput,
        @Ctx() { prisma, pubsub }: Context
    ) {
        const newRequest = await prisma.maintenanceRequest.create({
            data: {
                title: input.title,
                description: input.description,
                urgency: input.urgency || 'NONE_URGENT',
                status: input.status || 'OPEN'
            }
        });

        await pubsub.publish('MAINTENANCE_UPDATED', { maintenanceUpdated: newRequest });

        return newRequest;
    }

    @Mutation(() => MaintenanceRequest)
    async resolveRequest(
        @Arg('id') id: string,
        @Ctx() { prisma, pubsub }: Context
    ) {
        const updatedRequest = await prisma.maintenanceRequest.update({
            where: { id },
            data: {
                status: "RESOLVED",
                resolvedAt: new Date()
            }
        });

        await pubsub.publish('MAINTENANCE_UPDATED', { maintenanceUpdated: updatedRequest });

        return updatedRequest;
    }

    @Mutation(() => MaintenanceRequest)
    async updateRequest(
        @Arg('id') id: string,
        @Arg('input') input: UpdateMaintenanceInput,
        @Ctx() { prisma }: Context
    ): Promise<MaintenanceRequest> {
        const data: any = {
            title: input.title,
            description: input.description,
            urgency: input.urgency,
            status: input.status
        };

        // If changing back to OPEN, clear the resolvedAt date
        if (input.status === 'OPEN') {
            data.resolvedAt = null;
        }
        // If changing to RESOLVED, set the resolvedAt date
        else if (input.status === 'RESOLVED') {
            data.resolvedAt = new Date();
        }

        return prisma.maintenanceRequest.update({
            where: { id },
            data
        });
    }
}