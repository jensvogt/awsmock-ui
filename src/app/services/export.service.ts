// Angular Modules
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from "../../environments/environment";
import {ManagerConfig} from "./awsmock-http-config";

@Injectable()
export class AwsMockExportService {

    managerConfig = new ManagerConfig;
    url: string = environment.managerEndpoint + '/?pretty=true';

    constructor(private http: HttpClient) {
    }

    /**
     * This is a fake AWS NodeJS SDK request. This will only work, if runs against a AwsMock instance.
     */
    public getInfrastructure() {
        let headers = this.managerConfig.managerHttpOptions.headers.set('Target', "manager").set('Action', 'export').set("pretty", "true");
        return this.http.get(this.url, {headers: headers});
    }
}
