import {Component, ViewEncapsulation} from '@angular/core';
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatDialogContent} from "@angular/material/dialog";

@Component({
    selector: 'app-progress-spinner-dialog',
    templateUrl: './progress-spinner.component.html',
    imports: [
        MatProgressSpinner,
        MatDialogContent
    ],
    styleUrls: ['./progress-spinner.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProgressSpinnerDialogComponent {

    constructor() {
    }

}