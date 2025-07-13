import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component, Inject} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";

@Component({
    selector: 'application-tag-add-dialog',
    templateUrl: './application-tag-add.component.html',
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
        ReactiveFormsModule
    ],
    styleUrls: ['./application-tag-add.component.scss'],
})
export class ApplicationTagAddDialog {

    // @ts-ignore
    key: string = '';
    value: string = '';

    constructor(private readonly dialogRef: MatDialogRef<ApplicationTagAddDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    save() {
        this.dialogRef.close({key: this.key, value: this.value});
    }
}
