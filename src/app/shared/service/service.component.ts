import {HttpHeaders} from "@angular/common/http";

export class Service {

    // Default headers for AwsMock HTTP requests
    baseUrl: string = <string>localStorage.getItem("backendUrl");
    user: string = <string>localStorage.getItem("user");
    region: string = <string>localStorage.getItem("region");
    headers: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'x-awsmock-region': this.region,
        'x-awsmock-user': this.user,
    });
}