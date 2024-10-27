import {Injectable} from "@angular/core";
import {CreateTopicCommand, DeleteTopicCommand, ListTopicsCommand, SNSClient, SubscribeCommand} from "@aws-sdk/client-sns";
import {environment} from "../../environments/environment";

@Injectable()
export class SnsService {

    client = new SNSClient({
        region: environment.awsmockRegion,
        endpoint: environment.gatewayEndpoint,
        credentials: {
            accessKeyId: 'test',
            secretAccessKey: 'test',
        },
        requestHandler: {
            requestTimeout: 3_000,
            httpsAgent: {maxSockets: 25, keepAlive: false},
        },
    });

    listTopics(pageIndex: number, pageSize: number): any {

        const input = {
            NextToken: (pageIndex * pageSize).toString(),
            MaxResults: pageSize,
        };
        return this.client.send(new ListTopicsCommand(input));
    }

    saveTopic(topicName: string) {
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

    publishMessage(topicArn: string, body: string) {
        /*        const input = {
                    TopicArn: topicArn,
                    ReturnSubscriptionArn: true
                };
                return this.client.send(new SubscribeCommand(input));*/
    }

    cleanup() {
        this.client.destroy();
    }
}