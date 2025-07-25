import {AfterViewChecked, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent} from "@angular/material/card";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatIconButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";
import {MatIcon} from "@angular/material/icon";
import {interval, Subscription} from "rxjs";
import {EditorComponent, TINYMCE_SCRIPT_SRC} from "@tinymce/tinymce-angular";

const emailBodyConfig = {
    selector: '.tinymce-body',
    menubar: false,
    inline: true,
    plugins: [
        'link', 'lists', 'powerpaste',
        'autolink', 'tinymcespellchecker'
    ],
    toolbar: [
        'undo redo | bold italic underline | fontfamily fontsize',
        'forecolor backcolor | alignleft aligncenter alignright alignfull | numlist bullist outdent indent'
    ],
    valid_elements: 'p[style],strong,em,span[style],a[href],ul,ol,li',
    valid_styles: {
        '*': 'font-size,font-family,color,text-decoration,text-align'
    },
    powerpaste_word_import: 'clean',
    powerpaste_html_import: 'clean',
};

@Component({
    selector: 'awsmock-logs',
    templateUrl: './awsmock-logs.component.html',
    imports: [
        MatCard,
        MatCardContent,
        ReactiveFormsModule,
        MatCardActions,
        MatIcon,
        MatIconButton,
        MatTooltip,
        FormsModule,
        EditorComponent
    ],
    styleUrl: './awsmock-logs.component.scss',
    providers: [
        {provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js'}
    ]
})
export class AwsMockLogsComponent implements OnInit, AfterViewChecked {

    ws: WebSocket | undefined;
    logs: string = '';
    scrollToEnd = true;
    // Auto-update
    updateSubscription: Subscription | undefined;
    maxChars: number = 100000;
    @ViewChild('logMessages') private readonly logTextContainer: ElementRef | undefined;

    constructor() {
    }

    ngOnInit(): void {

        let url = <string>localStorage.getItem("backendUrl")?.replace(/http/g, 'ws')?.replace(/:\d+/g, ':4568');
        this.ws = new WebSocket(url);
        this.ws.addEventListener("message", (event) => {
            if (event.data) {
                this.logs += '<span style="color:darkgreen">' + event.data + '</span><br>';
                if (this.logs.length > this.maxChars) {
                    this.logs = this.logs.substring(0, this.maxChars / 10);
                }
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

