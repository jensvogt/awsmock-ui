import {NgModule} from "@angular/core";
import {AppComponent} from "./app.component";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatToolbar, MatToolbarModule} from "@angular/material/toolbar";
import {MatSidenav, MatSidenavContainer, MatSidenavContent, MatSidenavModule} from "@angular/material/sidenav";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatDivider, MatDividerModule} from "@angular/material/divider";
import {routes} from "./app.routes";
import {DashboardModule} from "./modules/dashboard/dashboard.module";
import {MatDialogModule} from "@angular/material/dialog";
import {provideRouter, RouterModule, RouterOutlet, withComponentInputBinding} from "@angular/router";
import {NgIf} from "@angular/common";
import {provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {provideStoreDevtools, StoreDevtoolsConfig, StoreDevtoolsModule} from "@ngrx/store-devtools";
import {environment} from "../environments/environment";
import {provideEffects} from "@ngrx/effects";
import {provideStore} from "@ngrx/store";
import {SQSModule} from "./modules/sqs/sqs.module";
import {reducers} from "./state/root.reducer";
import {RootEffect} from "./state/root.effect";

const storeDevToolsOptions: Partial<StoreDevtoolsConfig> = {maxAge: 25, logOnly: environment.production};

@NgModule({
    declarations: [AppComponent],
    providers: [
        provideRouter(routes, withComponentInputBinding()),
        provideHttpClient(withInterceptorsFromDi()),
        // Currently PIM uses modules and standalone components,
        // therefore store, effects and dev tools must be defined in imports as well as in providers!
        provideStore(reducers, {}),
        provideEffects(RootEffect),
        provideStoreDevtools(storeDevToolsOptions)
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        MatDividerModule,
        DashboardModule,
        RouterModule,
        RouterOutlet,
        MatToolbarModule,
        MatToolbar,
        MatIcon,
        MatDivider,
        MatButton,
        MatSidenav,
        MatSidenavContainer,
        MatSidenavContent,
        NgIf,
        SQSModule,
        DashboardModule,
        routes,
        !environment.production ? StoreDevtoolsModule.instrument() : []
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
