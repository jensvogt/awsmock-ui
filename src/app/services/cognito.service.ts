// Angular Modules
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from "../../environments/environment";
import {CognitoConfig} from "./awsmock-http-config";
import {SortColumn} from "../shared/sorting/sorting.component";

@Injectable()
export class AwsMockCognitoService {

    cognitoConfig = new CognitoConfig;
    url: string = environment.awsmockEndpoint + '/';

    constructor(private http: HttpClient) {
    }

    /**
     * This is a fake AWS NodeJS SDK request. This will only work, if runs against a AwsMock instance.
     */
    public listUserPools(maxResults: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.cognitoConfig.cognitoOptions.headers.set('X-Amz-Target', "Cognito.ListUserPools");
        const body = {
            Region: environment.awsmockRegion,
            MaxResults: maxResults,
            PageIndex: pageIndex,
            sortColumns: sortColumns
        }
        return this.http.post(this.url, body, {headers: headers});
    }

    public deleteUserPool(userPoolId: string) {
        let headers = this.cognitoConfig.cognitoOptions.headers.set('X-Amz-Target', "Cognito.DeleteUserPool");
        const body = {
            Region: environment.awsmockRegion,
            UserPoolId: userPoolId
        }
        return this.http.post(this.url, body, {headers: headers});
    }

    public createUserPool(userPoolName: string) {
        let headers = this.cognitoConfig.cognitoOptions.headers.set('X-Amz-Target', "Cognito.CreateUserPool");
        const body = {
            Region: environment.awsmockRegion,
            PoolName: userPoolName
        }
        return this.http.post(this.url, body, {headers: headers});
    }
}
