import {NgModule} from "@angular/core";
import {AppComponent} from "./app.component";
import {BrowserModule} from "@angular/platform-browser";
import {MatToolbarModule} from "@angular/material/toolbar";
import {AppRoutingModule, routes} from "./app.routes";
import {DashboardModule} from "./modules/dashboard/dashboard.module";
import {provideRouter, RouterModule, RouterOutlet} from "@angular/router";
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
import {MatDivider} from "@angular/material/divider";

@NgModule({
    declarations: [AppComponent],
    providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideStore(reducers, {}),
        provideEffects(RootEffect),
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
        MatMenuItem,
        MatDivider
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
