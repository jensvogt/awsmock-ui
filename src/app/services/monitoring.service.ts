// Angular Modules
import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {MonitoringConfig} from "./awsmock-http-config";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class MonitoringService {

    monitoringConfig = new MonitoringConfig;

    constructor(private readonly http: HttpClient) {
    }

    /**
     * This is a fake AWS NodeJS SDK request. This will only work, if runs against a AwsMock instance.
     */
    public getCounters(name: string, start: Date, end: Date, step: number) {
        let headers = this.monitoringConfig.monitoringHttpOptions.headers.set('x-awsmock-target', "monitoring").set('x-awsmock-action', "get-counters");
        const body = {
            "region": environment.awsmockRegion,
            "name": name,
            "start": start.getTime(),
            "end": end.getTime(),
            "step": step
        }
        return this.http.post(<string>localStorage.getItem('backendUrl'), body, {headers: headers});
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
        return this.http.post(<string>localStorage.getItem('backendUrl'), body, {headers: headers});
    }
}
