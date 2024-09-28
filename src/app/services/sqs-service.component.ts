import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {
    CreateQueueCommand,
    DeleteQueueCommand,
    GetQueueAttributesCommand,
    ListQueuesCommand,
    PurgeQueueCommand,
    QueueAttributeName,
    SQSClient
} from "@aws-sdk/client-sqs";

@Injectable({providedIn: 'root'})
export class SqsService {

    client = new SQSClient({
        region: environment.awsmockRegion,
        endpoint: environment.awsmockEndpoint,
        credentials: {
            accessKeyId: 'test',
            secretAccessKey: 'test',
        },
        requestHandler: {
            requestTimeout: 3_000,
            httpsAgent: {maxSockets: 25},
        },
    });

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
            AttributeNames: [QueueAttributeName.ApproximateNumberOfMessages, QueueAttributeName.ApproximateNumberOfMessagesNotVisible],
        };
        return this.client.send(new GetQueueAttributesCommand(input));
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

    cleanup() {
        this.client.destroy();
    }
}