import {Component, OnInit} from '@angular/core';
import {MatCard} from "@angular/material/card";

@Component({
    selector: 'app-home',
    templateUrl: './sqs-message.component.html',
    standalone: true,
    imports: [
        MatCard
    ],
    styleUrls: ['./sqs-message.component.scss']
})
export class SqsMessageComponent implements OnInit {

    ngOnInit(): void {
        console.log("SQS module")
    }

}
