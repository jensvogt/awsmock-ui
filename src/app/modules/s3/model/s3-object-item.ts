import {BsonDateTime} from "../../../shared/format/bson-datetime.component";

export interface S3ObjectItem {
    oid: string | undefined,
    region: string | undefined,
    bucketName: string | undefined;
    key: string | undefined;
    size: number | undefined;
    contentType: string | undefined;
    internalName: string | undefined;
    created: BsonDateTime;
    modified: BsonDateTime;
}

export interface S3ObjectCounterResponse {
    total: number,
    objectCounters: S3ObjectItem[]
}
