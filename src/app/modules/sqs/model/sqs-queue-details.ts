export interface SqsQueueDetails {
    region: string;
    queueName: string;
    queueUrl: string;
    queueArn: string;
    retentionPeriod: number;
    maxMessageSize: number;
    size: number;
    visibilityTimeout: number;
    delay: number;
    messageCount: number;
    available: number;
    invisible: number;
    delayed: number;
    dlqArn: string;
    dlqMaxReceive: number;
    created: Date;
    modified: Date;
}
