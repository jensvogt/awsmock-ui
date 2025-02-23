// Angular Modules
import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {MonitoringConfig} from "./awsmock-http-config";
import {HttpClient} from "@angular/common/http";
import {BackendService} from "./backend-service";

@Injectable()
export class MonitoringService {

    monitoringConfig = new MonitoringConfig;
    url: string = environment.gatewayEndpoint + '/';

    constructor(private http: HttpClient, private backendService: BackendService) {
        this.url = backendService.storeConfig.backendUrl = '/';
    }

    /**
     * This is a fake AWS NodeJS SDK request. This will only work, if runs against a AwsMock instance.
     */
    public getCounters(name: string, start: Date, end: Date, step: number) {
        let headers = this.monitoringConfig.monitoringHttpOptions.headers.set('x-awsmock-target', "monitoring").set('x-awsmock-action', "get-counters");
        const body = {
            region: environment.awsmockRegion,
            name: name,
            start: start.getTime(),
            end: end.getTime(),
            step: step
        }
        console.log("BackendURL:", this.url);
        return this.http.post(this.url, body, {headers: headers});
    }

    /**
     * This is a fake AWS NodeJS SDK request. This will only work, if runs against a AwsMock instance.
     */
    public getMultiCounters(name: string, labelName: string, start: Date, end: Date, step: number) {
        let headers = this.monitoringConfig.monitoringHttpOptions.headers.set('x-awsmock-target', "monitoring").set('x-awsmock-action', "get-multi-counters");
        const body = {
            region: environment.awsmockRegion,
            name: name,
            labelName: labelName,
            start: start.getTime(),
            end: end.getTime(),
            step: step
        }
        console.log("BackendURL:", this.url);
        return this.http.post(this.url, body, {headers: headers});
    }
}
