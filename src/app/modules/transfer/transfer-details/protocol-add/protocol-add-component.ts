import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";

interface ProtocolType {
    value: string;
    viewValue: string;
}

@Component({
    selector: 'protocol-add-dialog',
    templateUrl: './protocol-add-component.html',
    standalone: true,
    imports: [
        MatDialogContent,
        MatDialogTitle,
        MatDialogActions,
        MatButton,
        MatDialogClose,
        MatFormField,
        MatLabel,
        FormsModule,
        MatInput,
        ReactiveFormsModule,
        MatOption,
        MatSelect
    ],
    styleUrls: ['./protocol-add-component.scss']
})
export class ProtocolAddComponentDialog {

    protocol: string = '';
    port: number = 0

    protocolTypes: ProtocolType[] = [
        {value: 'FTP', viewValue: 'FTP'},
        {value: 'SFTP', viewValue: 'SFTP'}
    ];
    selectedProtocolType: string = 'FTP';

    constructor(private dialogRef: MatDialogRef<ProtocolAddComponentDialog>) {
    }

    save() {
        this.dialogRef.close({protocol: this.selectedProtocolType, port: this.port});
    }

    close() {
        this.dialogRef.close(false);
    }
}
