import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {SortColumn} from "../../../shared/sorting/sorting.component";
import {DeleteServerCommand, ListServersCommand, TransferClient} from "@aws-sdk/client-transfer";

@Injectable({providedIn: 'root'})
export class TransferService {

    client = new TransferClient({
        region: environment.awsmockRegion,
        endpoint: environment.gatewayEndpoint,
        credentials: {
            accessKeyId: 'test',
            secretAccessKey: 'test',
        },
        requestHandler: {
            requestTimeout: 30_000,
            httpsAgent: {maxSockets: 25},
        },
    });

    // Default headers for AwsMock HTTP requests
    headers: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'AWS4-HMAC-SHA256 Credential=none/20240928/eu-central-1/transfer/aws4_request, SignedHeaders=content-type;host;x-amz-date;x-amz-security-token;x-amz-target, Signature=01316d694335ec0e0bf68b08570490f1b0bae0b130ecbe13ebad511b3ece8a41'
    });
    url: string = environment.gatewayEndpoint + '/';

    constructor(private http: HttpClient) {
    }

    listServers(pageIndex: number, pageSize: number, prefix: string): any {
        const input = {
            QueueNamePrefix: prefix,
            NextToken: (pageIndex * pageSize).toString(),
            MaxResults: pageSize,
        };
        return this.client.send(new ListServersCommand(input));
    }

    deleteServer(serverId: string): any {
        const input = {
            ServerId: serverId
        };
        return this.client.send(new DeleteServerCommand(input));
    }

    /**
     * @brief List all transfer servers
     *
     * @param prefix server name prefix
     * @param pageSize page size
     * @param pageIndex page index
     * @param sortColumns sorting columns
     */
    public listTransferServerCounters(prefix: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.headers.set('X-Amz-Target', 'TransferService.ListServerCounters');
        return this.http.post(this.url, {prefix: prefix, pageSize: pageSize, pageIndex: pageIndex, sortColumns: sortColumns}, {headers: headers});
    }

    /**
     * @brief Load a transfer server details
     *
     * @param serverId server ID
     */
    public loadTransferServerDetails(serverId: string) {
        let headers = this.headers.set('X-Amz-Target', 'TransferService.GetServerDetails');
        return this.http.post(this.url, {region: environment.awsmockRegion, serverId: serverId}, {headers: headers});
    }

    /**
     * @brief List all transfer servers
     *
     * @param serverId server ID
     * @param pageSize page size
     * @param pageIndex page index
     * @param sortColumns sorting columns
     */
    public listTransferServerUserCounters(serverId: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.headers.set('X-Amz-Target', 'TransferService.ListUserCounters');
        return this.http.post(this.url, {return: environment.awsmockRegion, serverId: serverId, pageSize: pageSize, pageIndex: pageIndex, sortColumns: sortColumns}, {headers: headers});
    }

    /**
     * @brief Delete a user from a server
     *
     * @param serverId server ID
     * @param userName user name
     */
    public deleteUser(serverId: string, userName: string) {
        let headers = this.headers.set('X-Amz-Target', 'TransferService.DeleteUser');
        return this.http.post(this.url, {Region: environment.awsmockRegion, ServerId: serverId, UserName: userName}, {headers: headers});
    }
}