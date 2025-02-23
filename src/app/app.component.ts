import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConfigComponentDialog} from "./modules/dashboard/settings/config.component";
import {BackendDialog} from "./modules/dashboard/backend/backend.component";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    standalone: false
})
export class AppComponent {

    service: string = '';

    constructor(private readonly router: Router, private readonly dialog: MatDialog) {

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

        this.dialog.open(ConfigComponentDialog, dialogConfig).afterClosed().subscribe(() => {
        });
    }

    backend() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "30%"
        dialogConfig.minWidth = '200px'
        dialogConfig.maxWidth = '60vw';
        dialogConfig.maxHeight = '100vh';
        dialogConfig.panelClass = 'full-screen-modal';

        this.dialog.open(BackendDialog, dialogConfig).afterClosed().subscribe(()=> {});
    }

    logOut() {
    }
}

