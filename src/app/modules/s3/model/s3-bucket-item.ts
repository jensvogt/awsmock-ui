import {BsonDateTime} from "../../../shared/format/bson-datetime.component";

export interface NotificationEvents {
    name: string,
}

export interface LambdaConfiguration {
    id: string,
    lambdaArn: string,
    events: NotificationEvents[],
}

export interface S3BucketItem {
    id: string | undefined;
    region: string | undefined;
    bucketName: string | undefined;
    keys: number | undefined;
    size: number | undefined;
    arn: string | undefined;
    owner: string | undefined;
    versionStatus: string | undefined;
    created: BsonDateTime;
    modified: BsonDateTime;
    lambdaConfigurations: LambdaConfiguration[] | undefined;
}

export interface S3BucketCountersResponse {
    total: number;
    bucketCounters: S3BucketItem[];
}