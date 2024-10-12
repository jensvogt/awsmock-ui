export interface QueueDetails {
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
    created: Date;
    modified: Date;
}
