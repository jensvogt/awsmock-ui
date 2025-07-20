import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {AfterViewChecked, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {interval, Subscription} from "rxjs";

@Component({
    selector: 'application-logs-dialog',
    templateUrl: './application-logs.component.html',
    standalone: true,
    imports: [
        MatDialogContent,
        MatDialogTitle,
        MatDialogActions,
        MatButton,
        MatDialogClose,
        FormsModule,
        MatInput,
        ReactiveFormsModule,
        CdkTextareaAutosize,
        MatFormField,
        MatLabel
    ],
    styleUrls: ['./application-logs.component.scss'],
})
export class ApplicationLogsDialog implements OnInit, OnDestroy, AfterViewChecked {

    ws: WebSocket | undefined;
    logs: string = '';
    applicationName: string = '';
    containerId: string = '';

    // Auto-update
    updateSubscription: Subscription | undefined;

    @ViewChild('logMessages') private readonly logTextContainer: ElementRef | undefined;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
        this.applicationName = data.applicationName;
        this.containerId = data.containerId;
    }

    ngOnInit(): void {
        this.ws = new WebSocket('ws://localhost:4568');
        this.ws.addEventListener("message", (event) => {
            if (event.data) {
                this.logs += event.data;
                this.scrollToBottom();
            }
        });
        this.ws.addEventListener("open", (event) => {
            let request = {command: "open-log", application: this.applicationName, containerId: this.containerId};
            this.ws?.send(JSON.stringify(request));
        });
        this.updateSubscription = interval(1000).subscribe(() => this.loadLogs());
    }

    ngOnDestroy() {
        let request = {command: "close-log", application: this.applicationName, containerId: this.containerId};
        this.ws?.send(JSON.stringify(request));
        this.ws?.close();
        this.ws = undefined;
        this.updateSubscription?.unsubscribe();
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    loadLogs(): void {
        let request = {command: "log-message", application: this.applicationName, containerId: this.containerId};
        this.ws?.send(JSON.stringify(request));
    }

    close() {
        // this.ws?.close();
    }

    scrollToBottom(): void {
        try {
            if (this.logTextContainer)
                this.logTextContainer.nativeElement.scrollTop = this.logTextContainer?.nativeElement.scrollHeight;
        } catch (err) {
            console.log(err);
        }
    }
}
