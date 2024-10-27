import {Component} from '@angular/core';
import {MatIconRegistry} from "@angular/material/icon";
import {Router} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConfigComponentDialog} from "./modules/dashboard/settings/config.component";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {

    title = 'awsmock-ui';
    customIcons: Array<[string, string]> = [
        ["icon_sqs", "sqs.svg"],
        ["icon_sns", "sns.svg"],
        ["icon_s3", "s3.svg"]
    ];

    constructor(private router: Router, matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer, private dialog: MatDialog) {
        this.customIcons.forEach(([iconName, iconPath]) => {
            matIconRegistry.addSvgIcon(iconName, domSanitizer.bypassSecurityTrustResourceUrl(iconPath));
        });

    }

    navigateMenu(module: string) {
        this.router.navigate(['/' + module]);
    }

    home() {
        this.router.navigate(['/']);
    }

    config() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        this.dialog.open(ConfigComponentDialog, dialogConfig).afterClosed().subscribe(result => {
        });
    }

    logOut() {
    }
}

