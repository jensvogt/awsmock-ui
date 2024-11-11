// Angular Modules
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from "../../../../environments/environment";
import {SortColumn} from "../../../shared/sorting/sorting.component";

@Injectable()
export class CognitoService {

    // Default headers for AwsMock HTTP requests
    headers: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'AWS4-HMAC-SHA256 Credential=none/20240928/eu-central-1/s3/aws4_request, SignedHeaders=content-type;host;x-amz-date;x-amz-security-token;x-amz-target, Signature=01316d694335ec0e0bf68b08570490f1b0bae0b130ecbe13ebad511b3ece8a41'
    });
    url: string = environment.gatewayEndpoint + '/';

    constructor(private http: HttpClient) {
    }

    /**
     * This is a fake AWS NodeJS SDK request. This will only work, if runs against a AwsMock instance.
     */
    public listUserPoolCounters(prefix: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.headers.set('x-awsmock-target', 'cognito').set('x-awsmock-action', 'ListUserPools');
        const body = {
            region: environment.awsmockRegion,
            prefix: prefix,
            pageSize: pageSize,
            pageIndex: pageIndex,
            sortColumns: sortColumns
        }
        return this.http.post(this.url, body, {headers: headers});
    }

    public listUsers(userPoolId: string, maxResults: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.headers.set('x-awsmock-target', 'cognito').set('x-awsmock-action', "ListUsers");
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
        let headers = this.headers.set('x-awsmock-target', 'cognito').set('x-awsmock-action', "DeleteUserPool");
        const body = {
            Region: environment.awsmockRegion,
            UserPoolId: userPoolId
        }
        return this.http.post(this.url, body, {headers: headers});
    }

    public deleteUser(userPoolId: string, userName: string) {
        let headers = this.headers.set('x-awsmock-target', 'cognito').set('x-awsmock-action', "AdminDeleteUser");
        const body = {
            Region: environment.awsmockRegion,
            UserPoolId: userPoolId,
            Username: userName
        }
        return this.http.post(this.url, body, {headers: headers});
    }

    public createUserPool(userPoolName: string) {
        let headers = this.headers.set('x-awsmock-target', 'cognito').set('x-awsmock-action', "CreateUserPool");
        const body = {
            Region: environment.awsmockRegion,
            PoolName: userPoolName
        }
        return this.http.post(this.url, body, {headers: headers});
    }

    public createUser(userPoolId: string, userName: string) {
        let headers = this.headers.set('x-awsmock-target', 'cognito').set('x-awsmock-action', "AdminCreateUser");
        const body = {
            Region: environment.awsmockRegion,
            Username: userName,
            UserPoolId: userPoolId
        }
        return this.http.post(this.url, body, {headers: headers});
    }
}
