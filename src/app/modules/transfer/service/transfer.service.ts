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
     * @brief List all transfer server protocols
     *
     * @param serverId server ID
     * @param pageSize page size
     * @param pageIndex page index
     * @param sortColumns sorting columns
     */
    public listTransferServerProtocols(serverId: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.headers.set('X-Amz-Target', 'TransferService.ListProtocolCounters');
        return this.http.post(<string>localStorage.getItem('backendUrl'), {return: environment.awsmockRegion, serverId: serverId, pageSize: pageSize, pageIndex: pageIndex, sortColumns: sortColumns}, {headers: headers});
    }

    /**
     * @brief List all transfer servers
     *
     * @param serverId server ID
     * @param pageSize page size
     * @param pageIndex page index
     * @param sortColumns sorting columns
     */
    public listTransferServerTag(serverId: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.headers.set('X-Amz-Target', 'TransferService.ListTagCounters');
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
     * @brief Adds a user to a server
     *
     * @param serverId server ID
     * @param userName user name
     * @param password user password
     */
    public addUser(serverId: string, userName: string, password: string) {
        let headers = this.headers.set('X-Amz-Target', 'TransferService.CreateUser');
        return this.http.post(<string>localStorage.getItem('backendUrl'), {Region: environment.awsmockRegion, ServerId: serverId, UserName: userName, Password: password}, {headers: headers});
    }

    /**
     * @brief Adds a protocol to a server
     *
     * @param serverId server ID
     * @param protocol protocol name
     * @param port protocol port
     */
    public addProtocol(serverId: string, protocol: string, port: number) {
        let headers = this.headers.set('X-Amz-Target', 'TransferService.CreateProtocol');
        return this.http.post(<string>localStorage.getItem('backendUrl'), {Region: environment.awsmockRegion, ServerId: serverId, Protocol: protocol, Port: port}, {headers: headers});
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

    /**
     * @brief Delete a protocol from a server
     *
     * @param serverId server ID
     * @param protocol protocol name
     */
    public deleteProtocol(serverId: string, protocol: string) {
        let headers = this.headers.set('X-Amz-Target', 'TransferService.DeleteProtocol');
        return this.http.post(<string>localStorage.getItem('backendUrl'), {Region: environment.awsmockRegion, ServerId: serverId, Protocol: protocol}, {headers: headers});
    }

    /**
     * @brief Delete a tag from a server
     *
     * @param serverId server ID
     * @param key tag key
     */
    public deleteTag(serverId: string, key: string) {
        let headers = this.headers.set('X-Amz-Target', 'TransferService.DeleteTag');
        return this.http.post(<string>localStorage.getItem('backendUrl'), {Region: environment.awsmockRegion, ServerId: serverId, Key: key}, {headers: headers});
    }

}