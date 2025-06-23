import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {SortColumn} from "../../../shared/sorting/sorting.component";
import {SqsMessageAttribute} from "../model/sqs-message-item";
import {environment} from "../../../../environments/environment";

@Injectable({providedIn: 'root'})
export class SqsService {

    // Default headers for AwsMock HTTP requests
    baseUrl: string = <string>localStorage.getItem("backendUrl");
    user: string = <string>localStorage.getItem("user");
    region: string = <string>localStorage.getItem("region");
    headers: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'AWS4-HMAC-SHA256 Credential=none/20240928/' + this.region + '/s3/aws4_request, SignedHeaders=content-type;host;x-amz-date;x-amz-security-token;x-amz-target, Signature=01316d694335ec0e0bf68b08570490f1b0bae0b130ecbe13ebad511b3ece8a41'
    });

    constructor(private readonly http: HttpClient) {

    }

    /**
     * @brief Creates a new queue
     *
     * @param queueName SQS queue name
     */
    public createQueue(queueName: string) {
        let headers = this.headers.set('x-awsmock-target', 'sqs').set('x-awsmock-action', 'CreateQueue');
        return this.http.post(this.baseUrl, {QueueName: queueName}, {headers: headers});
    }

    /**
     * @brief List all queue ARNs
     */
    public listQueueArns() {
        let headers = this.headers.set('x-awsmock-target', 'sqs').set('x-awsmock-action', 'ListQueueArns');
        return this.http.post(this.baseUrl, {}, {headers: headers});
    }

    /**
     * @brief Purge a queue
     *
     * @param queueUrl SQS queue URL
     */
    purgeQueue(queueUrl: string) {
        let headers = this.headers.set('x-awsmock-target', 'sqs').set('x-awsmock-action', 'PurgeQueue');
        return this.http.post(this.baseUrl, {QueueUrl: queueUrl}, {headers: headers});
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
        return this.http.post(this.baseUrl, {prefix: prefix, pageSize: pageSize, pageIndex: pageIndex, sortColumns: sortColumns}, {headers: headers});
    }

    /**
     * @brief List queue details
     *
     * @param queueArn SQS queue ARN
     */
    public getQueueDetails(queueArn: string) {
        let headers = this.headers.set('x-awsmock-target', 'sqs').set('x-awsmock-action', 'GetQueueDetails');
        return this.http.post(this.baseUrl, {QueueArn: queueArn}, {headers: headers});
    }

    /**
     * @brief Return the SQS queue URL
     *
     * @param queueName SQS queue name
     */
    public getQueueUrl(queueName: string) {
        let headers = this.headers.set('x-awsmock-target', 'sqs').set('x-awsmock-action', 'GetQueueUrl');
        return this.http.post(this.baseUrl, {QueueName: queueName}, {headers: headers});
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
        return this.http.post(this.baseUrl, {queueArn: queueArn, pageSize: pageSize, pageIndex: pageIndex, sortColumns: sortColumns}, {headers: headers});
    }

    /**
     * @brief Gets a list of lambda triggers for a queue
     *
     * @param queueArn queue ARN
     * @param pageSize page size
     * @param pageIndex page index
     * @param sortColumns sorting columns
     */
    public listLambdaTriggerCounters(queueArn: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.headers.set('x-awsmock-target', 'sqs').set('x-awsmock-action', 'ListLambdaTriggerCounters');
        return this.http.post(this.baseUrl, {queueArn: queueArn, pageSize: pageSize, pageIndex: pageIndex, sortColumns: sortColumns}, {headers: headers});
    }

    /**
     * @brief Get an event source
     *
     * @param functionArn function ARN
     * @param eventSourceArn event source ARN
     */
    public getEventSource(functionArn: string, eventSourceArn: string) {
        let headers = this.headers.set('x-awsmock-target', 'sqs').set('x-awsmock-action', 'get-event-source');
        const body = {
            region: environment.awsmockRegion,
            functionArn: functionArn,
            eventSourceArn: eventSourceArn
        }
        return this.http.post(this.baseUrl, body, {headers: headers});
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
        return this.http.post(this.baseUrl, {QueueUrl: queueUrl, Tags: {[key]: value}}, {headers: headers});
    }

    /**
     * @brief Updates the DQL subscription
     *
     * @param queueArn queue ARN
     * @param dlqTargetArn target queue ARN
     * @param dlqRetries max retries number
     */
    updateDql(queueArn: string, dlqTargetArn: string, dlqRetries: number) {
        let headers = this.headers.set('x-awsmock-target', 'sqs').set('x-awsmock-action', 'UpdateDlq');
        return this.http.post(this.baseUrl, {QueueArn: queueArn, TargetArn: dlqTargetArn, Retries: dlqRetries}, {headers: headers});
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
        return this.http.post(this.baseUrl, {queueArn: queueArn, pageSize: pageSize, pageIndex: pageIndex, sortColumns: sortColumns}, {headers: headers});
    }

    /**
     * @brief Delete a queue tag
     *
     * @param queueUrl queue URL
     * @param key tag key
     */
    deleteTag(queueUrl: string, key: string) {
        let headers = this.headers.set('x-awsmock-target', 'sqs').set('x-awsmock-action', 'UntagQueue');
        return this.http.post(this.baseUrl, {QueueUrl: queueUrl, TagKeys: [key]}, {headers: headers});
    }

    /**
     * @brief Deletes a queue
     *
     * @param queueUrl SQS queue URL
     */
    public deleteQueue(queueUrl: string) {
        let headers = this.headers.set('x-awsmock-target', 'sqs').set('x-awsmock-action', 'DeleteQueue');
        return this.http.post(this.baseUrl, {QueueUrl: queueUrl}, {headers: headers});
    }

    /**
     * @brief Redrive messages
     *
     * @param queueArn SQS queue ARN
     */
    public redriveMessages(queueArn: string) {
        let headers = this.headers.set('x-awsmock-target', 'sqs').set('x-awsmock-action', 'RedriveMessages');
        return this.http.post(this.baseUrl, {queueArn: queueArn}, {headers: headers});
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
        return this.http.post(this.baseUrl, {queueArn: queueArn, prefix: prefix, pageSize: pageSize, pageIndex: pageIndex, sortColumns: sortColumns}, {headers: headers});
    }

    /**
     * @brief Send a SQS message
     *
     * @param queueUrl SQS queue URL
     * @param message message body to send
     * @param delaySeconds number of seconds delay
     * @param messageAttributes message attributes
     */
    public sendMessage(queueUrl: string, message: string, delaySeconds: number, messageAttributes: any) {
        let headers = this.headers.set('x-awsmock-target', 'sqs').set('x-awsmock-action', 'SendMessage');
        return this.http.post(this.baseUrl, {QueueUrl: queueUrl, MessageBody: message, DelaySeconds: delaySeconds, MessageAttributes: messageAttributes}, {headers: headers});
    }

    /**
     * @brief Resend a SQS message
     *
     * @param queueArn SQS queue ARN
     * @param messageId message ID
     */
    public resendMessage(queueArn: string, messageId: string) {
        let headers = this.headers.set('x-awsmock-target', 'sqs').set('x-awsmock-action', 'ResendMessage');
        return this.http.post(this.baseUrl, {queueArn: queueArn, messageId: messageId}, {headers: headers});
    }

    /**
     * @brief Update attribute
     *
     * @param messageId SQS message ID
     * @param messageAttributes attributes
     */
    public updateMessage(messageId: string, messageAttributes: SqsMessageAttribute[]) {
        let headers = this.headers.set('x-awsmock-target', 'sqs').set('x-awsmock-action', 'UpdateMessage');
        return this.http.post(this.baseUrl, {MessageId: messageId, MessageAttributes: messageAttributes}, {headers: headers});
    }

    /**
     * @brief Add message attribute
     *
     * @param messageId SQS message ID
     * @param name attribute name
     * @param dataType attribute dataType
     * @param value attribute value
     */
    public addMessageAttribute(messageId: string, name: string, dataType: string, value: string) {
        let headers = this.headers.set('x-awsmock-target', 'sqs').set('x-awsmock-action', 'AddAttribute');
        return this.http.post(this.baseUrl, {messageId: messageId, name: name, dataType: dataType, value: value}, {headers: headers});
    }

    /**
     * @brief Delete attribute
     *
     * @param messageId SQS message ID
     * @param name attribute name
     */
    public deleteMessageAttribute(messageId: string, name: string) {
        let headers = this.headers.set('x-awsmock-target', 'sqs').set('x-awsmock-action', 'DeleteAttribute');
        return this.http.post(this.baseUrl, {messageId: messageId, name: name}, {headers: headers});
    }

    /**
     * @brief Delete message
     *
     * @param queueUrl SQS queue URL
     * @param receiptHandle SQS receipt handle
     */
    public deleteMessage(queueUrl: string, receiptHandle: string) {
        let headers = this.headers.set('x-awsmock-target', 'sqs').set('x-awsmock-action', 'DeleteMessage');
        return this.http.post(this.baseUrl, {QueueUrl: queueUrl, ReceiptHandle: receiptHandle}, {headers: headers});
    }
}