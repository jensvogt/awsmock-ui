import {HttpHeaders} from '@angular/common/http';

export class S3Config {
    s3HttpOptions: any = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'AWS4-HMAC-SHA256 Credential=none/20240928/eu-central-1/s3/aws4_request, SignedHeaders=content-type;host;x-amz-date;x-amz-security-token;x-amz-target, Signature=01316d694335ec0e0bf68b08570490f1b0bae0b130ecbe13ebad511b3ece8a41'
        })
    }
}

export class SnsConfig {
    snsHttpOptions: any = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'AWS4-HMAC-SHA256 Credential=none/20240928/eu-central-1/sns/aws4_request, SignedHeaders=content-type;host;x-amz-date;x-amz-security-token;x-amz-target, Signature=01316d694335ec0e0bf68b08570490f1b0bae0b130ecbe13ebad511b3ece8a41'
        })
    }
}

export class SqsConfig {
    sqsHttpOptions: any = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'AWS4-HMAC-SHA256 Credential=none/20240928/eu-central-1/sqs/aws4_request, SignedHeaders=content-type;host;x-amz-date;x-amz-security-token;x-amz-target, Signature=01316d694335ec0e0bf68b08570490f1b0bae0b130ecbe13ebad511b3ece8a41'
        })
    }
}

export class CognitoConfig {
    cognitoOptions: any = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'AWS4-HMAC-SHA256 Credential=none/20240928/eu-central-1/cognito-idp/aws4_request, SignedHeaders=content-type;host;x-amz-date;x-amz-security-token;x-amz-target, Signature=01316d694335ec0e0bf68b08570490f1b0bae0b130ecbe13ebad511b3ece8a41'
        })
    }
}

export class MonitoringConfig {
    monitoringHttpOptions: any = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'AWS4-HMAC-SHA256 Credential=none/20240928/eu-central-1/monitoring/aws4_request, SignedHeaders=content-type;host;x-amz-date;x-amz-security-token;x-amz-target, Signature=01316d694335ec0e0bf68b08570490f1b0bae0b130ecbe13ebad511b3ece8a41'
        })
    }
}

export class ManagerConfig {
    managerHttpOptions: any = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    }
}
