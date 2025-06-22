import {Injectable} from "@angular/core";
import {SortColumn} from "../../../shared/sorting/sorting.component";
import {HttpClient, HttpHeaders} from "@angular/common/http";

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
     * @brief Create a new topic.
     *
     * @param topicName topic name
     */

    /*createTopic(topicName: string) {
        let headers = this.headers.set('x-awsmock-target', 'sns').set('x-awsmock-action', 'CreateTopic');
        return this.http.post(this.baseUrl, "Name=" + topicName, {headers: headers, responseType: 'text'});
    }*/

    /**
     * @brief List all keys
     *
     * @param prefix key name prefix
     * @param pageSize page size
     * @param pageIndex page index
     * @param sortColumns sorting columns
     */
    public listKeyCounters(prefix: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.headers.set('x-awsmock-target', 'kms').set('x-awsmock-action', 'ListKeyCounters');
        return this.http.post(this.baseUrl, {prefix: prefix, pageSize: pageSize, pageIndex: pageIndex, sortColumns: sortColumns}, {headers: headers});
    }

}