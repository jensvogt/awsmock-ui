// Angular Modules
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from "../../../../environments/environment";
import {SortColumn} from "../../../shared/sorting/sorting.component";

@Injectable()
export class CognitoService {

    // Default headers for AwsMock HTTP requests
    baseUrl: string = <string>localStorage.getItem("backendUrl");
    user: string = <string>localStorage.getItem("user");
    region: string = <string>localStorage.getItem("region");
    headers: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'AWS4-HMAC-SHA256 Credential=none/20240928/' + this.region + 'eu-central-1/cognito-idp/aws4_request, SignedHeaders=content-type;host;x-amz-date;x-amz-security-token;x-amz-target, Signature=01316d694335ec0e0bf68b08570490f1b0bae0b130ecbe13ebad511b3ece8a41'
    });

    constructor(private readonly http: HttpClient) {
    }

    /**
     * This is a fake AWS NodeJS SDK request. This will only work, if runs against a AwsMock instance.
     */
    public listUserPoolCounters(prefix: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.headers.set('x-awsmock-target', 'cognito-idp').set('x-awsmock-action', 'ListUserPoolCounters');
        const body = {
            region: environment.awsmockRegion,
            prefix: prefix,
            pageSize: pageSize,
            pageIndex: pageIndex,
            sortColumns: sortColumns
        }
        return this.http.post(this.baseUrl, body, {headers: headers});
    }

    public listUserCounters(userPoolId: string, maxResults: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.headers.set('x-awsmock-target', 'cognito-idp').set('x-awsmock-action', "ListUserCounters");
        const body = {
            Region: environment.awsmockRegion,
            UserPoolId: userPoolId,
            MaxResults: maxResults,
            PageIndex: pageIndex,
            SortColumns: sortColumns
        }
        return this.http.post(this.baseUrl, body, {headers: headers});
    }

    public deleteUserPool(userPoolId: string) {
        let headers = this.headers.set('x-awsmock-target', 'cognito-idp').set('x-awsmock-action', "DeleteUserPool");
        const body = {
            Region: environment.awsmockRegion,
            UserPoolId: userPoolId
        }
        return this.http.post(this.baseUrl, body, {headers: headers});
    }

    public deleteUser(userPoolId: string, userName: string) {
        let headers = this.headers.set('x-awsmock-target', 'cognito-idp').set('x-awsmock-action', "AdminDeleteUser");
        const body = {
            Region: environment.awsmockRegion,
            UserPoolId: userPoolId,
            Username: userName
        }
        return this.http.post(this.baseUrl, body, {headers: headers});
    }

    public confirmUser(userPoolId: string, userName: string) {
        let headers = this.headers.set('x-awsmock-target', 'cognito-idp').set('x-awsmock-action', "admin-confirm-sign-up");
        const body = {
            Region: environment.awsmockRegion,
            UserPoolId: userPoolId,
            Username: userName
        }
        return this.http.post(this.baseUrl, body, {headers: headers});
    }

    public createUserPool(userPoolName: string) {
        let headers = this.headers.set('x-awsmock-target', 'cognito-idp').set('x-awsmock-action', "create-user-pool");
        const body = {
            Region: environment.awsmockRegion,
            PoolName: userPoolName
        }
        return this.http.post(this.baseUrl, body, {headers: headers});
    }

    public createUser(userPoolId: string, userName: string) {
        let headers = this.headers.set('x-awsmock-target', 'cognito-idp').set('x-awsmock-action', "admin-create-user");
        const body = {
            Region: environment.awsmockRegion,
            Username: userName,
            UserPoolId: userPoolId
        }
        return this.http.post(this.baseUrl, body, {headers: headers});
    }

    public getUser(userPoolId: string, userName: string) {
        let headers = this.headers.set('x-awsmock-target', 'cognito-idp').set('x-awsmock-action', "admin-get-user");
        const body = {
            Region: environment.awsmockRegion,
            Username: userName,
            UserPoolId: userPoolId
        }
        return this.http.post(this.baseUrl, body, {headers: headers});
    }
}
