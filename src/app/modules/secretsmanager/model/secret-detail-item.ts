export interface RotationRules {

    AutomaticallyAfterDays: number;
    Duration: string;
    ScheduleExpression: string;
}

export interface SecretDetails {
    region: string;
    secretName: string;
    secretUrl: string;
    secretArn: string;
    secretId: string;
    secretString: string;
    rotationLambdaARN: string;
    rotationRules: RotationRules;
    lastRotatedDate: Date;
    nextRotatedDate: Date;
    lastAccessedDate: Date;
    created: Date;
    modified: Date;
}

export interface RotateSecretRequest {
    SecretId: string;
    ClientRequestToken: string;
    RotationLambdaARN: string;
    RotateImmediately: boolean;
    RotationRules: RotationRules;
}

export interface LoadLambdaArnsResponse {
    lambdaArns: string[];
}