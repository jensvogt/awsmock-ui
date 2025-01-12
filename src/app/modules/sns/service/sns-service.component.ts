import {Injectable} from "@angular/core";
import {SNSClient} from "@aws-sdk/client-sns";
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

    /*
        subscribe(topicArn: string, endpoint: string, protocol: string) {
            const input = {
                TopicArn: topicArn,
                Protocol: protocol,
                Endpoint: endpoint,
                ReturnSubscriptionArn: true
            };
            return this.client.send(new SubscribeCommand(input));
        }
    */
    /**
     * @brief Create a new topic.
     *
     * @param topicName topic name
     */
    createTopic(topicName: string) {
        let headers = this.headers.set('x-awsmock-target', 'sns').set('x-awsmock-action', 'CreateTopic');
        return this.http.post(this.url, "Name=" + topicName, {headers: headers, responseType: 'text'});
    }

    /**
     * @brief Purges a topic, this will delete all the messages in the SNS topic.
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
     * @param topicArn topic ARN
     * @param pageSize page size
     * @param pageIndex page index
     * @param sortColumns sorting columns
     */
    public listMessageCounters(topicArn: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.headers.set('x-awsmock-target', 'sns').set('x-awsmock-action', 'ListMessageCounters');
        return this.http.post(this.url, {
            topicArn: topicArn, pageSize: pageSize, pageIndex: pageIndex, sortColumns: sortColumns
        }, {headers: headers});
    }

    /**
     * @brief Purges a topic, this will delete all the messages in the SNS topic.
     *
     * @param topicArn AWS topic ARN
     */
    public purgeTopic(topicArn: string) {
        let headers = this.headers.set('x-awsmock-target', 'sns').set('x-awsmock-action', 'PurgeTopic');
        return this.http.post(this.url, {topicArn: topicArn}, {headers: headers});
    }

    /**
     * @brief Subscribe to a topic
     *
     * @param topicArn topic ARN
     * @param endpoint subscription endpoint
     * @param protocol subscription protocol
     */
    subscribe(topicArn: string, endpoint: string, protocol: string) {
        let headers = this.headers.set('x-awsmock-target', 'sns').set('x-awsmock-action', 'Subscribe');
        return this.http.post(this.url, "TopicArn=" + topicArn + "&Endpoint=" + endpoint + "&Protocol=" + protocol, {headers: headers, responseType: 'text'});
    }

    /**
     * @brief Subscribe to a topic
     *
     * @param subscriptionArn subscription ARN
     */
    unsubscribe(subscriptionArn: string) {
        let headers = this.headers.set('x-awsmock-target', 'sns').set('x-awsmock-action', 'Unsubscribe');
        return this.http.post(this.url, "SubscriptionArn=" + subscriptionArn, {headers: headers, responseType: 'text'});
    }

    /**
     * @brief Publish a new message to the topic
     *
     * @param topicArn AWS topic ARN
     * @param message message body
     */
    publishMessage(topicArn: string, message: string) {
        let headers = this.headers.set('x-awsmock-target', 'sns').set('x-awsmock-action', 'Publish');
        return this.http.post(this.url, "TopicArn=" + topicArn + "&Message=" + message, {headers: headers, responseType: 'text'});
    }

    /**
     * @brief Purges a topic, this will delete all the messages in the SNS topic.
     *
     * @param topicArn SNS topic ARN
     * @param messageId SNS message ID
     */
    public deleteMessage(topicArn: string, messageId: string) {
        let headers = this.headers.set('x-awsmock-target', 'sns').set('x-awsmock-action', 'DeleteMessage');
        return this.http.post(this.url, {topicArn: topicArn, messageId: messageId}, {headers: headers, responseType: 'text'});
    }

    /**
     * @brief Returns the topic details
     *
     * @param topicArn AWS topic ARN
     */
    public getTopicDetails(topicArn: string) {
        let headers = this.headers.set('x-awsmock-target', 'sns').set('x-awsmock-action', 'GetTopicDetails');
        return this.http.post(this.url, {topicArn: topicArn}, {headers: headers});
    }

    /**
     * @brief Delete a topic
     *
     * @param topicArn AWS topic ARN
     */
    deleteTopic(topicArn: string) {
        let headers = this.headers.set('x-awsmock-target', 'sns').set('x-awsmock-action', 'DeleteTopic');
        return this.http.post(this.url, "TopicArn=" + topicArn, {headers: headers, responseType: 'text'});
    }

    /**
     * @brief Gets a list of subscriptions for a topic
     *
     * @param topicArn topic ARN
     * @param pageSize page size
     * @param pageIndex page index
     * @param sortColumns sorting columns
     */
    public listSubscriptionsCounters(topicArn: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.headers.set('x-awsmock-target', 'sns').set('x-awsmock-action', 'ListSubscriptionCounters');
        return this.http.post(this.url, {
            topicArn: topicArn, pageSize: pageSize, pageIndex: pageIndex, sortColumns: sortColumns
        }, {headers: headers, responseType: 'text'});
    }

}