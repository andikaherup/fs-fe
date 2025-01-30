import { ObjectType, Field, ID, registerEnumType } from 'type-graphql';

export enum Status {
    OPEN = 'OPEN',
    RESOLVED = 'RESOLVED'
}

export enum Urgency {
    NONE_URGENT = 'NONE_URGENT',
    LESS_URGENT = 'LESS_URGENT',
    URGENT = 'URGENT',
    EMERGENCY = 'EMERGENCY'
}

registerEnumType(Status, {
    name: 'Status',
    description: 'Request status',
});

registerEnumType(Urgency, {
    name: 'Urgency',
    description: 'Request urgency level',
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
    resolvedAt?: Date;

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