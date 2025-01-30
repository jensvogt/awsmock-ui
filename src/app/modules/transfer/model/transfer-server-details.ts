import {BsonDateTime} from "../../../shared/format/bson-datetime.component";

export interface TransferServerDetails {
    Region: string;
    ServerId: string;
    Arn: string;
    Concurrency: number;
    Port: number;
    State: string;
    LastStarted: BsonDateTime;
    Created: BsonDateTime;
    Modified: BsonDateTime;
}

export interface TransferServerDetailsResponse {
    server: TransferServerDetails;
}
