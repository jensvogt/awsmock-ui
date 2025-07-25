import {AfterViewChecked, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent} from "@angular/material/card";
import {MatFormField, MatInput} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatIconButton} from "@angular/material/button";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {MatTooltip} from "@angular/material/tooltip";
import {MatIcon} from "@angular/material/icon";
import {interval, Subscription} from "rxjs";

@Component({
    selector: 'awsmock-logs',
    templateUrl: './awsmock-logs.component.html',
    imports: [
        MatCard,
        MatCardContent,
        MatFormField,
        ReactiveFormsModule,
        MatFormField,
        MatCardActions,
        MatIcon,
        MatIconButton,
        MatTooltip,
        CdkTextareaAutosize,
        MatInput,
        FormsModule
    ],
    styleUrl: './awsmock-logs.component.scss'
})
export class AwsMockLogsComponent implements OnInit, AfterViewChecked {

    ws: WebSocket | undefined;
    logs: string = '';
    scrollToEnd = true;
    // Auto-update
    updateSubscription: Subscription | undefined;
    @ViewChild('logMessages') private readonly logTextContainer: ElementRef | undefined;

    constructor() {
    }

    ngOnInit(): void {
        let url = <string>localStorage.getItem("backendUrl")?.replace(/http/g, 'ws')?.replace(/:\d+/g, ':4568');
        this.ws = new WebSocket(url);
        this.ws.addEventListener("message", (event) => {
            if (event.data) {
                this.logs += event.data + '\n';
                this.scrollToBottom();
            }
        });
        this.ws.addEventListener("open", (event) => {
            let request = {command: "open-awsmock-logs"};
            this.ws?.send(JSON.stringify(request));
        });
        this.ws.addEventListener("close", (event) => {
            this.ws?.close();
        });
        this.updateSubscription = interval(1000).subscribe(() => this.loadLogs());
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    stopScrolling(flag: boolean) {
        this.scrollToEnd = flag;
    }

    scrollToBottom(): void {
        try {
            if (this.scrollToEnd && this.logTextContainer)
                this.logTextContainer.nativeElement.scrollTop = this.logTextContainer?.nativeElement.scrollHeight;
        } catch (err) {
            console.log(err);
        }
    }

    loadLogs(): void {
        let request = {command: "log-message"};
        this.ws?.send(JSON.stringify(request));
    }
}

