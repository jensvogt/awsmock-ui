
import { Injectable } from '@angular/core';
import { ConfigState } from '../models/config.state';
import { BehaviorSubject } from 'rxjs';

export class ConfigState {
    backendUrl: string = 'http://localhost:4567'
}

@Injectable({
    providedIn: 'root',
})
export class BackendService {

    private subject = new BehaviorSubject<ConfigState>(new ConfigState());
    state = this.subject.asObservable();

    storeConfig = new ConfigState();

    constructor() {
        this.state.subscribe((state) => (this.storeConfig = state));
    }

    setBackendServer(serverUrl:string) {
        this.storeConfig.backendUrl = serverUrl;
    }
}