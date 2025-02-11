import {BsonDateTime} from "../../../shared/format/bson-datetime.component";

export interface SqsMessageAttribute {
    Key: string,
    Value: string,
    DataType: string
}

export interface SqsAttribute {
    Key: string,
    Value: string,
}

export interface SqsMessageItem {
    region: string | undefined
    id: string | undefined;
    messageId: string | undefined;
    body: string | undefined;
    receiptHandle: string | undefined;
    md5Sum: string | undefined;
    retries: number | undefined;
    size: number | undefined;
    attributes: SqsAttribute[];
    messageAttributes: SqsMessageAttribute[];
    created: BsonDateTime | undefined;
    modified: BsonDateTime | undefined;
}

export interface ListMessageCountersResponse {
    Total: number;
    Messages: SqsMessageItem[];
}

export interface SqsMessageDialogResult {
    message: string,
    attributes: SqsMessageAttribute[]
}

