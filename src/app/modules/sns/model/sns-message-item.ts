export interface SnsMessageItem {
    id: string | undefined;
    region: string | undefined
    topicArn: string | undefined
    targetArn: string | undefined
    messageId: string | undefined;
    message: string | undefined;
    status: string | undefined;
    lastSend: Date | undefined;
    created: Date | undefined;
    modified: Date | undefined;
}

export interface SnsMessageCountersResponse {
    total: number;
    messageCounters: SnsMessageItem[];
}