import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConfigComponentDialog} from "./modules/dashboard/settings/config.component";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    standalone: false
})
export class AppComponent {

    service: string = '';

    constructor(private router: Router, private dialog: MatDialog) {
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
        dialogConfig.width = "25%"
        dialogConfig.minWidth = '200px'
        dialogConfig.maxWidth = '60vw';
        dialogConfig.maxHeight = '100vh';
        dialogConfig.panelClass = 'full-screen-modal';

        this.dialog.open(ConfigComponentDialog, dialogConfig).afterClosed().subscribe(() => {
        });
    }

    logOut() {
    }
}

