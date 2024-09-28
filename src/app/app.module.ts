import {NgModule} from "@angular/core";
import {AppComponent} from "./app.component";
import {BrowserModule, provideClientHydration} from "@angular/platform-browser";
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

@NgModule({
    declarations: [AppComponent],
    exports: [AppComponent],
    bootstrap: [AppComponent],
    providers: [provideClientHydration(), provideRouter(routes, withComponentInputBinding()), provideHttpClient(withInterceptorsFromDi())],
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
    ],
})
export class AppModule {
}
