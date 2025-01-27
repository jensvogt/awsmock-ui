import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {LambdaClient} from "@aws-sdk/client-lambda";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {SortColumn} from "../../../shared/sorting/sorting.component";
import {CreateFunctionRequest} from "../model/function-item";


@Injectable({providedIn: 'root'})
export class LambdaService {

    // S3 client for AWS calls
    client = new LambdaClient({
        region: environment.awsmockRegion,
        endpoint: environment.gatewayEndpoint,
        credentials: {
            accessKeyId: 'none',
            secretAccessKey: 'none',
        },
        requestHandler: {
            requestTimeout: 3_000,
            httpsAgent: {maxSockets: 25, keepAlive: false},
        },
    });

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
     * @param name function name
     */
    public getFunction(name: string) {
        let headers = this.headers.set('x-awsmock-target', 'lambda').set('x-awsmock-action', 'GetFunctionCounters');
        const body = {
            region: environment.awsmockRegion,
            functionName: name
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
     * @brief Deletes a function
     *
     * @param functionName function name
     */
    public deleteFunction(functionName: string) {
        let headers = this.headers.set('x-awsmock-target', 'lambda').set('x-awsmock-action', 'delete-upload');
        return this.http.post(this.url, {functionName: functionName}, {headers: headers});
    }
}