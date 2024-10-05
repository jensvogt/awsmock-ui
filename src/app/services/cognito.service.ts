// Angular Modules
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from "../../environments/environment";
import {CognitoConfig} from "./awsmock-http-config";
import {SortColumn} from "../shared/sorting/sorting.component";

@Injectable()
export class AwsMockCognitoService {

    cognitoConfig = new CognitoConfig;
    url: string = environment.gatewayEndpoint + '/';

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

    public listUsers(userPoolId: string, maxResults: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.cognitoConfig.cognitoOptions.headers.set('X-Amz-Target', "Cognito.ListUsers");
        const body = {
            Region: environment.awsmockRegion,
            UserPoolId: userPoolId,
            MaxResults: maxResults,
            PageIndex: pageIndex,
            SortColumns: sortColumns
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

    public deleteUser(userPoolId: string, userName: string) {
        let headers = this.cognitoConfig.cognitoOptions.headers.set('X-Amz-Target', "Cognito.AdminDeleteUser");
        const body = {
            Region: environment.awsmockRegion,
            UserPoolId: userPoolId,
            Username: userName
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

    public createUser(userPoolId: string, userName: string) {
        let headers = this.cognitoConfig.cognitoOptions.headers.set('X-Amz-Target', "Cognito.AdminCreateUser");
        const body = {
            Region: environment.awsmockRegion,
            Username: userName,
            UserPoolId: userPoolId
        }
        return this.http.post(this.url, body, {headers: headers});
    }
}
