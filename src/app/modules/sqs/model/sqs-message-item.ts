export interface SqsMessageAttribute {
    name: string,
    stringValue: string,
    stringListValues: string[],
    dataType: string
}

export interface SqsAttribute {
    key: string,
    value: string,
}

export interface SqsMessageItem {
    region: string | undefined
    id: string | undefined;
    messageId: string | undefined;
    body: string | undefined;
    contentType: string | undefined;
    receiptHandle: string | undefined;
    md5Sum: string | undefined;
    retries: number | undefined;
    size: number | undefined;
    attributes: SqsAttribute[];
    messageAttributes: SqsMessageAttribute[];
    created: Date | undefined;
    modified: Date | undefined;
}

export interface ListMessageCountersResponse {
    total: number;
    messageCounters: SqsMessageItem[];
}

export interface SqsMessageDialogResult {
    message: string,
    attributes: SqsMessageAttribute[]
}

