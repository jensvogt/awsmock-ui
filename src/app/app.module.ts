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
import {HomeComponent} from "./pages/home/home.component";
import {MatDialogModule} from "@angular/material/dialog";
import {provideRouter, RouterModule, RouterOutlet, withComponentInputBinding} from "@angular/router";
import {NgIf, registerLocaleData} from "@angular/common";
import {HttpClient, provideHttpClient, withFetch} from "@angular/common/http";
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {MultiTranslateHttpLoader} from 'ngx-translate-multi-http-loader';

registerLocaleData(localeDe, 'de', localeDeExtra);

export function HttpLoaderFactory(http: HttpClient) {
    return new MultiTranslateHttpLoader(http, [
        {prefix: './assets/i18n/general/', suffix: '.json'}
    ]);
}

@NgModule({
    declarations: [AppComponent],
    exports: [AppComponent],
    bootstrap: [AppComponent],
    providers: [provideRouter(routes, withComponentInputBinding()), provideHttpClient(withFetch())],
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
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),

    ],
})
export class AppModule {
    constructor(private translate: TranslateService) {
        translate.addLangs(['de']);
        translate.setDefaultLang('de');
        translate.use('de');
    }
}
