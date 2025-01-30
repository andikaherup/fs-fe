import { ObjectType, Field, ID, registerEnumType } from 'type-graphql';
import { Status, Urgency } from '@prisma/client';

// Register Prisma's enums for GraphQL
registerEnumType(Status, {
    name: 'Status',
    description: 'Status of the maintenance request',
});

registerEnumType(Urgency, {
    name: 'Urgency',
    description: 'Urgency level of the maintenance request',
});

@ObjectType()
export class MaintenanceRequest {
    @Field(() => ID)
    id!: string;

    @Field()
    title!: string;

    @Field()
    description!: string;

    @Field(() => Status)
    status!: Status;

    @Field(() => Urgency)
    urgency!: Urgency;

    @Field()
    createdAt!: Date;

    @Field(() => Date, { nullable: true })
    resolvedAt?: Date | null;

    @Field()
    updatedAt!: Date;
}

@ObjectType()
export class Metrics {
    @Field()
    openRequests!: number;

    @Field()
    averageResolutionTime!: number;

    @Field()
    urgentRequests!: number;
}