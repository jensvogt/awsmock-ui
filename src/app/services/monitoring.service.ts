// Angular Modules
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from "../../environments/environment";
import {MonitoringConfig} from "./awsmock-http-config";
import {formatDate} from "@angular/common";

@Injectable()
export class AwsMockMonitoringService {

    monitoringConfig = new MonitoringConfig;
    url: string = environment.gatewayEndpoint + '/';

    constructor(private http: HttpClient) {
    }

    /**
     * This is a fake AWS NodeJS SDK request. This will only work, if runs against a AwsMock instance.
     */
    public getCounters(name: string, start: Date, end: Date, step: number) {
        let headers = this.monitoringConfig.monitoringHttpOptions.headers.set('X-AwsMock-Target', "get-counters");
        const body = {
            region: environment.awsmockRegion,
            name: name,
            start: formatDate(start, 'yyyy-MM-ddTHH:mm:ss', 'de-De'),
            end: formatDate(end, 'yyyy-MM-ddTHH:mm:ss', 'de-De'),
            step: step
        }
        return this.http.post(this.url, body, {headers: headers});
    }
}
