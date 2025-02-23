import {BsonDateTime} from "../../../shared/format/bson-datetime.component";

export interface NotificationEvents {
    name: string,
}

export interface LambdaConfiguration {
    Id: string,
    CloudFunction: string,
    Event: NotificationEvents[],
}

export interface QueueConfiguration {
    Id: string,
    Queue: string,
    Event: NotificationEvents[],
}

export interface TopicConfiguration {
    Id: string,
    Topic: string,
    Events: NotificationEvents[],
}

export interface S3BucketItem {
    id: string | undefined;
    region: string | undefined;
    bucket: string | undefined;
    keys: number | undefined;
    size: number | undefined;
    arn: string | undefined;
    owner: string | undefined;
    versionStatus: string | undefined;
    created: BsonDateTime;
    modified: BsonDateTime;
    lambdaConfigurations: LambdaConfiguration[] | undefined;
    queueConfigurations: QueueConfiguration[] | undefined;
    topicConfigurations: TopicConfiguration[] | undefined;
}

export interface S3BucketCountersResponse {
    total: number;
    bucketCounters: S3BucketItem[];
}