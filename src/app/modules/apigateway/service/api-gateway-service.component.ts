import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {SortColumn} from "../../../shared/sorting/sorting.component";
import {AddApiKeyRequest, ApiKeyUpdateRequest} from "../model/api-key-item";
import {AddRestApiRequest, RestApiUpdateRequest} from "../model/rest-api-item";

@Injectable({providedIn: 'root'})
export class ApiGatewayService {

    // Default headers for AwsMock HTTP requests
    baseUrl: string = <string>localStorage.getItem("backendUrl");
    user: string = <string>localStorage.getItem("user");
    region: string = <string>localStorage.getItem("region");
    headers: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'AWS4-HMAC-SHA256 Credential=none/20240928/' + this.region + '/apigateway/aws4_request, SignedHeaders=content-type;host;x-amz-date;x-amz-security-token;x-amz-target, Signature=01316d694335ec0e0bf68b08570490f1b0bae0b130ecbe13ebad511b3ece8a41'
    });

    constructor(private readonly http: HttpClient) {
    }

    /**
     * @brief List all api keys
     *
     * @param prefix api key name prefix
     * @param pageSize page size
     * @param pageIndex page index
     * @param sortColumns sorting columns
     */
    public listApiKeyCounters(prefix: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.headers.set('x-awsmock-target', 'apigateway').set('x-awsmock-action', 'list-api-key-counters');
        return this.http.post(this.baseUrl, {prefix: prefix, pageSize: pageSize, pageIndex: pageIndex, sortColumns: sortColumns}, {headers: headers});
    }

    /**
     * @brief Adds a new api keys
     *
     * @param addApiKeyRequest add API key request
     */
    public addApiKey(addApiKeyRequest: AddApiKeyRequest) {
        let headers = this.headers.set('x-awsmock-target', 'apigateway').set('x-awsmock-action', 'create-api-key');
        return this.http.post(this.baseUrl, addApiKeyRequest, {headers: headers});
    }

    /**
     * @brief Update an API key
     *
     * @param request update key request
     */
    public updateApiKey(request: ApiKeyUpdateRequest) {
        let headers = this.headers.set('x-awsmock-target', 'apigateway').set('x-awsmock-action', 'update-api-key-counter');
        return this.http.post(this.baseUrl, {apiKey: request.apiKey}, {headers: headers});
    }

    /**
     * @brief Delete an API key
     *
     * @param id API key ID
     */
    public deleteApiKey(id: string) {
        let headers = this.headers.set('x-awsmock-target', 'apigateway').set('x-awsmock-action', 'delete-api-key');
        return this.http.delete(this.baseUrl + '/apikeys/' + id, {headers: headers});
    }

    /**
     * @brief Delete an API key
     *
     * @param id API key ID
     */
    public getApiKeyDetails(id: string) {
        let headers = this.headers.set('x-awsmock-target', 'apigateway').set('x-awsmock-action', 'get-api-key-counter');
        return this.http.post(this.baseUrl, {id: id}, {headers: headers});
    }


    /**
     * @brief List all api keys
     *
     * @param prefix api key name prefix
     * @param pageSize page size
     * @param pageIndex page index
     * @param sortColumns sorting columns
     */
    public listRestApiCounters(prefix: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.headers.set('x-awsmock-target', 'apigateway').set('x-awsmock-action', 'list-rest-api-counters');
        return this.http.post(this.baseUrl, {prefix: prefix, pageSize: pageSize, pageIndex: pageIndex, sortColumns: sortColumns}, {headers: headers});
    }

    /**
     * @brief Adds a new api keys
     *
     * @param addRestApiRequest add API key request
     */
    public addRestApi(addRestApiRequest: AddRestApiRequest) {
        let headers = this.headers.set('x-awsmock-target', 'apigateway').set('x-awsmock-action', 'create-rest-api');
        return this.http.post(this.baseUrl, addRestApiRequest, {headers: headers});
    }

    /**
     * @brief Update an API key
     *
     * @param request update key request
     */
    public updateRestApi(request: RestApiUpdateRequest) {
        let headers = this.headers.set('x-awsmock-target', 'apigateway').set('x-awsmock-action', 'update-rest-api-counter');
        return this.http.post(this.baseUrl, {restApi: request.restApi}, {headers: headers});
    }

    /**
     * @brief Delete an API key
     *
     * @param id API key ID
     */
    public deleteRestApi(id: string) {
        let headers = this.headers.set('x-awsmock-target', 'apigateway').set('x-awsmock-action', 'delete-rest-api');
        return this.http.delete(this.baseUrl + '/restApis/' + id, {headers: headers});
    }
}