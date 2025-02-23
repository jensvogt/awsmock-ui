import {BsonDateTime} from "../../../shared/format/bson-datetime.component";

export interface S3ObjectMetadata {
    key: string | undefined,
    value: string | undefined
}

export interface S3ObjectItem {
    oid: string | undefined,
    region: string | undefined,
    bucketName: string | undefined;
    key: string | undefined;
    size: number | undefined;
    contentType: string | undefined;
    internalName: string | undefined;
    metadata: S3ObjectMetadata[];
    created: BsonDateTime;
    modified: BsonDateTime;
}

export interface S3ObjectCounterResponse {
    total: number,
    objectCounters: S3ObjectItem[]
}
