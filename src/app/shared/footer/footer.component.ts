import {Component, Input} from '@angular/core';
import {DatePipe} from "@angular/common";

// https://blog.coodoo.io/dynamischer-breadcrumb-mithilfe-des-angular-router-tutorial-28c2e1c800b7
@Component({
    selector: 'footer-component',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    imports: [
        DatePipe
    ],
    standalone: true
})
export class FooterComponent  {
    @Input() lastUpdate: Date | undefined;
    backendUrl: string = <string>localStorage.getItem('backendUrl');
}
