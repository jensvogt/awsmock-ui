import {Injectable} from "@angular/core";
import {SortColumn} from "../../../shared/sorting/sorting.component";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {SnsMessageAttribute} from "../model/sns-message-item";

@Injectable({providedIn: 'root'})
export class SnsService {

    // Default headers for AwsMock HTTP requests
    baseUrl: string = <string>localStorage.getItem("backendUrl");
    user: string = <string>localStorage.getItem("user");
    region: string = <string>localStorage.getItem("region");
    headers: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'AWS4-HMAC-SHA256 Credential=none/20240928/' + this.region + '/sns/aws4_request, SignedHeaders=content-type;host;x-amz-date;x-amz-security-token;x-amz-target, Signature=01316d694335ec0e0bf68b08570490f1b0bae0b130ecbe13ebad511b3ece8a41'
    });

    constructor(private readonly http: HttpClient) {
    }

    /**
     * @brief Create a new topic.
     *
     * @param topicName topic name
     */
    createTopic(topicName: string) {
        let headers = this.headers.set('x-awsmock-target', 'sns').set('x-awsmock-action', 'CreateTopic');
        return this.http.post(this.baseUrl, "Name=" + topicName, {headers: headers, responseType: 'text'});
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
        return this.http.post(this.baseUrl, {prefix: prefix, pageSize: pageSize, pageIndex: pageIndex, sortColumns: sortColumns}, {headers: headers});
    }

    /**
     * @brief Purges a topic, this will delete all the messages in the SNS topic.
     *
     * @param topicArn topic ARN
     * @param prefix message prefix
     * @param pageSize page size
     * @param pageIndex page index
     * @param sortColumns sorting columns
     */
    public listMessageCounters(topicArn: string, prefix: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.headers.set('x-awsmock-target', 'sns').set('x-awsmock-action', 'ListMessageCounters');
        return this.http.post(this.baseUrl, {topicArn: topicArn, prefix: prefix, pageSize: pageSize, pageIndex: pageIndex, sortColumns: sortColumns}, {headers: headers});
    }

    /**
     * @brief List all topic ARNs
     */
    public listTopicArns() {
        let headers = this.headers.set('x-awsmock-target', 'sns').set('x-awsmock-action', 'list-topic-arns');
        return this.http.post(this.baseUrl, {}, {headers: headers});
    }

    /**
     * @brief Purges a topic, this will delete all the messages in the SNS topic.
     *
     * @param topicArn AWS topic ARN
     */
    public purgeTopic(topicArn: string) {
        let headers = this.headers.set('x-awsmock-target', 'sns').set('x-awsmock-action', 'PurgeTopic');
        return this.http.post(this.baseUrl, {topicArn: topicArn}, {headers: headers});
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
        return this.http.post(this.baseUrl, "TopicArn=" + topicArn + "&Endpoint=" + endpoint + "&Protocol=" + protocol, {headers: headers, responseType: 'text'});
    }

    /**
     * @brief Subscribe to a topic
     *
     * @param subscriptionArn subscription ARN
     */
    unsubscribe(subscriptionArn: string) {
        let headers = this.headers.set('x-awsmock-target', 'sns').set('x-awsmock-action', 'Unsubscribe');
        return this.http.post(this.baseUrl, "SubscriptionArn=" + subscriptionArn, {headers: headers, responseType: 'text'});
    }

    /**
     * @brief Subscribe to a topic
     *
     * @param topicArn topic ARN
     * @param subscriptionArn topic ARN
     * @param endpoint subscription endpoint
     * @param protocol subscription protocol
     */
    updateSubscription(topicArn: string, subscriptionArn: string, endpoint: string, protocol: string) {
        let headers = this.headers.set('x-awsmock-target', 'sns').set('x-awsmock-action', 'UpdateSubscription');
        return this.http.post(this.baseUrl, {topicArn: topicArn, subscriptionArn: subscriptionArn, endpoint: endpoint, protocol: protocol}, {headers: headers});
    }

    /**
     * @brief Publish a new message to the topic
     *
     * @param topicArn AWS topic ARN
     * @param message message body
     * @param attributes message attributes
     */
    publishMessage(topicArn: string, message: string, attributes: SnsMessageAttribute[]) {
        let headers = this.headers.set('x-awsmock-target', 'sns').set('x-awsmock-action', 'Publish');
        let queryString: string = "&TopicArn=" + encodeURI(topicArn) + "&Message=" + encodeURI(message);
        for (let i = 0; i < attributes.length; i++) {
            queryString += "&MessageAttributes.entry." + (i + 1) + ".Name=" + encodeURI(attributes[i].Key);
            queryString += "&MessageAttributes.entry." + (i + 1) + ".Value.DataType=" + encodeURI(attributes[i].DataType);
            queryString += "&MessageAttributes.entry." + (i + 1) + ".Value.StringValue=" + encodeURI(attributes[i].Value);
        }
        return this.http.post(this.baseUrl, queryString, {headers: headers, responseType: 'text'});
    }

    /**
     * @brief Purges a topic, this will delete all the messages in the SNS topic.
     *
     * @param topicArn SNS topic ARN
     * @param messageId SNS message ID
     */
    public deleteMessage(topicArn: string, messageId: string) {
        let headers = this.headers.set('x-awsmock-target', 'sns').set('x-awsmock-action', 'DeleteMessage');
        return this.http.post(this.baseUrl, {topicArn: topicArn, messageId: messageId}, {headers: headers, responseType: 'text'});
    }

    /**
     * @brief Returns the topic details
     *
     * @param topicArn AWS topic ARN
     */
    public getTopicDetails(topicArn: string) {
        let headers = this.headers.set('x-awsmock-target', 'sns').set('x-awsmock-action', 'GetTopicDetails');
        return this.http.post(this.baseUrl, {topicArn: topicArn}, {headers: headers});
    }

    /**
     * @brief Delete a topic
     *
     * @param topicArn AWS topic ARN
     */
    deleteTopic(topicArn: string) {
        let headers = this.headers.set('x-awsmock-target', 'sns').set('x-awsmock-action', 'DeleteTopic');
        return this.http.post(this.baseUrl, "TopicArn=" + topicArn, {headers: headers, responseType: 'text'});
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
        return this.http.post(this.baseUrl, {topicArn: topicArn, pageSize: pageSize, pageIndex: pageIndex, sortColumns: sortColumns}, {headers: headers});
    }

    /**
     * @brief Add a tag to a topic
     *
     * @param topicArn topic ARN
     * @param key tag key
     * @param value tag value
     */
    addTag(topicArn: string, key: string, value: string) {
        let headers = this.headers.set('x-awsmock-target', 'sns').set('x-awsmock-action', 'TagResource');
        return this.http.post(this.baseUrl, "ResourceArn=" + topicArn + "&Tags.member.1.Key=" + key + "&Tags.member.1.Value=" + value, {headers: headers, responseType: 'text'});
    }

    /**
     * @brief Gets a list of tags for a topic
     *
     * @param topicArn topic ARN
     * @param pageSize page size
     * @param pageIndex page index
     * @param sortColumns sorting columns
     */
    public listTagCounters(topicArn: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.headers.set('x-awsmock-target', 'sns').set('x-awsmock-action', 'ListTagCounters');
        return this.http.post(this.baseUrl, {topicArn: topicArn, pageSize: pageSize, pageIndex: pageIndex, sortColumns: sortColumns}, {headers: headers});
    }

    /**
     * @brief Delete a topic tag
     *
     * @param topicArn topic ARN
     * @param key tag key
     */
    deleteTag(topicArn: string, key: string) {
        let headers = this.headers.set('x-awsmock-target', 'sns').set('x-awsmock-action', 'UntagResource');
        return this.http.post(this.baseUrl, "ResourceArn=" + topicArn + "&TagKeys.TagKey.1=" + key, {headers: headers, responseType: 'text'});
    }

    /**
     * @brief Gets a list of attributes for a topic
     *
     * @param topicArn topic ARN
     * @param pageSize page size
     * @param pageIndex page index
     * @param sortColumns sorting columns
     */
    public listAttributeCounters(topicArn: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.headers.set('x-awsmock-target', 'sns').set('x-awsmock-action', 'ListAttributeCounters');
        return this.http.post(this.baseUrl, {topicArn: topicArn, pageSize: pageSize, pageIndex: pageIndex, sortColumns: sortColumns}, {headers: headers});
    }

    /**
     * @brief Delete a topic attribute
     *
     * @param topicArn topic ARN
     * @param key attribute key
     */
    deleteAttribute(topicArn: string, key: string) {
        let headers = this.headers.set('x-awsmock-target', 'sns').set('x-awsmock-action', 'DeleteAttribute');
        return this.http.post(this.baseUrl, "ResourceArn=" + topicArn + "&AttributeKeys.AttributeKey.1=" + key, {headers: headers, responseType: 'text'});
    }
}