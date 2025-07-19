import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {Component, Inject, OnDestroy, OnInit} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";

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
export class ApplicationLogsDialog implements OnInit, OnDestroy {

    ws: WebSocket | undefined;
    logs: string = '';
    applicationName: string = '';
    containerId: string = '';

    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
        this.applicationName = data.applicationName;
        this.containerId = data.containerId;
    }

    ngOnInit(): void {
        this.ws = new WebSocket('ws://localhost:4568');
        this.ws.addEventListener("message", (event) => {
            if (event.data) {
                this.logs += event.data;
                let textarea = document.getElementById('logMessages');
                if (textarea) {
                    textarea.scrollTop = textarea?.scrollHeight;
                }
            }
        });
        this.ws.addEventListener("open", (event) => {
            let request = {command: "open-log", application: this.applicationName, containerId: this.containerId};
            this.ws?.send(JSON.stringify(request));
        });
    }

    ngOnDestroy() {
        this.ws?.close();
    }

    close() {
        this.ws?.close();
    }
}
