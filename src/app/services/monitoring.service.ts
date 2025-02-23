// Angular Modules
import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {MonitoringConfig} from "./awsmock-http-config";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {selectBackendServer} from "../state/root.selector";
import {Store} from "@ngrx/store";
import {RootState} from "../state/root.reducer";

@Injectable()
export class MonitoringService {

    monitoringConfig = new MonitoringConfig;

    url$: Observable<string> = this.store.select(selectBackendServer);
    url: string = '';

    constructor(private readonly http: HttpClient, private readonly store: Store<RootState>) {
        this.url$.subscribe((data)=> {
            this.url = data;
            console.log('SQSService URL changed: ',this.url );
        });
    }

    /**
     * This is a fake AWS NodeJS SDK request. This will only work, if runs against a AwsMock instance.
     */
    public getCounters(name: string, start: Date, end: Date, step: number) {
        console.log("Single BackendURL:", this.url);
        let headers = this.monitoringConfig.monitoringHttpOptions.headers.set('x-awsmock-target', "monitoring").set('x-awsmock-action', "get-counters");
        const body = {
            region: environment.awsmockRegion,
            name: name,
            start: start.getTime(),
            end: end.getTime(),
            step: step
        }
        return this.http.post(this.url, body, {headers: headers});
    }

    /**
     * This is a fake AWS NodeJS SDK request. This will only work, if runs against a AwsMock instance.
     */
    public getMultiCounters(name: string, labelName: string, start: Date, end: Date, step: number) {
        console.log("Multi BackendURL:", this.url);
        let headers = this.monitoringConfig.monitoringHttpOptions.headers.set('x-awsmock-target', "monitoring").set('x-awsmock-action', "get-multi-counters");
        const body = {
            region: environment.awsmockRegion,
            name: name,
            labelName: labelName,
            start: start.getTime(),
            end: end.getTime(),
            step: step
        }
        return this.http.post(this.url, body, {headers: headers});
    }
}
