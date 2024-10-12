// Angular Modules
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from "../../environments/environment";
import {SortColumn} from "../shared/sorting/sorting.component";
import {ManagerConfig, S3Config} from "./awsmock-http-config";

@Injectable()
export class AwsMockHttpService {

    S3Config = new S3Config;
    ModuleConfig = new ManagerConfig;
    url: string = environment.gatewayEndpoint + '/';

    constructor(private http: HttpClient) {
    }

    /**
     * This is a fake AWS NodeJS SDK request. This will only work, if runs against a AwsMock instance.
     */
    public listBucketCounters(prefix: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.S3Config.s3HttpOptions.headers.set('x-awsmock-target', 's3').set('x-awsmock-action', 'ListBucketCounters');
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
        let headers = this.S3Config.s3HttpOptions.headers.set('x-awsmock-target', 's3').set('x-awsmock-action', 'ListObjectCounters');
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

    public getBucket(bucketName: string) {
        let headers = this.S3Config.s3HttpOptions.headers.set('x-awsmock-target', 's3').set('x-awsmock-action', 'GetBucket');
        const body = {
            region: environment.awsmockRegion,
            bucketName: bucketName
        }
        return this.http.post(this.url, body, {headers: headers});
    }

    public saveBucket(bucket: any) {
        let headers = this.S3Config.s3HttpOptions.headers.set('x-awsmock-target', 's3').set('x-awsmock-action', 'SaveBucket');
        return this.http.post(this.url, bucket, {headers: headers});
    }

    /**
     * This is a fake AWS NodeJS SDK request. This will only work, if runs against a AwsMock instance.
     */
    public listQueueArns() {
        let headers = this.S3Config.s3HttpOptions.headers.set('x-awsmock-target', 'sqs').set('x-awsmock-action', 'ListQueueArns');
        return this.http.post(this.url, {}, {headers: headers});
    }

    /**
     * This is a fake AWS NodeJS SDK request. This will only work, if runs against a AwsMock instance.
     */
    public listQueueCounters(pageSize: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.S3Config.s3HttpOptions.headers.set('x-awsmock-target', 'sqs').set('x-awsmock-action', 'ListQueueCounters');
        return this.http.post(this.url, {pageSize: pageSize, pageIndex: pageIndex, sortColumns: sortColumns}, {headers: headers});
    }

    /**
     * This is a fake AWS NodeJS SDK request. This will only work, if runs against a AwsMock instance.
     */
    public listSqsMessages(queueArn: string, pageSize: number, pageIndex: number) {
        let headers = this.S3Config.s3HttpOptions.headers.set('x-awsmock-target', 'sqs').set('x-awsmock-action', 'ListMessages');
        return this.http.post(this.url, {
            queueArn: queueArn,
            pageSize: pageSize,
            pageIndex: pageIndex
        }, {headers: headers});
    }

    /**
     * This is a fake AWS NodeJS SDK request. This will only work, if runs against a AwsMock instance.
     */
    public listSnsMessages(topicArn: string, pageSize: number, pageIndex: number) {
        let headers = this.S3Config.s3HttpOptions.headers.set('x-awsmock-target', 'sns').set('x-awsmock-action', 'ListMessages');
        return this.http.post(this.url, {
            topicArn: topicArn,
            pageSize: pageSize,
            pageIndex: pageIndex
        }, {headers: headers});
    }

    public getQueueDetails(queueArn: string) {
        let headers = this.S3Config.s3HttpOptions.headers.set('x-awsmock-target', 'sqs').set('x-awsmock-action', 'GetQueueDetails');
        return this.http.post(this.url, {QueueArn: queueArn}, {headers: headers});
    }

    public getTopicDetails(topicArn: string) {
        let headers = this.S3Config.s3HttpOptions.headers.set('x-awsmock-target', 'sns').set('x-awsmock-action', 'GetTopicDetails');
        return this.http.post(this.url, {topicArn: topicArn}, {headers: headers});
    }
}
