import {Component, ViewChild} from '@angular/core';
import {MatIcon, MatIconRegistry} from "@angular/material/icon";
import {MatToolbar} from "@angular/material/toolbar";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {MatDivider} from "@angular/material/divider";
import {NgIf} from "@angular/common";
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {MatButton, MatIconButton} from "@angular/material/button";
import {DomSanitizer} from "@angular/platform-browser";
import {FormBuilder} from "@angular/forms";
import {BreakpointObserver} from "@angular/cdk/layout";
import {MatListItem, MatNavList} from "@angular/material/list";
import {
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelContent,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle
} from "@angular/material/expansion";
import {MatLine} from "@angular/material/core";
import {MatRow} from "@angular/material/table";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [
        NgIf,
        MatIcon,
        MatToolbar,
        MatDivider,
        MatSidenav,
        MatSidenavContent,
        MatSidenavContainer,
        RouterOutlet,
        MatIconButton,
        MatButton,
        RouterLink,
        MatNavList,
        MatAccordion,
        MatExpansionPanel,
        MatExpansionPanelTitle,
        MatExpansionPanelHeader,
        MatExpansionPanelContent,
        MatListItem,
        RouterLinkActive,
        MatLine,
        MatRow
    ]
})
export class AppComponent {
    @ViewChild(MatSidenav)
    sidenav!: MatSidenav;
    title = 'awsmock-ui';
    customIcons: Array<[string, string]> = [
        ["icon_sqs", "sqs.svg"],
        ["icon_sns", "sns.svg"],
        ["icon_s3", "sns.s3"]
    ];

    constructor(private observer: BreakpointObserver, private router: Router, fb: FormBuilder, private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
        this.customIcons.forEach(([iconName, iconPath]) => {
            matIconRegistry.addSvgIcon(iconName, domSanitizer.bypassSecurityTrustResourceUrl(iconPath));
        });
        console.log("Icons loaded");
    }

    navigateMenu(module: string) {
        this.router.navigate(['/' + module]);
        this.sidenav.close();
    }

    logOut() {
    }
}
