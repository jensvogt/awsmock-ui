import {BsonDateTime} from "../../../shared/format/bson-datetime.component";

export interface Tag {
    key: string | undefined;
    value: string | undefined;
}

export interface Environment {
    key: string | undefined;
    value: string | undefined;
}

export interface LambdaFunctionItem {
    id: string | undefined;
    region: string | undefined;
    functionName: string | undefined;
    runtime: string | undefined;
    handler: string | undefined;
    tags: any;
    environment: Environment[];
    user: string | undefined;
    role: string | undefined;
    size: number | undefined;
    concurrency: number | undefined;
    invocations: number | undefined;
    averageRuntime: number | undefined;
    lastStarted: BsonDateTime;
    lastInvocation: BsonDateTime;
    created: BsonDateTime;
    modified: BsonDateTime;
}

export interface LambdaFunctionCountersResponse {
    total: number;
    functionCounters: LambdaFunctionItem[];
}

export interface Code {
    ZipFile: string; // Base64 encoded ZIP file
}

export interface CreateFunctionRequest {
    FunctionName: string;
    Handler: string;
    Runtime: string;
    Code: Code;
    role: string;
}
