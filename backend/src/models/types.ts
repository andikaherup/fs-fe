import { ObjectType, Field, ID, registerEnumType, InputType } from 'type-graphql';
import { Status, Urgency } from '@prisma/client';

// Register the enums for GraphQL
registerEnumType(Status, {
    name: 'Status',
    description: 'The status of a maintenance request',
});

registerEnumType(Urgency, {
    name: 'Urgency',
    description: 'The urgency level of a maintenance request',
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

@InputType()
export class CreateMaintenanceInput {
    @Field()
    title!: string;

    @Field()
    description!: string;

    @Field(() => Urgency)
    urgency!: Urgency;
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