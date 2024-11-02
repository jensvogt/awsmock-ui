// Angular Modules
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from "../../environments/environment";
import {SortColumn} from "../shared/sorting/sorting.component";
import {S3Config, SnsConfig, SqsConfig} from "./awsmock-http-config";

@Injectable()
export class AwsMockHttpService {

    S3Config = new S3Config;
    SqsConfig = new SqsConfig;
    SnsConfig = new SnsConfig;
    url: string = environment.gatewayEndpoint + '/';

    constructor(private http: HttpClient) {
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
    public listQueueCounters(prefix: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.S3Config.s3HttpOptions.headers.set('x-awsmock-target', 'sqs').set('x-awsmock-action', 'ListQueueCounters');
        return this.http.post(this.url, {prefix: prefix, pageSize: pageSize, pageIndex: pageIndex, sortColumns: sortColumns}, {headers: headers});
    }

    /**
     * This is a fake AWS NodeJS SDK request. This will only work, if runs against a AwsMock instance.
     */
    public listTopicCounters(prefix: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.SnsConfig.snsHttpOptions.headers.set('x-awsmock-target', 'sns').set('x-awsmock-action', 'ListTopicCounters');
        return this.http.post(this.url, {prefix: prefix, pageSize: pageSize, pageIndex: pageIndex, sortColumns: sortColumns}, {headers: headers});
    }

    /**
     * This is a fake AWS NodeJS SDK request. This will only work, if runs against a AwsMock instance.
     */
    public listSqsMessages(queueArn: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.SqsConfig.sqsHttpOptions.headers.set('x-awsmock-target', 'sqs').set('x-awsmock-action', 'ListMessages');
        return this.http.post(this.url, {
            queueArn: queueArn,
            pageSize: pageSize,
            pageIndex: pageIndex,
            sortColumns: sortColumns
        }, {headers: headers});
    }

    public getQueueDetails(queueArn: string) {
        let headers = this.S3Config.s3HttpOptions.headers.set('x-awsmock-target', 'sqs').set('x-awsmock-action', 'GetQueueDetails');
        return this.http.post(this.url, {QueueArn: queueArn}, {headers: headers});
    }

    /**
     * This is a fake AWS NodeJS SDK request. This will only work, if runs against a AwsMock instance.
     */
    public listSnsMessages(topicArn: string, pageSize: number, pageIndex: number) {
        let headers = this.SnsConfig.snsHttpOptions.headers.set('x-awsmock-target', 'sns').set('x-awsmock-action', 'ListMessages');
        return this.http.post(this.url, {
            topicArn: topicArn,
            pageSize: pageSize,
            pageIndex: pageIndex
        }, {headers: headers});
    }

    /**
     * This is a fake AWS NodeJS SDK request. This will only work, if runs against a AwsMock instance.
     */
    public deleteSnsMessages(messageId: string) {
        let headers = this.SnsConfig.snsHttpOptions.headers.set('x-awsmock-target', 'sns').set('x-awsmock-action', 'DeleteMessage');
        return this.http.post(this.url, {messageId: messageId}, {headers: headers});
    }

    public getTopicDetails(topicArn: string) {
        let headers = this.S3Config.s3HttpOptions.headers.set('x-awsmock-target', 'sns').set('x-awsmock-action', 'GetTopicDetails');
        return this.http.post(this.url, {topicArn: topicArn}, {headers: headers});
    }
}
