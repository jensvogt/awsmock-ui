export interface SnsTopicItem {
    topicArn: string | undefined;
    topicName: string | undefined;
    topicUrl: string | undefined;
    availableMessages: number | undefined;
    created: Date | undefined;
    modified: Date | undefined;
}

export interface ListTopicCountersResponse {
    Total: number;
    TopicCounters: SnsTopicItem[];
}