export interface TopicItem {
    topicArn: string | undefined;
    topicName: string | undefined;
    topicUrl: string | undefined;
    availableMessages: number | undefined;
    created: Date | undefined;
    modified: Date | undefined;
}
