import {BsonDateTime} from "../../../shared/format/bson-datetime.component";

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
    functionArn: string | undefined;
    runtime: string | undefined;
    handler: string | undefined;
    state: string | undefined;
    tags: any;
    version: string;
    environment: Environment[];
    user: string | undefined;
    role: string | undefined;
    size: number | undefined;
    concurrency: number | undefined;
    invocations: number | undefined;
    averageRuntime: number | undefined;
    lastStarted: BsonDateTime | { $date: undefined };
    lastInvocation: BsonDateTime | { $date: undefined };
    created: BsonDateTime | { $date: undefined };
    modified: BsonDateTime | { $date: undefined };
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
