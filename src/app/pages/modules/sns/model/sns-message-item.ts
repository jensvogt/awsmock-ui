export interface SnsMessageItem {
    region: string | undefined
    id: string | undefined;
    messageId: string | undefined;
    body: string | undefined;
    receiptHandle: string | undefined;
    md5Sum: string | undefined;
    created: Date | undefined;
}
