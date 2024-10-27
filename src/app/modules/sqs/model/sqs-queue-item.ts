export interface SqsQueueItem {
    queueUrl: string | undefined;
    queueArn: string | undefined;
    queueName: string | undefined;
    messagesAvailable: number | undefined;
    messagesInFlight: number | undefined;
    messagesDelayed: number | undefined;
}

export interface ListQueueCountersResponse {
    Total: number;
    QueueCounters: SqsQueueItem[];
}