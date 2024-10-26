import {NgModule} from "@angular/core";
import {AppComponent} from "./app.component";
import {bootstrapApplication, BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatToolbar, MatToolbarModule} from "@angular/material/toolbar";
import {MatSidenav, MatSidenavContainer, MatSidenavContent, MatSidenavModule} from "@angular/material/sidenav";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatDivider, MatDividerModule} from "@angular/material/divider";
import {routes} from "./app.routes";
import {HomeComponent} from "./pages/home/home.component";
import {MatDialogModule} from "@angular/material/dialog";
import {provideRouter, RouterModule, RouterOutlet, withComponentInputBinding} from "@angular/router";
import {NgIf} from "@angular/common";
import {provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {environment} from "../environments/environment";
import {appEffects, appStore} from "./app.store";
import {provideEffects} from "@ngrx/effects";
import {provideStore} from "@ngrx/store";
import {AwsMockHttpService} from "./services/awsmock-http.service";

@NgModule({
    declarations: [],
    exports: [AppComponent],
    providers: [provideRouter(routes, withComponentInputBinding()), provideHttpClient(withInterceptorsFromDi())],
    imports: [
        BrowserModule,
        routes,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        MatDividerModule,
        HomeComponent,
        RouterModule,
        MatToolbar,
        MatIcon,
        MatDivider,
        MatButton,
        MatSidenav,
        MatSidenavContainer,
        MatSidenavContent,
        RouterOutlet,
        NgIf,
        AppComponent,
        !environment.production ? StoreDevtoolsModule.instrument() : []
    ],
})
export class AppModule {
}

bootstrapApplication(AppModule, {
    // register the store providers here
    providers: [
        provideStore(appStore),
        provideEffects(appEffects),
        AwsMockHttpService
    ]
});