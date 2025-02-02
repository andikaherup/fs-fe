import { ObjectType, Field, ID, registerEnumType, InputType } from 'type-graphql';



export interface RequestType {
    id: string;
    title: string;
    description: string;
    status: StatusType;
    urgency: UrgencyType;
    createdAt: Date;
    resolvedAt: Date | null;
    updatedAt: Date;
}

type StatusType = 'OPEN' | 'RESOLVED';
type UrgencyType = 'NONE_URGENT' | 'LESS_URGENT' | 'URGENT' | 'EMERGENCY';




@ObjectType()
export class MaintenanceRequest {
    @Field(() => ID)
    id!: string;

    @Field()
    title!: string;

    @Field()
    description!: string;

    @Field()
    status!: StatusType;

    @Field()
    urgency!: UrgencyType;

    @Field()
    createdAt!: Date;

    @Field(() => Date, { nullable: true })
    resolvedAt?: Date | null;

    @Field()
    updatedAt!: Date;
}

@InputType()
export class UpdateMaintenanceInput {
    @Field()
    title!: string;

    @Field()
    description!: string;

    @Field()
    status!: StatusType;

    @Field()
    urgency!: UrgencyType;
}

@InputType()
export class CreateMaintenanceInput {
    @Field()
    title!: string;

    @Field()
    description!: string;

    @Field()
    status!: StatusType;

    @Field()
    urgency!: UrgencyType;
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