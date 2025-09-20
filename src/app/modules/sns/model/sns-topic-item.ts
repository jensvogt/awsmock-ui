export interface SnsTopicItem {
    topicArn: string | undefined;
    topicName: string | undefined;
    messages: number | undefined;
    messagesSend: number | undefined;
    messagesResend: number | undefined;
    size: number | undefined;
    created: Date | undefined;
    modified: Date | undefined;
}

export interface ListTopicCountersResponse {
    total: number;
    topicCounters: SnsTopicItem[];
}