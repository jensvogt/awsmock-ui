import {isDevMode, NgModule} from "@angular/core";
import {AppComponent} from "./app.component";
import {BrowserModule} from "@angular/platform-browser";
import {MatToolbarModule} from "@angular/material/toolbar";
import {AppRoutingModule, routes} from "./app.routes";
import {DashboardModule} from "./modules/dashboard/dashboard.module";
import {provideRouter, RouterModule, RouterOutlet} from "@angular/router";
import {provideStoreDevtools, StoreDevtoolsConfig, StoreDevtoolsModule} from "@ngrx/store-devtools";
import {environment} from "../environments/environment";
import {EffectsModule, provideEffects} from "@ngrx/effects";
import {provideStore, StoreModule} from "@ngrx/store";
import {reducers} from "./state/root.reducer";
import {RootEffect} from "./state/root.effect";
import {MatIconModule} from "@angular/material/icon";
import {provideHttpClient} from "@angular/common/http";
import {MatIconButton} from "@angular/material/button";
import {StoreRouterConnectingModule} from '@ngrx/router-store';

const storeDevToolsOptions: Partial<StoreDevtoolsConfig> = {maxAge: 25, logOnly: environment.production};

@NgModule({
    declarations: [AppComponent],
    providers: [
        provideRouter(routes),
        provideHttpClient(),
        // Currently PIM uses modules and standalone components,
        // therefore store, effects and dev tools must be defined in imports as well as in providers!
        provideStore(reducers, {}),
        provideEffects(RootEffect),
        provideStoreDevtools(storeDevToolsOptions),
        //AwsMockHttpService,
    ],
    imports: [
        BrowserModule,
        RouterModule,
        DashboardModule,
        RouterOutlet,
        MatToolbarModule,
        AppRoutingModule,
        DashboardModule,
        MatIconModule,
        MatIconButton,
        StoreModule.forRoot(reducers, {}),
        EffectsModule.forRoot(RootEffect),
        !environment.production ? StoreDevtoolsModule.instrument() : [],
        StoreDevtoolsModule.instrument({maxAge: 25, logOnly: !isDevMode()}),
        StoreRouterConnectingModule.forRoot()
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
