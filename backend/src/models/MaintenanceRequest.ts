import { Resolver, Query, Mutation, Arg, Ctx } from 'type-graphql';
import { PrismaClient, Status, Urgency } from '@prisma/client';
import { MaintenanceRequest, Metrics } from './types';

type Context = {
    prisma: PrismaClient;
};

interface RequestType {
    id: string;
    title: string;
    description: string;
    status: 'OPEN' | 'RESOLVED';
    urgency: 'NONE_URGENT' | 'LESS_URGENT' | 'URGENT' | 'EMERGENCY';
    createdAt: Date;
    resolvedAt: Date | null;
    updatedAt: Date;
}

@Resolver()
export class MaintenanceResolver {
    @Query(() => [MaintenanceRequest])
    async maintenanceRequests(
        @Ctx() { prisma }: Context
    ): Promise<MaintenanceRequest[]> {
        return prisma.maintenanceRequest.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }

    @Query(() => Metrics)
    async metrics(@Ctx() { prisma }: Context): Promise<Metrics> {
        const requests: RequestType[] = await prisma.maintenanceRequest.findMany();

        const openRequests = requests.filter((r: RequestType) => r.status === 'OPEN').length;
        const urgentRequests = requests.filter((r: RequestType) =>
            r.status === 'OPEN' &&
            (r.urgency === 'URGENT' || r.urgency === 'EMERGENCY')
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
                urgency: urgency as any
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
                status: 'RESOLVED',
                resolvedAt: new Date()
            }
        });
    }

    @Mutation(() => MaintenanceRequest)
    async updateRequest(
        @Arg('id') id: string,
        @Arg('title') title: string,
        @Arg('description') description: string,
        @Arg('urgency', () => Urgency) urgency: Urgency,
        @Arg('status', () => Status) status: Status,
        @Ctx() { prisma }: Context
    ): Promise<MaintenanceRequest> {
        const data: any = {
            title,
            description,
            urgency,
            status
        };

        // If changing back to OPEN, clear the resolvedAt date
        if (status === 'OPEN') {
            data.resolvedAt = null;
        }
        // If changing to RESOLVED, set the resolvedAt date
        else if (status === 'RESOLVED') {
            data.resolvedAt = new Date();
        }

        return prisma.maintenanceRequest.update({
            where: { id },
            data
        });
    }
}