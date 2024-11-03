import {Injectable} from "@angular/core";
import {CreateTopicCommand, DeleteTopicCommand, ListTopicsCommand, PublishCommand, SNSClient, SubscribeCommand} from "@aws-sdk/client-sns";
import {environment} from "../../../../environments/environment";
import {SortColumn} from "../../../shared/sorting/sorting.component";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable()
export class SnsService {

    client = new SNSClient({
        region: environment.awsmockRegion,
        endpoint: environment.gatewayEndpoint,
        maxAttempts: 1,
        credentials: {
            accessKeyId: 'test',
            secretAccessKey: 'test',
        },
        requestHandler: {
            requestTimeout: 3000,
            httpsAgent: {maxSockets: 25, keepAlive: true},
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

    listTopics(pageIndex: number, pageSize: number): any {

        const input = {
            NextToken: (pageIndex * pageSize).toString(),
            MaxResults: pageSize,
        };
        return this.client.send(new ListTopicsCommand(input));
    }

    addTopic(topicName: string) {
        const input = {
            Name: topicName
        };
        return this.client.send(new CreateTopicCommand(input));
    }

    deleteTopic(topicArn: string) {
        const input = {
            TopicArn: topicArn,
        };
        return this.client.send(new DeleteTopicCommand(input));
    }

    subscribe(topicArn: string, endpoint: string, protocol: string) {
        const input = {
            TopicArn: topicArn,
            Protocol: protocol,
            Endpoint: endpoint,
            ReturnSubscriptionArn: true
        };
        return this.client.send(new SubscribeCommand(input));
    }

    publishMessage(topicArn: string, message: string) {
        const input = {
            TopicArn: topicArn,
            Message: message
        };
        return this.client.send(new PublishCommand(input));
    }

    cleanup() {
        this.client.destroy();
    }

    /**
     * @brief Purges a topic, this will delete all the messages in the SNS topic.
     *
     * @par
     * This is a fake AWS NodeJS SDK request. This will only work, if runs against a AwsMock instance.
     *
     * @param prefix topic name prefix
     * @param pageSize page size
     * @param pageIndex page index
     * @param sortColumns sorting columns
     */
    public listTopicCounters(prefix: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.headers.set('x-awsmock-target', 'sns').set('x-awsmock-action', 'ListTopicCounters');
        return this.http.post(this.url, {prefix: prefix, pageSize: pageSize, pageIndex: pageIndex, sortColumns: sortColumns}, {headers: headers});
    }

    /**
     * @brief Purges a topic, this will delete all the messages in the SNS topic.
     *
     * @par
     * This is a fake AWS NodeJS SDK request. This will only work, if runs against a AwsMock instance.
     *
     * @param topicArn topic ARN
     * @param pageSize page size
     * @param pageIndex page index
     * @param sortColumns sorting columns
     */
    public listMessageCounters(topicArn: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.headers.set('x-awsmock-target', 'sns').set('x-awsmock-action', 'ListMessages');
        return this.http.post(this.url, {
            topicArn: topicArn, pageSize: pageSize, pageIndex: pageIndex, sortColumns: sortColumns
        }, {headers: headers});
    }

    /**
     * @brief Purges a topic, this will delete all the messages in the SNS topic.
     *
     * @par
     * This is a fake AWS NodeJS SDK request. This will only work, if runs against a AwsMock instance.
     *
     * @param topicArn AWS topic ARN
     */
    public purgeTopic(topicArn: string) {
        let headers = this.headers.set('x-awsmock-target', 'sns').set('x-awsmock-action', 'PurgeTopic');
        return this.http.post(this.url, {topicArn: topicArn}, {headers: headers});
    }

    /**
     * @brief Purges a topic, this will delete all the messages in the SNS topic.
     *
     * @par
     * This is a fake AWS NodeJS SDK request. This will only work, if runs against a AwsMock instance.
     *
     * @param topicArn SNS topic ARN
     * @param messageId SNS message ID
     */
    public deleteMessage(topicArn: string, messageId: string) {
        let headers = this.headers.set('x-awsmock-target', 'sns').set('x-awsmock-action', 'DeleteMessage');
        return this.http.post(this.url, {topicArn: topicArn, messageId: messageId}, {headers: headers});
    }

    /**
     * @brief Returns the topic details
     *
     * @par
     * This is a fake AWS NodeJS SDK request. This will only work, if runs against a AwsMock instance.
     *
     * @param topicArn AWS topic ARN
     */
    public getTopicDetails(topicArn: string) {
        let headers = this.headers.set('x-awsmock-target', 'sns').set('x-awsmock-action', 'GetTopicDetails');
        return this.http.post(this.url, {topicArn: topicArn}, {headers: headers});
    }

}