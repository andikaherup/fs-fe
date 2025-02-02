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

export interface MaintenanceRequest {
    id: string;
    title: string;
    description: string;
    status: Status;
    urgency: Urgency;
    createdAt: string;
    resolvedAt?: string;
    updatedAt: string;
}

export interface Metrics {
    openRequests: number;
    averageResolutionTime: number;
    urgentRequests: number;
}

export interface Request {
    id?: string;
    title: string;
    description: string;
    urgency: string;
    status: string;
}