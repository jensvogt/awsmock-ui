export interface S3ObjectItem {
    oid: string | undefined,
    bucketName: string | undefined;
    key: string | undefined;
    size: number | undefined;
    contentType: string | undefined;
}

export interface S3ObjectCounterResponse {
    total: number,
    objectCounters: S3ObjectItem[]
}
