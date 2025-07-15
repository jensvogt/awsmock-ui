import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {SortColumn} from "../../../shared/sorting/sorting.component";
import {AddApplicationRequest, DeleteApplicationRequest, GetApplicationRequest, RebuildApplicationRequest, StartApplicationRequest, StopApplicationRequest, UpdateApplicationRequest} from "../model/application-item";

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
     * @brief List all application names
     */
    public listApplicationNames() {
        let headers = this.headers.set('x-awsmock-target', 'application').set('x-awsmock-action', 'list-application-names');
        return this.http.post(this.baseUrl, {}, {headers: headers});
    }

    /**
     * @brief Adds a new application
     *
     * @param request add application request
     */
    public getApplication(request: GetApplicationRequest) {
        let headers = this.headers.set('x-awsmock-target', 'application').set('x-awsmock-action', 'get-application');
        return this.http.post(this.baseUrl, request, {headers: headers});
    }

    /**
     * @brief Adds a new application
     *
     * @param request add application request
     */
    public addApplication(request: AddApplicationRequest) {
        let headers = this.headers.set('x-awsmock-target', 'application').set('x-awsmock-action', 'create-application');
        return this.http.post(this.baseUrl, request, {headers: headers});
    }

    /**
     * @brief Update an application
     *
     * @param request update application request
     * @return Get application response
     */
    public updateApplication(request: UpdateApplicationRequest) {
        request.application.region = this.region;
        let headers = this.headers.set('x-awsmock-target', 'application').set('x-awsmock-action', 'update-application');
        return this.http.post(this.baseUrl, request, {headers: headers});
    }

    /**
     * @brief Starts an application
     *
     * @param request start application request
     */
    public startApplication(request: StartApplicationRequest) {
        request.region = this.region;
        request.user = this.user;
        let headers = this.headers.set('x-awsmock-target', 'application').set('x-awsmock-action', 'start-application');
        return this.http.post(this.baseUrl, request, {headers: headers});
    }

    /**
     * @brief Stops an application
     *
     * @param request stop application request
     */
    public stopApplication(request: StopApplicationRequest) {
        request.region = this.region;
        request.user = this.user;
        let headers = this.headers.set('x-awsmock-target', 'application').set('x-awsmock-action', 'stop-application');
        return this.http.post(this.baseUrl, request, {headers: headers});
    }

    /**
     * @brief Rebuilds an application
     *
     * @param request stop application request
     */
    public rebuildApplication(request: RebuildApplicationRequest) {
        request.region = this.region;
        request.user = this.user;
        let headers = this.headers.set('x-awsmock-target', 'application').set('x-awsmock-action', 'rebuild-application');
        return this.http.post(this.baseUrl, request, {headers: headers});
    }

    /**
     * @brief Delete an  application
     *
     * @param request add application request
     */
    public deleteApplication(request: DeleteApplicationRequest) {
        let headers = this.headers.set('x-awsmock-target', 'application').set('x-awsmock-action', 'delete-application');
        return this.http.post(this.baseUrl, request, {headers: headers});
    }

    /**
     * @brief Upload new application code
     *
     * @param applicationName application name
     * @param applicationCode base64 encoded application code
     * @param version function code version
     */
    public uploadApplicationCode(applicationName: string, applicationCode: string, version: string) {
        let headers = this.headers.set('x-awsmock-target', 'application').set('x-awsmock-action', 'upload-application');
        /*        let headers: HttpHeaders = new HttpHeaders({
                    'x-awsmock-target': 'application',
                    'x-awsmock-action': 'upload-application',
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'AWS4-HMAC-SHA256 Credential=none/20240928/' + this.region + '/s3/aws4_request, SignedHeaders=content-type;host;x-amz-date;x-amz-security-token;x-amz-target, Signature=01316d694335ec0e0bf68b08570490f1b0bae0b130ecbe13ebad511b3ece8a41'
                });
                const formData = new FormData();
                formData.append('applicationName', applicationName);
                formData.append('applicationCode', applicationCode);
                formData.append('version', version);
                return this.http.post<any>(this.baseUrl, formData, {headers: headers});*/
        return this.http.post<any>(this.baseUrl, {applicationName: applicationName, applicationCode: applicationCode, version: version}, {headers: headers});
    }

    /**
     * @brief Delete an application environment variable
     *
     * @param name application name
     * @param key environment variable name
     */
    public deleteEnvironment(name: string, key: string) {
        let headers = this.headers.set('x-awsmock-target', 'application').set('x-awsmock-action', 'delete-application');
        return this.http.post(this.baseUrl, {name: name, key: key}, {headers: headers});
    }
}