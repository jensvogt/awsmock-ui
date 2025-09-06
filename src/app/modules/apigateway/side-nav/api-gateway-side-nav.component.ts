import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatListItem, MatNavList} from "@angular/material/list";
import {RouterLink} from "@angular/router";

@Component({
    selector: 'api-gateway-side-nav',
    templateUrl: './api-gateway-side-nav.component.html',
    imports: [
        MatCard,
        MatCardHeader,
        MatCardContent,
        MatNavList,
        MatListItem,
        RouterLink
    ],
    styleUrls: ['./api-gateway-side-nav.component.scss']
})
export class ApiGatewaySideNavComponent implements OnInit, OnDestroy {

    constructor() {
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
    }
}
