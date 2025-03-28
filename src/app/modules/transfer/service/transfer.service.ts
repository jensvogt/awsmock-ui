import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {SortColumn} from "../../../shared/sorting/sorting.component";

@Injectable({providedIn: 'root'})
export class TransferService {

    // Default headers for AwsMock HTTP requests
    headers: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'AWS4-HMAC-SHA256 Credential=none/20240928/eu-central-1/transfer/aws4_request, SignedHeaders=content-type;host;x-amz-date;x-amz-security-token;x-amz-target, Signature=01316d694335ec0e0bf68b08570490f1b0bae0b130ecbe13ebad511b3ece8a41'
    });

    constructor(private http: HttpClient) {
    }

    /**
     * @brief List all transfer servers
     *
     * @param prefix server name prefix
     * @param pageSize page size
     * @param pageIndex page index
     * @param sortColumns sorting columns
     */
    public listTransferServer(prefix: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.headers.set('X-Amz-Target', 'TransferService.ListServerCounters');
        return this.http.post(<string>localStorage.getItem('backendUrl'), {prefix: prefix, pageSize: pageSize, pageIndex: pageIndex, sortColumns: sortColumns}, {headers: headers});
    }

    /**
     * @brief Load a transfer server details
     *
     * @param serverId server ID
     */
    public loadTransferServerDetails(serverId: string) {
        let headers = this.headers.set('X-Amz-Target', 'TransferService.GetServerDetails');
        return this.http.post(<string>localStorage.getItem('backendUrl'), {region: environment.awsmockRegion, serverId: serverId}, {headers: headers});
    }

    /**
     * @brief List all transfer servers
     *
     * @param serverId server ID
     * @param pageSize page size
     * @param pageIndex page index
     * @param sortColumns sorting columns
     */
    public listTransferServerUser(serverId: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.headers.set('X-Amz-Target', 'TransferService.ListUserCounters');
        return this.http.post(<string>localStorage.getItem('backendUrl'), {return: environment.awsmockRegion, serverId: serverId, pageSize: pageSize, pageIndex: pageIndex, sortColumns: sortColumns}, {headers: headers});
    }

    /**
     * @brief Delete a server
     *
     * @param serverId server ID
     */
    public deleteServer(serverId: string) {
        let headers = this.headers.set('X-Amz-Target', 'TransferService.DeleteServer');
        return this.http.post(<string>localStorage.getItem('backendUrl'), {Region: environment.awsmockRegion, ServerId: serverId}, {headers: headers});
    }

    /**
     * @brief Delete a user from a server
     *
     * @param serverId server ID
     * @param userName user name
     */
    public deleteUser(serverId: string, userName: string) {
        let headers = this.headers.set('X-Amz-Target', 'TransferService.DeleteUser');
        return this.http.post(<string>localStorage.getItem('backendUrl'), {Region: environment.awsmockRegion, ServerId: serverId, UserName: userName}, {headers: headers});
    }
}