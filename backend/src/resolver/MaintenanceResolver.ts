import { Resolver, Query, Mutation, Arg, Ctx } from 'type-graphql';
import { MaintenanceRequest, Metrics, Status, Urgency } from './types';
import { PrismaClient } from '@prisma/client';

type Context = {
    prisma: PrismaClient;
};

interface RequestType {
    id: string;
    title: string;
    description: string;
    status: Status;
    urgency: Urgency;
    createdAt: Date;
    resolvedAt: Date | null;
    updatedAt: Date;
}

@Resolver()
export class MaintenanceResolver {
    @Query(() => Metrics)
    async metrics(@Ctx() { prisma }: Context): Promise<Metrics> {
        const requests: RequestType[] = await prisma.maintenanceRequest.findMany();

        const openRequests = requests.filter((r: RequestType) => r.status === Status.OPEN).length;
        const urgentRequests = requests.filter((r: RequestType) =>
            r.status === Status.OPEN &&
            (r.urgency === Urgency.URGENT || r.urgency === Urgency.EMERGENCY)
        ).length;

        const resolvedRequests = requests.filter((r: RequestType) => r.resolvedAt);
        const totalTime: number = resolvedRequests.reduce((acc: number, req: RequestType) => {
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

    @Query(() => [MaintenanceRequest])
    async maintenanceRequests(
        @Ctx() { prisma }: Context
    ): Promise<MaintenanceRequest[]> {
        return prisma.maintenanceRequest.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }

    @Mutation(() => MaintenanceRequest)
    async createRequest(
        @Arg('title') title: string,
        @Arg('description') description: string,
        @Arg('urgency', () => Urgency) urgency: Urgency,
        @Ctx() { prisma }: Context
    ): Promise<MaintenanceRequest> {
        return prisma.maintenanceRequest.create({
            data: {
                title,
                description,
                urgency
            }
        });
    }

    @Mutation(() => MaintenanceRequest)
    async resolveRequest(
        @Arg('id') id: string,
        @Ctx() { prisma }: Context
    ): Promise<MaintenanceRequest> {
        return prisma.maintenanceRequest.update({
            where: { id },
            data: {
                status: Status.RESOLVED,
                resolvedAt: new Date()
            }
        });
    }
}