// Angular Modules
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from "../../environments/environment";
import {ManagerConfig} from "./awsmock-http-config";

@Injectable()
export class AwsMockExportService {

    managerConfig = new ManagerConfig;
    url: string = environment.gatewayEndpoint + '/';

    constructor(private http: HttpClient) {
    }

    /**
     * This is a fake AWS NodeJS SDK request. This will only work, if runs against a AwsMock instance.
     */
    public getInfrastructure() {
        let body = {
            prettyPrint: true,
            includeObjects: true,
            modules: ['s3', 'sqs', 'sns', 'kms', 'lambda', 'secretsmanager', 'cognito', 'ssm', 'dynamodb']
        }
        let headers = this.managerConfig.managerHttpOptions.headers.set('x-awsmock-target', 'module').set('x-awsmock-action', 'export');
        return this.http.post(this.url, body, {headers: headers});
    }
}
