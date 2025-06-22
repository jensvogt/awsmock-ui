import {Injectable} from "@angular/core";
import {SortColumn} from "../../../shared/sorting/sorting.component";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {KmsKeyAddRequest} from "../model/key-add-request";

@Injectable({providedIn: 'root'})
export class KmsService {

    // Default headers for AwsMock HTTP requests
    baseUrl: string = <string>localStorage.getItem("backendUrl");
    user: string = <string>localStorage.getItem("user");
    region: string = <string>localStorage.getItem("region");
    headers: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'AWS4-HMAC-SHA256 Credential=none/20240928/' + this.region + 'eu-central-1/kms/aws4_request, SignedHeaders=content-type;host;x-amz-date;x-amz-security-token;x-amz-target, Signature=01316d694335ec0e0bf68b08570490f1b0bae0b130ecbe13ebad511b3ece8a41'
    });

    constructor(private readonly http: HttpClient) {
    }

    /**
     * @brief Create a new key.
     *
     * @param request add key request
     */
    createKey(request: KmsKeyAddRequest) {
        let headers = this.headers.set('x-awsmock-target', 'kms').set('x-awsmock-action', 'create-key');
        return this.http.post(this.baseUrl, request, {headers: headers, responseType: 'text'});
    }

    /**
     * @brief List all keys
     *
     * @param prefix key name prefix
     * @param pageSize page size
     * @param pageIndex page index
     * @param sortColumns sorting columns
     */
    public listKeyCounters(prefix: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.headers.set('x-awsmock-target', 'kms').set('x-awsmock-action', 'list-key-counters');
        return this.http.post(this.baseUrl, {prefix: prefix, pageSize: pageSize, pageIndex: pageIndex, sortColumns: sortColumns}, {headers: headers});
    }

    /**
     * @brief Load key details
     *
     * @param keyId key ID
     */
    public getKeyDetails(keyId: string) {
        let headers = this.headers.set('x-awsmock-target', 'kms').set('x-awsmock-action', 'describe-key');
        return this.http.post(this.baseUrl, {KeyId: keyId}, {headers: headers});
    }

    /**
     * @brief Delete a key
     *
     * @param keyId key ID
     */
    deleteKey(keyId: string) {
        let headers = this.headers.set('x-awsmock-target', 'kms').set('x-awsmock-action', 'delete-key');
        return this.http.post(this.baseUrl, {keyId: keyId}, {headers: headers, responseType: 'text'});
    }
}