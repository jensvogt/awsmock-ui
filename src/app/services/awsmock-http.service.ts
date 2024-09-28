// Angular Modules
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from "../../environments/environment";

@Injectable()
export class AwsMockHttpService {

    constructor(private http: HttpClient) {
    }

    /**
     * This is a fake AWS NodeJS SDK request. This will only work, if run it against a AwsMock instance.
     */
    public getQueueArns() {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/x-amz-json-1.0');
        headers = headers.set('X-Amz-Target', 'AmazonSQS.GetQueueArns');
        headers = headers.set('Authorization', 'AWS4-HMAC-SHA256 Credential=none/20240928/eu-central-1/sqs/aws4_request, SignedHeaders=content-type;host;x-amz-date;x-amz-security-token;x-amz-target, Signature=01316d694335ec0e0bf68b08570490f1b0bae0b130ecbe13ebad511b3ece8a41');
        let url = environment.awsmockEndpoint + '/';
        return this.http.post(url, {}, {headers: headers});
    }

}
