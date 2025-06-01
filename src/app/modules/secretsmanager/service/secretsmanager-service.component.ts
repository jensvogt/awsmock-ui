import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Store} from "@ngrx/store";
import {RootState} from "../../../state/root.reducer";
import {SortColumn} from "../../../shared/sorting/sorting.component";

@Injectable({providedIn: 'root'})
export class SecretsmanagerService {

    // Default headers for AwsMock HTTP requests
    headers: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'AWS4-HMAC-SHA256 Credential=none/20240928/eu-central-1/secretsmanager/aws4_request, SignedHeaders=content-type;host;x-amz-date;x-amz-security-token;x-amz-target, Signature=01316d694335ec0e0bf68b08570490f1b0bae0b130ecbe13ebad511b3ece8a41'
    });

    constructor(private readonly http: HttpClient, private readonly store: Store<RootState>) {
    }

    /**
     * @brief Creates a new secret
     *
     * @param request secrets create request
     */
    public createSecret(request: any) {
        console.log("Create secret request", request);
        let headers = this.headers.set('x-awsmock-target', 'secretsmanager').set('x-awsmock-action', 'CreateSecret');
        return this.http.post(<string>localStorage.getItem('backendUrl'), request, {headers: headers});
    }

    /**
     * @brief List all secret ARNs
     */
    public listSecretCounters(prefix: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.headers.set('x-awsmock-target', 'secretsmanager').set('x-awsmock-action', 'ListSecretCounters');
        return this.http.post(<string>localStorage.getItem('backendUrl'), {prefix: prefix, pageSize: pageSize, pageIndex: pageIndex, sortColumns: sortColumns}, {headers: headers});
    }

    /**
     * @brief List all secret ARNs
     */
    public deleteSecret(secretId: string) {
        let headers = this.headers.set('x-awsmock-target', 'secretsmanager').set('x-awsmock-action', 'DeleteSecret');
        return this.http.post(<string>localStorage.getItem('backendUrl'), {SecretId: secretId}, {headers: headers});
    }

    /**
     * @brief Get the details of a secret
     */
    public getSecretDetails(secretId: string) {
        let headers = this.headers.set('x-awsmock-target', 'secretsmanager').set('x-awsmock-action', 'GetSecretDetails');
        return this.http.post(<string>localStorage.getItem('backendUrl'), {SecretId: secretId}, {headers: headers});
    }

    /**
     * @brief List all secret versions
     */
    public listSecretVersionCounters(secretId: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.headers.set('x-awsmock-target', 'secretsmanager').set('x-awsmock-action', 'ListSecretVersions');
        return this.http.post(<string>localStorage.getItem('backendUrl'), {secretId: secretId, pageSize: pageSize, pageIndex: pageIndex, sortColumns: sortColumns}, {headers: headers});
    }
}