import { ObjectType, Field, ID, registerEnumType } from 'type-graphql';
import { Prisma, Status, Urgency } from '@prisma/client';

registerEnumType(Status, {
    name: 'Status',
    description: 'The status of a maintenance request',
});

registerEnumType(Urgency, {
    name: 'Urgency',
    description: 'The urgency level of a maintenance request',
});

@ObjectType()
export class MaintenanceRequest implements Prisma.MaintenanceRequestUncheckedCreateInput {
    @Field(() => ID)
    id!: string;

    @Field()
    title!: string;

    @Field()
    description!: string;

    @Field(() => String)
    status!: Status;

    @Field(() => String)
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