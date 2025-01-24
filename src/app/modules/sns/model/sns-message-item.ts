export interface SnsMessageAttribute {
    Key: string,
    Value: string,
    DataType: string
}

export interface SnsMessageItem {
    Id: string | undefined;
    Region: string | undefined
    TopicArn: string | undefined
    TargetArn: string | undefined
    MessageId: string | undefined;
    Message: string | undefined;
    Status: string | undefined;
    LastSend: Date | undefined;
    Created: Date | undefined;
    Modified: Date | undefined;
    messageAttributes: SnsMessageAttribute[];
}

export interface SnsMessageCountersResponse {
    Total: number;
    Messages: SnsMessageItem[];
}