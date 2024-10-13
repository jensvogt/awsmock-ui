export interface SnsMessageItem {
    id: string | undefined;
    region: string | undefined
    topicArn: string | undefined
    messageId: string | undefined;
    message: string | undefined;
    created: Date | undefined;
    modified: Date | undefined;
}
