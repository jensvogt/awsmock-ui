// Angular Modules
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from "../../environments/environment";
import {S3Config, SnsConfig, SqsConfig} from "./awsmock-http-config";

@Injectable()
export class AwsMockHttpService {

    S3Config = new S3Config;
    SqsConfig = new SqsConfig;
    SnsConfig = new SnsConfig;
    url: string = environment.gatewayEndpoint + '/';

    constructor(private http: HttpClient) {
    }
}
