export interface QueueItem {
    queueUrl: string | undefined;
    queueArn: string | undefined;
    queueName: string | undefined;
    messagesAvailable: number | undefined;
    messagesInFlight: number | undefined;
    messagesDelayed: number | undefined;
}
