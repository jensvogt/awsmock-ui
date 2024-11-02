export interface SnsTopicDetails {
    region: string;
    topicArn: string;
    topicName: string;
    topicUrl: string;
    owner: string;
    messageCount: number;
    size: number;
    created: Date;
    modified: Date;
}
