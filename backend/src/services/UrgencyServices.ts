import { PrismaClient } from '../../prisma/generated/client';

import { PubSub } from 'graphql-subscriptions';

export class UrgencyService {
    private checkInterval: NodeJS.Timeout;

    constructor(
        private prisma: PrismaClient,
        private pubsub: PubSub
    ) {
        // Check every minute for changes
        this.checkInterval = setInterval(() => {
            console.log("checking,,,")
            this.checkUrgencies();
        }, 1000 * 60); // Every minute
    }

    private async checkUrgencies() {
        try {
            const requests = await this.prisma.maintenanceRequest.findMany({
                where: { status: 'OPEN' }
            });

            for (const request of requests) {
                const hoursSinceCreation = this.getHoursSinceCreation(request.createdAt);
                let shouldUpdate = false;
                let newUrgency = request.urgency;

                // Check Less Urgent -> Urgent (3 days = 72 hours)
                if (request.urgency === 'LESS_URGENT' && hoursSinceCreation >= 72) {
                    newUrgency = 'URGENT';
                    shouldUpdate = true;
                }
                // Check Urgent -> Emergency (6 hours)
                else if (request.urgency === 'URGENT' && hoursSinceCreation >= 6) {
                    newUrgency = 'EMERGENCY';
                    shouldUpdate = true;
                }

                // Update if needed
                if (shouldUpdate) {
                    const updatedRequest = await this.prisma.maintenanceRequest.update({
                        where: { id: request.id },
                        data: { urgency: newUrgency }
                    });

                    // Publish update to all clients
                    await this.pubsub.publish('MAINTENANCE_UPDATED', {
                        maintenanceUpdated: updatedRequest
                    });
                }
            }
        } catch (error) {
            console.error('Error checking urgencies:', error);
        }
    }

    private getHoursSinceCreation(createdAt: Date): number {
        const now = new Date().getTime();
        const created = new Date(createdAt).getTime();
        return (now - created) / (1000 * 60 * 60);
    }

    public stop() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
        }
    }
}