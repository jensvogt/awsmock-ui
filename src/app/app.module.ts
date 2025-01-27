import {NgModule} from "@angular/core";
import {AppComponent} from "./app.component";
import {BrowserModule} from "@angular/platform-browser";
import {MatToolbarModule} from "@angular/material/toolbar";
import {AppRoutingModule, routes} from "./app.routes";
import {DashboardModule} from "./modules/dashboard/dashboard.module";
import {provideRouter, RouterModule, RouterOutlet} from "@angular/router";
import {StoreDevtoolsConfig} from "@ngrx/store-devtools";
import {environment} from "../environments/environment";
import {EffectsModule, provideEffects} from "@ngrx/effects";
import {provideStore, StoreModule} from "@ngrx/store";
import {reducers} from "./state/root.reducer";
import {RootEffect} from "./state/root.effect";
import {MatIconModule} from "@angular/material/icon";
import {provideHttpClient} from "@angular/common/http";
import {MatButton, MatIconButton} from "@angular/material/button";
import {StoreRouterConnectingModule} from '@ngrx/router-store';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {BinaryFileUploadComponent} from "./shared/binary-file-upload/binary-file-upload.component";

const storeDevToolsOptions: Partial<StoreDevtoolsConfig> = {maxAge: 25, logOnly: environment.production};

@NgModule({
    declarations: [AppComponent],
    providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideStore(reducers, {}),
        provideEffects(RootEffect),
        // Redux dev tools. Results in all http request send twice. SO use it only for debugging purposes.
//        provideStoreDevtools(storeDevToolsOptions),
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
        BrowserAnimationsModule,
        StoreModule.forRoot(reducers, {}),
        EffectsModule.forRoot(RootEffect),
        // Redux dev tools. Results in all http request send twice. SO use it only for debugging purposes.
        //!environment.production ? StoreDevtoolsModule.instrument() : [],
        //StoreDevtoolsModule.instrument({maxAge: 25, logOnly: !isDevMode()}),
        StoreRouterConnectingModule.forRoot(),
        BinaryFileUploadComponent,
        MatLabel,
        MatInput,
        MatFormField,
        FormsModule,
        ReactiveFormsModule,
        MatButton,
        MatSuffix,
        MatMenuTrigger,
        MatMenu,
        MatMenuItem
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
