import {BsonDateTime} from "../../../shared/format/bson-datetime.component";

export interface UserItem {
    Id: string | undefined;
    Username: string | undefined;
    UserPoolId: string | undefined;
    Enabled: boolean | undefined;
    UserStatus: string | undefined;
    Password: string | undefined;
    Created: BsonDateTime;
    Modified: BsonDateTime;
}

export interface UserCountersResponse {
    total: number | undefined;
    users: UserItem[];
}
