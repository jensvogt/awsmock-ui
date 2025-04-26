export interface SnsMessageAttribute {
    Key: string,
    Value: string,
    DataType: string
}

export interface SnsMessageItem {
    id: string | undefined;
    region: string | undefined
    topicArn: string | undefined
    targetArn: string | undefined
    messageId: string | undefined;
    message: string | undefined;
    size: number;
    messageStatus: string | undefined;
    lastSend: Date | undefined;
    created: Date | undefined;
    modified: Date | undefined;
    messageAttributes: SnsMessageAttribute[];
}

export interface SnsMessageCountersResponse {
    total: number;
    messages: SnsMessageItem[];
}