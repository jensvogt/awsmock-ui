// Angular Modules
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from "../../environments/environment";
import {SortColumn} from "../shared/sorting/sorting.component";

@Injectable()
export class AwsMockHttpService {

    url: string = environment.awsmockEndpoint + '/';

    constructor(private http: HttpClient) {
    }

    /**
     * This is a fake AWS NodeJS SDK request. This will only work, if runs against a AwsMock instance.
     */
    public listBucketCounters(prefix: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/x-amz-json-1.0');
        headers = headers.set('Authorization', 'AWS4-HMAC-SHA256 Credential=none/20240928/eu-central-1/s3/aws4_request, SignedHeaders=content-type;host;x-amz-date;x-amz-security-token;x-amz-target, Signature=01316d694335ec0e0bf68b08570490f1b0bae0b130ecbe13ebad511b3ece8a41');
        headers = headers.set('X-Amz-Target', 'AmazonSQS.ListBucketCounters');
        const body = {
            region: environment.awsmockRegion,
            prefix: prefix,
            maxResults: pageSize,
            skip: pageSize * pageIndex,
            sortColumns: sortColumns
        }
        return this.http.post(this.url, body, {headers: headers});
    }

    public listObjectsCounters(bucket: string, prefix: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/x-amz-json-1.0');
        headers = headers.set('Authorization', 'AWS4-HMAC-SHA256 Credential=none/20240928/eu-central-1/s3/aws4_request, SignedHeaders=content-type;host;x-amz-date;x-amz-security-token;x-amz-target, Signature=01316d694335ec0e0bf68b08570490f1b0bae0b130ecbe13ebad511b3ece8a41');
        headers = headers.set('X-Amz-Target', 'AmazonSQS.ListObjectCounters');
        const body = {
            region: environment.awsmockRegion,
            bucket: bucket,
            prefix: prefix,
            maxResults: pageSize,
            skip: pageSize * pageIndex,
            sortColumns: sortColumns
        }
        return this.http.post(this.url, body, {headers: headers});
    }

    /**
     * This is a fake AWS NodeJS SDK request. This will only work, if runs against a AwsMock instance.
     */
    public listQueueArns() {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/x-amz-json-1.0');
        headers = headers.set('Authorization', 'AWS4-HMAC-SHA256 Credential=none/20240928/eu-central-1/sqs/aws4_request, SignedHeaders=content-type;host;x-amz-date;x-amz-security-token;x-amz-target, Signature=01316d694335ec0e0bf68b08570490f1b0bae0b130ecbe13ebad511b3ece8a41');
        headers = headers.set('X-Amz-Target', 'AmazonSQS.ListQueueArns');
        return this.http.post(this.url, {}, {headers: headers});
    }

    /**
     * This is a fake AWS NodeJS SDK request. This will only work, if runs against a AwsMock instance.
     */
    public listQueueCounters(pageSize: number, pageIndex: number) {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/x-amz-json-1.0');
        headers = headers.set('Authorization', 'AWS4-HMAC-SHA256 Credential=none/20240928/eu-central-1/sqs/aws4_request, SignedHeaders=content-type;host;x-amz-date;x-amz-security-token;x-amz-target, Signature=01316d694335ec0e0bf68b08570490f1b0bae0b130ecbe13ebad511b3ece8a41');
        headers = headers.set('X-Amz-Target', 'AmazonSQS.ListQueueCounters');
        return this.http.post(this.url, {pageSize: pageSize, pageIndex: pageIndex}, {headers: headers});
    }

    /**
     * This is a fake AWS NodeJS SDK request. This will only work, if runs against a AwsMock instance.
     */
    public listSqsMessages(queueArn: string, pageSize: number, pageIndex: number) {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/x-amz-json-1.0');
        headers = headers.set('Authorization', 'AWS4-HMAC-SHA256 Credential=none/20240928/eu-central-1/sqs/aws4_request, SignedHeaders=content-type;host;x-amz-date;x-amz-security-token;x-amz-target, Signature=01316d694335ec0e0bf68b08570490f1b0bae0b130ecbe13ebad511b3ece8a41');
        headers = headers.set('X-Amz-Target', 'AmazonSQS.ListMessages');
        return this.http.post(this.url, {
            queueArn: queueArn,
            pageSize: pageSize,
            pageIndex: pageIndex
        }, {headers: headers});
    }

    /**
     * This is a fake AWS NodeJS SDK request. This will only work, if runs against a AwsMock instance.
     */
    public listSnsMessages(queueArn: string, pageSize: number, pageIndex: number) {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/x-amz-json-1.0');
        headers = headers.set('Authorization', 'AWS4-HMAC-SHA256 Credential=none/20240928/eu-central-1/sns/aws4_request, SignedHeaders=content-type;host;x-amz-date;x-amz-security-token;x-amz-target, Signature=01316d694335ec0e0bf68b08570490f1b0bae0b130ecbe13ebad511b3ece8a41');
        headers = headers.set('X-Amz-Target', 'AmazonSNS.ListMessages');
        return this.http.post(this.url, {
            queueArn: queueArn,
            pageSize: pageSize,
            pageIndex: pageIndex
        }, {headers: headers});
    }
}
