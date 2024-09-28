import {Component, OnInit} from '@angular/core';
import {MatCard} from "@angular/material/card";

@Component({
    selector: 'app-home',
    templateUrl: './sns-message.component.html',
    standalone: true,
    imports: [
        MatCard
    ],
    styleUrls: ['./sns-message.component.scss']
})
export class SnsMessageComponent implements OnInit {

    ngOnInit(): void {
        console.log("SQS module")
    }

}
