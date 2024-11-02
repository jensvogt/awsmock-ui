export interface S3ObjectItem {
    bucket: string | undefined;
    key: string | undefined;
    size: number | undefined;
}

export interface S3ObjectCounterResponse {
    total: number,
    objectCounters: S3ObjectItem[]
}
