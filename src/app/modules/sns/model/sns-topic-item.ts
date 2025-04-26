export interface SnsTopicItem {
    topicArn: string | undefined;
    topicName: string | undefined;
    availableMessages: number | undefined;
    size: number | undefined;
    created: Date | undefined;
    modified: Date | undefined;
}

export interface ListTopicCountersResponse {
    total: number;
    topicCounters: SnsTopicItem[];
}