// Angular Modules
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from "../../../../environments/environment";
import {SortColumn} from "../../../shared/sorting/sorting.component";
import {Attribute, PutItemRequest} from "../model/item-item";
import {CreateTableRequest} from "../model/table-item";

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

    public listTableCounters(prefix: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.headers.set('x-awsmock-target', 'dynamodb').set('x-awsmock-action', "ListTableCounters");
        const body = {
            Region: environment.awsmockRegion,
            Prefix: prefix,
            PageSize: pageSize,
            PageIndex: pageIndex,
            SortColumns: sortColumns
        }
        return this.http.post(this.url, body, {headers: headers});
    }

    public deleteTable(tableName: string) {
        let headers = this.headers.set('x-awsmock-target', 'dynamodb').set('x-awsmock-action', "DeleteTable");
        const body = {
            Region: environment.awsmockRegion,
            TableName: tableName
        }
        return this.http.post(this.url, body, {headers: headers});
    }

    public createTable(request: CreateTableRequest) {
        let headers = this.headers.set('x-awsmock-target', 'dynamodb').set('x-awsmock-action', "CreateTable");
        return this.http.post(this.url, request, {headers: headers});
    }

    public getTable(tableId: string, userName: string) {
        let headers = this.headers.set('x-awsmock-target', 'dynamodb').set('x-awsmock-action', "GetTableDetails");
        const body = {
            Region: environment.awsmockRegion,
            Username: userName,
            TableId: tableId
        }
        return this.http.post(this.url, body, {headers: headers});
    }

    public listItemCounters(tableName: string, prefix: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.headers.set('x-awsmock-target', 'dynamodb').set('x-awsmock-action', "ListItemCounters");
        const body = {
            tegion: environment.awsmockRegion,
            tableName: tableName,
            prefix: prefix,
            pageSize: pageSize,
            pageIndex: pageIndex,
            sortColumns: sortColumns
        }
        return this.http.post(this.url, body, {headers: headers});
    }

    public putItem(request: PutItemRequest) {
        let headers = this.headers.set('x-awsmock-target', 'dynamodb').set('x-awsmock-action', "PutItem");
        console.log("PutItemRequest: ", request);
        return this.http.post(this.url, request, {headers: headers});
    }

    public getItem(tableName: string) {
        let headers = this.headers.set('x-awsmock-target', 'dynamodb').set('x-awsmock-action', "GetItem");
        const body = {
            Region: environment.awsmockRegion,
            PoolName: tableName
        }
        return this.http.post(this.url, body, {headers: headers});
    }

    public deleteItem(tableName: string, keys: Attribute[] | undefined) {
        let headers = this.headers.set('x-awsmock-target', 'dynamodb').set('x-awsmock-action', "DeleteItem");
        const body = {
            Region: environment.awsmockRegion,
            TableName: tableName,
            Key: keys
        }
        return this.http.post(this.url, body, {headers: headers});
    }
}
