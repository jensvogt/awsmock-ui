export interface Tag {
    key: string | undefined;
    value: string | undefined;
}

export interface Environment {
    key: string;
    value: string;
}

export interface LambdaFunctionItem {
    id: string | undefined;
    region: string | undefined;
    functionName: string | undefined;
    functionArn: string;
    runtime: string | undefined;
    handler: string;
    state: string | undefined;
    enabled: boolean | undefined;
    tags: any;
    version: string;
    environment: Environment[];
    user: string | undefined;
    role: string;
    size: number | undefined;
    zipFile: string;
    s3Bucket: string;
    s3Key: string;
    s3ObjectVersion: string;
    concurrency: number;
    invocations: number;
    averageRuntime: number;
    instances: number;
    lastStarted: Date;
    lastInvocation: Date;
    created: Date;
    modified: Date;
}

export interface LambdaFunctionCountersResponse {
    total: number;
    functionCounters: LambdaFunctionItem[];
}

export interface Code {
    ZipFile: string; // Base64 encoded ZIP file
}

export interface EphemeralStorage {
    Size: number;
}

export interface LambdaEnvironment {
    Variables: any;
}

export interface CreateFunctionRequest {
    FunctionName: string;
    Handler: string;
    Runtime: string;
    Code: Code;
    Role: string;
    MemorySize: number;
    Timeout: number;
    EphemeralStorage: EphemeralStorage;
    Tags: any;
    Environment: LambdaEnvironment;
}
