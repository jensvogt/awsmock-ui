import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {SortColumn} from "../../../shared/sorting/sorting.component";
import {CreateFunctionRequest} from "../model/lambda-item";


@Injectable({providedIn: 'root'})
export class LambdaService {

    // Default headers for AwsMock HTTP requests
    headers: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'AWS4-HMAC-SHA256 Credential=none/20240928/eu-central-1/s3/aws4_request, SignedHeaders=content-type;host;x-amz-date;x-amz-security-token;x-amz-target, Signature=01316d694335ec0e0bf68b08570490f1b0bae0b130ecbe13ebad511b3ece8a41'
    });
    url: string = environment.gatewayEndpoint + '/';

    constructor(private http: HttpClient) {
    }

    /**
     * @brief List all function counters
     *
     * @param prefix bucket name prefix
     * @param pageSize page size
     * @param pageIndex page index
     * @param sortColumns sorting columns
     */
    public listFunctionCounters(prefix: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.headers.set('x-awsmock-target', 'lambda').set('x-awsmock-action', 'ListFunctionCounters');
        const body = {
            region: environment.awsmockRegion,
            prefix: prefix,
            maxResults: pageSize,
            skip: pageSize * pageIndex,
            sortColumns: sortColumns
        }
        return this.http.post(this.url, body, {headers: headers});
    }

    /**
     * @brief Get a single function counter
     *
     * @param functionArn function ARN
     */
    public getFunction(functionArn: string) {
        let headers = this.headers.set('x-awsmock-target', 'lambda').set('x-awsmock-action', 'GetFunctionCounters');
        const body = {
            functionArn: functionArn
        }
        return this.http.post(this.url, body, {headers: headers});
    }

    /**
     * @brief Reset the function counters
     *
     * @param name function name
     */
    public resetCounters(name: string) {
        let headers = this.headers.set('x-awsmock-target', 'lambda').set('x-awsmock-action', 'ResetFunctionCounters');
        const body = {
            region: environment.awsmockRegion,
            functionName: name
        }
        return this.http.post(this.url, body, {headers: headers});
    }

    /**
     * @brief Reset the function counters
     *
     * @param request create function request
     */
    public createFunction(request: CreateFunctionRequest) {
        let headers = this.headers.set('x-awsmock-target', 'lambda').set('x-awsmock-action', 'functions');
        return this.http.post(this.url + "2025-01-01/functions", request, {headers: headers});
    }

    /**
     * @brief Upload new function code
     *
     * @param functionArn lambda function AWS ARN
     * @param functionCode base64 encoded function code
     * @param version function code version
     */
    public uploadFunctionCode(functionArn: string, functionCode: string, version: string) {
        let headers = this.headers.set('x-awsmock-target', 'lambda').set('x-awsmock-action', 'upload-function-code');
        return this.http.post(this.url, {FunctionArn: functionArn, FunctionCode: functionCode, Version: version}, {headers: headers});
    }

    /**
     * @brief Gets a list of tags for a lambda function
     *
     * @param lambdaArn lambda ARN
     * @param pageSize page size
     * @param pageIndex page index
     * @param sortColumns sorting columns
     */
    public listEnvironmentCounters(lambdaArn: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.headers.set('x-awsmock-target', 'lambda').set('x-awsmock-action', 'ListEnvironmentCounters');
        return this.http.post(this.url, {lambdaArn: lambdaArn, pageSize: pageSize, pageIndex: pageIndex, sortColumns: sortColumns}, {headers: headers});
    }

    /**
     * @brief Gets a list of tags for a lambda function
     *
     * @param lambdaArn lambda ARN
     * @param pageSize page size
     * @param pageIndex page index
     * @param sortColumns sorting columns
     */
    public listTagCounters(lambdaArn: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.headers.set('x-awsmock-target', 'lambda').set('x-awsmock-action', 'ListTagCounters');
        return this.http.post(this.url, {lambdaArn: lambdaArn, pageSize: pageSize, pageIndex: pageIndex, sortColumns: sortColumns}, {headers: headers});
    }

    /**
     * @brief Deletes a function tag
     *
     * @param functionArn function name
     * @param key tag key
     * @param value tag value
     */
    public addTag(functionArn: string, key: string, value: string) {
        let headers = this.headers.set('x-awsmock-target', 'lambda').set('x-awsmock-action', 'add-function-tag');
        const body = {FunctionArn: functionArn, Key: key, Value: value}
        return this.http.post(this.url, body, {headers: headers});
    }

    /**
     * @brief Update a function tag
     *
     * @param functionArn function name
     * @param key tag key
     * @param value tag value
     */
    public updateTag(functionArn: string, key: string, value: string) {
        let headers = this.headers.set('x-awsmock-target', 'lambda').set('x-awsmock-action', 'update-function-tag');
        const body = {FunctionArn: functionArn, Key: key, Value: value}
        return this.http.post(this.url, body, {headers: headers});
    }

    /**
     * @brief Deletes a function tag
     *
     * @param functionArn function name
     * @param key tag key
     */
    public deleteTag(functionArn: string, key: string) {
        let headers = this.headers.set('x-awsmock-target', 'lambda').set('x-awsmock-action', 'delete-function-tag');
        const body = {FunctionArn: functionArn, Key: key}
        return this.http.post(this.url, body, {headers: headers});
    }

    /**
     * @brief Deletes a function
     *
     * @param functionName function name
     */
    public deleteFunction(functionName: string) {
        let headers = this.headers.set('x-awsmock-target', 'lambda').set('x-awsmock-action', 'delete-function');
        const body = {Region: environment.awsmockRegion, FunctionName: functionName}
        return this.http.post(this.url, body, {headers: headers});
    }
}