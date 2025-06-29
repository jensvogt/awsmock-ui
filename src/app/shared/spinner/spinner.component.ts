import {Component, Input} from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
    selector: 'app-spinner',
    imports: [
        NgIf
    ],
    templateUrl: './spinner.component.html'
})
export class SpinnerComponent {
    @Input() size = 50;
    @Input() show: boolean | undefined;
}