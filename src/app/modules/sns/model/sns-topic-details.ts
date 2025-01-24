import {BsonDateTime} from "../../../shared/format/bson-datetime.component";

export interface SnsTopicDetails {
    region: string;
    topicArn: string;
    topicName: string;
    topicUrl: string;
    owner: string;
    messageCount: number;
    size: number;
    created: BsonDateTime;
    modified: BsonDateTime;
}
