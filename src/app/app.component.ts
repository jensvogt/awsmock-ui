import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConfigComponentDialog} from "./modules/dashboard/settings/config.component";
import {BackendDialog} from "./modules/dashboard/backend/backend.component";
import {EditorComponent} from "@tinymce/tinymce-angular";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    standalone: false
})
export class AppComponent {

    init: EditorComponent['init'] = {
        plugins: 'lists link image table code help wordcount',
        base_url: '/tinymce', // Root for resources
        suffix: '.min'
    };

    service: string = '';
    title: string = 'awsmock.ui';

    constructor(private readonly router: Router, private readonly dialog: MatDialog) {
        if (!localStorage.getItem("backendUrl")) {
            localStorage.setItem('backendUrl', "http://localhost:4566");
        }
        if (!localStorage.getItem("region")) {
            localStorage.setItem('region', "eu-central-1");
        }
        if (!localStorage.getItem("user")) {
            localStorage.setItem('user', "none");
        }
        if (!localStorage.getItem("autoReload") || parseInt(<string>localStorage.getItem("autoReload")) < 10000) {
            localStorage.setItem('autoReload', "60000");
        }
    }

    navigateMenu() {
        this.router.navigate(['/' + this.service.toLowerCase()]);
        this.service = '';
    }

    home() {
        this.router.navigate(['/']);
    }

    config() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "30%"
        dialogConfig.minWidth = '200px'
        dialogConfig.maxWidth = '60vw';
        dialogConfig.maxHeight = '100vh';
        dialogConfig.panelClass = 'full-screen-modal';

        this.dialog.open(ConfigComponentDialog, dialogConfig);
    }

    backend() {
        const dialogBackend = new MatDialogConfig();

        dialogBackend.disableClose = true;
        dialogBackend.autoFocus = true;
        dialogBackend.width = "30%"
        dialogBackend.minWidth = '200px'
        dialogBackend.maxWidth = '60vw';
        dialogBackend.maxHeight = '100vh';
        dialogBackend.panelClass = 'full-screen-modal';

        this.dialog.open(BackendDialog, dialogBackend);
    }

    showLogs() {
        let url = '/awsmock-logs';
        window.open(url, "_blank");
    }
}

