import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {SortColumn} from "../../../shared/sorting/sorting.component";

export interface SqsTag {
    key: string;
}

export interface SqsAddTagRequest {
    QueueUrl: string | undefined;
    Tags: SqsTag[];
}

@Injectable({providedIn: 'root'})
export class SqsService {

    // Default headers for AwsMock HTTP requests
    headers: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'AWS4-HMAC-SHA256 Credential=none/20240928/eu-central-1/s3/aws4_request, SignedHeaders=content-type;host;x-amz-date;x-amz-security-token;x-amz-target, Signature=01316d694335ec0e0bf68b08570490f1b0bae0b130ecbe13ebad511b3ece8a41'
    });
    url: string = environment.gatewayEndpoint + '/';

    constructor(private http: HttpClient) {
    }

    /**
     * @brief Creates a new queue
     *
     * @param queueName SQS queue name
     */
    public createQueue(queueName: string) {
        let headers = this.headers.set('x-awsmock-target', 'sqs').set('x-awsmock-action', 'CreateQueue');
        return this.http.post(this.url, {QueueName: queueName}, {headers: headers});
    }

    /**
     * @brief List all queue ARNs
     */
    public listQueueArns() {
        let headers = this.headers.set('x-awsmock-target', 'sqs').set('x-awsmock-action', 'ListQueueArns');
        return this.http.post(this.url, {}, {headers: headers});
    }

    /**
     * @brief Purge a queue
     *
     * @param queueUrl SQS queue URL
     */
    purgeQueue(queueUrl: string) {
        let headers = this.headers.set('x-awsmock-target', 'sqs').set('x-awsmock-action', 'PurgeQueue');
        return this.http.post(this.url, {QueueUrl: queueUrl}, {headers: headers});
    }

    /**
     * @brief List all queues
     *
     * @param prefix bucket name prefix
     * @param pageSize page size
     * @param pageIndex page index
     * @param sortColumns sorting columns
     */
    public listQueueCounters(prefix: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.headers.set('x-awsmock-target', 'sqs').set('x-awsmock-action', 'ListQueueCounters');
        return this.http.post(this.url, {prefix: prefix, pageSize: pageSize, pageIndex: pageIndex, sortColumns: sortColumns}, {headers: headers});
    }

    /**
     * @brief List queue details
     *
     * @param queueArn SQS queue ARN
     */
    public getQueueDetails(queueArn: string) {
        let headers = this.headers.set('x-awsmock-target', 'sqs').set('x-awsmock-action', 'GetQueueDetails');
        return this.http.post(this.url, {QueueArn: queueArn}, {headers: headers});
    }

    /**
     * @brief Return the SQS queue URL
     *
     * @param queueName SQS queue name
     */
    public getQueueUrl(queueName: string) {
        let headers = this.headers.set('x-awsmock-target', 'sqs').set('x-awsmock-action', 'GetQueueUrl');
        return this.http.post(this.url, {QueueName: queueName}, {headers: headers});
    }

    /**
     * @brief Gets a list of attributes for a queue
     *
     * @param queueArn queue ARN
     * @param pageSize page size
     * @param pageIndex page index
     * @param sortColumns sorting columns
     */
    public listQueueAttributeCounters(queueArn: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.headers.set('x-awsmock-target', 'sqs').set('x-awsmock-action', 'ListQueueAttributeCounters');
        return this.http.post(this.url, {queueArn: queueArn, pageSize: pageSize, pageIndex: pageIndex, sortColumns: sortColumns}, {headers: headers});
    }

    /**
     * @brief Add a tag to a queue
     *
     * @param queueUrl queue URL
     * @param key tag key
     * @param value tag value
     */
    addTag(queueUrl: string, key: string, value: string) {
        let headers = this.headers.set('x-awsmock-target', 'sqs').set('x-awsmock-action', 'TagQueue');
        return this.http.post(this.url, {QueueUrl: queueUrl, Tags: {[key]: value}}, {headers: headers});
    }

    /**
     * @brief Gets a list of tags for a queue
     *
     * @param queueArn queue ARN
     * @param pageSize page size
     * @param pageIndex page index
     * @param sortColumns sorting columns
     */
    public listTagCounters(queueArn: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.headers.set('x-awsmock-target', 'sqs').set('x-awsmock-action', 'ListTagCounters');
        return this.http.post(this.url, {queueArn: queueArn, pageSize: pageSize, pageIndex: pageIndex, sortColumns: sortColumns}, {headers: headers});
    }

    /**
     * @brief Delete a queue tag
     *
     * @param queueUrl queue URL
     * @param key tag key
     */
    deleteTag(queueUrl: string, key: string) {
        let headers = this.headers.set('x-awsmock-target', 'sqs').set('x-awsmock-action', 'UntagQueue');
        return this.http.post(this.url, {QueueUrl: queueUrl, TagKeys: [key]}, {headers: headers});
    }

    /**
     * @brief Deletes a queue
     *
     * @param queueUrl SQS queue URL
     */
    public deleteQueue(queueUrl: string) {
        let headers = this.headers.set('x-awsmock-target', 'sqs').set('x-awsmock-action', 'DeleteQueue');
        return this.http.post(this.url, {QueueUrl: queueUrl}, {headers: headers});
    }

    /**
     * @brief List all message counters
     *
     * @param queueArn SQS queue ARN
     * @param prefix SQS message prefix
     * @param pageSize page size
     * @param pageIndex page index
     * @param sortColumns sorting columns
     */
    public listMessageCounters(queueArn: string, prefix: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.headers.set('x-awsmock-target', 'sqs').set('x-awsmock-action', 'ListMessageCounters');
        return this.http.post(this.url, {queueArn: queueArn, prefix: prefix, pageSize: pageSize, pageIndex: pageIndex, sortColumns: sortColumns}, {headers: headers});
    }

    /**
     * @brief Send a SQS message
     *
     * @param queueUrl SQS queue URL
     * @param message message body to send
     * @param delaySeconds number of seconds delay
     */
    public sendMessage(queueUrl: string, message: string, delaySeconds: number) {
        let headers = this.headers.set('x-awsmock-target', 'sqs').set('x-awsmock-action', 'SendMessage');
        return this.http.post(this.url, {QueueUrl: queueUrl, MessageBody: message, DelaySeconds: delaySeconds}, {headers: headers});
    }

    /**
     * @brief Delete message
     *
     * @param queueUrl SQS queue URL
     * @param receiptHandle SQS receipt handle
     */
    public deleteMessageAws(queueUrl: string, receiptHandle: string) {
        let headers = this.headers.set('x-awsmock-target', 'sqs').set('x-awsmock-action', 'DeleteMessage');
        return this.http.post(this.url, {QueueUrl: queueUrl, ReceiptHandle: receiptHandle}, {headers: headers});
    }
}