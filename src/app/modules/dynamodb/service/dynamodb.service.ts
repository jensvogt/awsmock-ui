// Angular Modules
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from "../../../../environments/environment";
import {SortColumn} from "../../../shared/sorting/sorting.component";

@Injectable()
export class DynamodbService {

    // Default headers for AwsMock HTTP requests
    headers: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'AWS4-HMAC-SHA256 Credential=none/20240928/eu-central-1/dynamodb/aws4_request, SignedHeaders=content-type;host;x-amz-date;x-amz-security-token;x-amz-target, Signature=01316d694335ec0e0bf68b08570490f1b0bae0b130ecbe13ebad511b3ece8a41'
    });
    url: string = environment.gatewayEndpoint + '/';

    constructor(private http: HttpClient) {
    }

    public listTableCounters(tableId: string, maxResults: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.headers.set('x-awsmock-target', 'dynamodb').set('x-awsmock-action', "ListTableCounters");
        const body = {
            Region: environment.awsmockRegion,
            TableId: tableId,
            MaxResults: maxResults,
            PageIndex: pageIndex,
            SortColumns: sortColumns
        }
        return this.http.post(this.url, body, {headers: headers});
    }

    public deleteTable(tableId: string) {
        let headers = this.headers.set('x-awsmock-target', 'dynamodb').set('x-awsmock-action', "DeleteTable");
        const body = {
            Region: environment.awsmockRegion,
            TableId: tableId
        }
        return this.http.post(this.url, body, {headers: headers});
    }

    public createTable(tableName: string) {
        let headers = this.headers.set('x-awsmock-target', 'dynamodb').set('x-awsmock-action', "create-user-pool");
        const body = {
            Region: environment.awsmockRegion,
            PoolName: tableName
        }
        return this.http.post(this.url, body, {headers: headers});
    }

    public getTable(tableId: string, userName: string) {
        let headers = this.headers.set('x-awsmock-target', 'dynamodb').set('x-awsmock-action', "admin-get-user");
        const body = {
            Region: environment.awsmockRegion,
            Username: userName,
            TableId: tableId
        }
        return this.http.post(this.url, body, {headers: headers});
    }
}
