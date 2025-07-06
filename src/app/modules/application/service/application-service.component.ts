import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {SortColumn} from "../../../shared/sorting/sorting.component";
import {AddApplicationRequest} from "../model/application-item";

@Injectable({providedIn: 'root'})
export class ApplicationService {

    // Default headers for AwsMock HTTP requests
    baseUrl: string = <string>localStorage.getItem("backendUrl");
    user: string = <string>localStorage.getItem("user");
    region: string = <string>localStorage.getItem("region");
    headers: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'AWS4-HMAC-SHA256 Credential=none/20240928/' + this.region + '/application/aws4_request, SignedHeaders=content-type;host;x-amz-date;x-amz-security-token;x-amz-target, Signature=01316d694335ec0e0bf68b08570490f1b0bae0b130ecbe13ebad511b3ece8a41'
    });

    constructor(private readonly http: HttpClient) {
    }

    /**
     * @brief List all applications
     *
     * @param prefix application name prefix
     * @param pageSize page size
     * @param pageIndex page index
     * @param sortColumns sorting columns
     */
    public listApplicationCounters(prefix: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.headers.set('x-awsmock-target', 'application').set('x-awsmock-action', 'list-applications');
        return this.http.post(this.baseUrl, {prefix: prefix, pageSize: pageSize, pageIndex: pageIndex, sortColumns: sortColumns}, {headers: headers});
    }

    /**
     * @brief Adds a new application
     *
     * @param request add application request
     */
    public addApplication(request: AddApplicationRequest) {
        let headers = this.headers.set('x-awsmock-target', 'application').set('x-awsmock-action', 'create-applications');
        return this.http.post(this.baseUrl, {request: request}, {headers: headers});
    }
}