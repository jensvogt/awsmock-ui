export interface LambdaResultItem {
    oid: string | undefined;
    region: string | undefined;
    lambdaName: string | undefined;
    lambdaArn: string | "";
    runtime: string | undefined;
    requestBody: string | "";
    responseBody: string | "";
    lambdaStatus: string | undefined;
    httpStatusCode: any;
    timestamp: Date;
}

export interface LambdaResultCountersResponse {
    total: number;
    lambdaResultCounters: LambdaResultItem[];
}
