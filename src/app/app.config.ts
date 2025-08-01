import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {routes} from "./app.routes";
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {provideStore} from "@ngrx/store";
import {LoadingInterceptor} from './shared/spinner/loading-interceptor.component';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({eventCoalescing: true}),
        provideRouter(routes),
        provideAnimationsAsync(),
        provideHttpClient(withInterceptorsFromDi()),
        provideStore({}, {}),
        {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true},
    ]
};
