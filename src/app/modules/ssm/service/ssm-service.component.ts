import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {SortColumn} from "../../../shared/sorting/sorting.component";

@Injectable({providedIn: 'root'})
export class SsmService {

    // Default headers for AwsMock HTTP requests
    baseUrl: string = <string>localStorage.getItem("backendUrl");
    user: string = <string>localStorage.getItem("user");
    region: string = <string>localStorage.getItem("region");
    headers: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'AWS4-HMAC-SHA256 Credential=none/20240928/' + this.region + '/ssm/aws4_request, SignedHeaders=content-type;host;x-amz-date;x-amz-security-token;x-amz-target, Signature=01316d694335ec0e0bf68b08570490f1b0bae0b130ecbe13ebad511b3ece8a41'
    });

    constructor(private readonly http: HttpClient) {
    }

    /**
     * @brief Get a parameter
     *
     * @param name parameter ARN
     * @param withDescription with description
     */
    public getParameter(name: string, withDescription: boolean = true) {
        let headers = this.headers.set('x-awsmock-target', 'ssm').set('x-awsmock-action', 'GetParameterCounter');
        return this.http.post(this.baseUrl, {name: name, withDescription: withDescription}, {headers: headers});
    }

    /**
     * @brief List all parameters
     *
     * @param prefix parameter name prefix
     * @param pageSize page size
     * @param pageIndex page index
     * @param sortColumns sorting columns
     */
    public listParameterCounters(prefix: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.headers.set('x-awsmock-target', 'ssm').set('x-awsmock-action', 'ListParameterCounters');
        return this.http.post(this.baseUrl, {prefix: prefix, pageSize: pageSize, pageIndex: pageIndex, sortColumns: sortColumns}, {headers: headers});
    }

    /**
     * @brief Delete a parameter, returns the updated list
     *
     * @param name parameter name
     * @param prefix parameter name prefix
     * @param pageSize page size
     * @param pageIndex page index
     * @param sortColumns sorting columns
     */
    public deleteParameter(name: string, prefix: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.headers.set('x-awsmock-target', 'ssm').set('x-awsmock-action', 'DeleteParameterCounter');
        return this.http.post(this.baseUrl, {name: name, prefix: prefix, pageSize: pageSize, pageIndex: pageIndex, sortColumns: sortColumns}, {headers: headers});
    }

}