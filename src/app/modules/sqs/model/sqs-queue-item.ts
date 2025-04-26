export interface SqsQueueItem {
    queueUrl: string | undefined;
    queueArn: string | undefined;
    queueName: string | undefined;
    isDlq: boolean | undefined;
    messagesAvailable: number | undefined;
    messagesInFlight: number | undefined;
    messagesDelayed: number | undefined;
    created: Date | undefined;
    modified: Date | undefined;
}

export interface ListQueueCountersResponse {
    total: number;
    queueCounters: SqsQueueItem[];
}