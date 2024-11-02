import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {
    CreateQueueCommand,
    DeleteMessageCommand,
    DeleteQueueCommand,
    GetQueueAttributesCommand,
    GetQueueUrlCommand,
    ListQueuesCommand,
    PurgeQueueCommand,
    QueueAttributeName,
    SendMessageCommand,
    SQSClient
} from "@aws-sdk/client-sqs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {SortColumn} from "../../../shared/sorting/sorting.component";

@Injectable({providedIn: 'root'})
export class SqsService {

    client = new SQSClient({
        region: environment.awsmockRegion,
        endpoint: environment.gatewayEndpoint,
        credentials: {
            accessKeyId: 'test',
            secretAccessKey: 'test',
        },
        requestHandler: {
            requestTimeout: 30_000,
            httpsAgent: {maxSockets: 25},
        },
    });

    // Default headers for AwsMock HTTP requests
    headers: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'AWS4-HMAC-SHA256 Credential=none/20240928/eu-central-1/s3/aws4_request, SignedHeaders=content-type;host;x-amz-date;x-amz-security-token;x-amz-target, Signature=01316d694335ec0e0bf68b08570490f1b0bae0b130ecbe13ebad511b3ece8a41'
    });
    url: string = environment.gatewayEndpoint + '/';

    constructor(private http: HttpClient) {
    }

    listQueues(pageIndex: number, pageSize: number, prefix: string): any {
        const input = {
            QueueNamePrefix: prefix,
            NextToken: (pageIndex * pageSize).toString(),
            MaxResults: pageSize,
        };
        return this.client.send(new ListQueuesCommand(input));
    }

    purgeQueue(queueName: string) {
        const input = {
            QueueUrl: queueName
        };
        return this.client.send(new PurgeQueueCommand(input))
    }

    getQueueAttributes(queueUrl: string) {
        const input = {
            QueueUrl: queueUrl,
            AttributeNames: [QueueAttributeName.All],
        };
        return this.client.send(new GetQueueAttributesCommand(input));
    }

    getQueueArn(queueUrl: string) {
        const input = {
            QueueUrl: queueUrl,
            AttributeNames: [QueueAttributeName.QueueArn],
        };
        return this.client.send(new GetQueueAttributesCommand(input));
    }

    getQueueUrl(queueName: string) {
        const input = {
            QueueName: queueName
        };
        return this.client.send(new GetQueueUrlCommand(input));
    }

    saveQueue(queueName: string) {
        const input = {
            QueueName: queueName
        };
        return this.client.send(new CreateQueueCommand(input));
    }

    deleteQueue(queueUrl: string) {
        const input = {
            QueueUrl: queueUrl
        };
        return this.client.send(new DeleteQueueCommand(input));
    }

    sendMessage(queueUrl: string, message: string) {
        const input = {
            QueueUrl: queueUrl,
            MessageBody: message,
            DelaySeconds: 0
        };
        return this.client.send(new SendMessageCommand(input));
    }

    deleteMessage(queueUrl: string, receiptHandle: string) {
        const input = {
            QueueUrl: queueUrl,
            ReceiptHandle: receiptHandle,
        };
        return this.client.send(new DeleteMessageCommand(input));
    }

    cleanup() {
        this.client.destroy();
    }

    /**
     * @brief List all queue ARNs
     *
     * @par
     * This is a fake AWS NodeJS SDK request. This will only work, if runs against a AwsMock instance.
     */
    public listQueueArns() {
        let headers = this.headers.set('x-awsmock-target', 'sqs').set('x-awsmock-action', 'ListQueueArns');
        return this.http.post(this.url, {}, {headers: headers});
    }

    /**
     * @brief List all queues
     *
     * @par
     * This is a fake AWS NodeJS SDK request. This will only work, if runs against a AwsMock instance.
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
     * @brief List all messages for a queues
     *
     * @par
     * This is a fake AWS NodeJS SDK request. This will only work, if runs against a AwsMock instance.
     *
     * @param queueArn queue ARN
     * @param pageSize page size
     * @param pageIndex page index
     * @param sortColumns sorting columns
     */
    public listSqsMessages(queueArn: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.headers.set('x-awsmock-target', 'sqs').set('x-awsmock-action', 'ListMessages');
        return this.http.post(this.url, {
            queueArn: queueArn,
            pageSize: pageSize,
            pageIndex: pageIndex,
            sortColumns: sortColumns
        }, {headers: headers});
    }

    /**
     * @brief List queue details
     *
     * @par
     * This is a fake AWS NodeJS SDK request. This will only work, if runs against a AwsMock instance.
     *
     * @param queueArn SQS queue ARN
     */
    public getQueueDetails(queueArn: string) {
        let headers = this.headers.set('x-awsmock-target', 'sqs').set('x-awsmock-action', 'GetQueueDetails');
        return this.http.post(this.url, {QueueArn: queueArn}, {headers: headers});
    }

}