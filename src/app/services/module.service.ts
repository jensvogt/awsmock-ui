// Angular Modules
import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from "../../environments/environment";
import {ManagerConfig} from "./awsmock-http-config";
import {catchError, throwError} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable()
export class ModuleService {

    managerConfig = new ManagerConfig;
    url: string = environment.gatewayEndpoint + '/';

    constructor(private readonly http: HttpClient, private readonly snackBar: MatSnackBar) {
    }

    /**
     * @brief Returns the available modules names
     * This is a fake AWS NodeJS SDK request. This will only work, if runs against a AwsMock instance.
     */
    public getModuleList() {
        let headers = this.managerConfig.managerHttpOptions.headers.set('x-awsmock-target', 'module').set('x-awsmock-action', 'list-modules');
        return this.http.get(<string>localStorage.getItem('backendUrl'), {headers: headers}).pipe(catchError(this.handleError));
    }

    /**
     * This is a fake AWS NodeJS SDK request. This will only work, if runs against a AwsMock instance.
     */
    public exportInfrastructure(moduleList: string[], includeObjects: boolean, prettyPrint: boolean) {
        let body = {
            prettyPrint: prettyPrint,
            includeObjects: includeObjects,
            modules: moduleList
        }
        let headers = this.managerConfig.managerHttpOptions.headers.set('x-awsmock-target', 'module').set('x-awsmock-action', 'export');
        return this.http.post(<string>localStorage.getItem('backendUrl'), body, {headers: headers}).pipe(catchError(this.handleError));
    }

    /**
     * This is a fake AWS NodeJS SDK request. This will only work, if runs against a AwsMock instance.
     */
    public importInfrastructure(body: string) {
        let headers = this.managerConfig.managerHttpOptions.headers.set('x-awsmock-target', 'module').set('x-awsmock-action', 'import');
        return this.http.post(<string>localStorage.getItem('backendUrl'), body, {headers: headers}).pipe(catchError(this.handleError));
    }

    public cleanInfrastructure(body: any) {
        let headers = this.managerConfig.managerHttpOptions.headers.set('x-awsmock-target', 'module').set('x-awsmock-action', 'clean-objects');
        return this.http.post(<string>localStorage.getItem('backendUrl'), body, {headers: headers}).pipe(catchError(this.handleError));
    }

    public eraseInfrastructure(body: any) {
        let headers = this.managerConfig.managerHttpOptions.headers.set('x-awsmock-target', 'module').set('x-awsmock-action', 'erase-infrastructure');
        return this.http.post(<string>localStorage.getItem('backendUrl'), body, {headers: headers}).pipe(catchError(this.handleError));
    }

    public getConfig() {
        let headers = this.managerConfig.managerHttpOptions.headers.set('x-awsmock-target', 'module').set('x-awsmock-action', 'get-config');
        return this.http.get(<string>localStorage.getItem('backendUrl'), {headers: headers}).pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse) {
        if (error.status === 0) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error);
            this.snackBar.open("Network error, message: " + error.error, 'X', {duration: 5000, panelClass: 'error'})
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong.
            console.error(
                `Backend returned code ${error.status}, body was: `, error.error);
            this.snackBar.open("Backend return code: " + error.status + ", message: " + error.error, 'X', {duration: 5000, panelClass: 'error'})
        }
        // Return an observable with a user-facing error message.
        return throwError(() => new Error('Something bad happened; please try again later.'));
    }
}
