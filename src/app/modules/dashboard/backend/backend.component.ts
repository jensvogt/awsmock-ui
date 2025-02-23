import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component, OnInit} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatList, MatListItem} from "@angular/material/list";
import {ModuleService} from "../../../services/module.service";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {State, Store} from "@ngrx/store";
import {RootState} from "../../../state/root.reducer";

@Component({
    selector: 'backend-dialog',
    templateUrl: './backend.component.html',
    standalone: true,
    imports: [
        MatDialogContent,
        MatDialogTitle,
        MatDialogActions,
        MatButton,
        MatDialogClose,
        FormsModule,
        ReactiveFormsModule,
        MatList,
        MatListItem,
        MatFormField,
        MatInput,
        MatLabel
    ],
    providers: [ModuleService],
    styleUrls: ['./backend.component.scss']
})
export class BackendDialog implements OnInit {

    url: string | null = '';

    constructor(private readonly dialogRef: MatDialogRef<BackendDialog>, private readonly state: State<RootState>, private readonly store: Store<RootState>) {
        this.url = localStorage.getItem('backendUrl');
    }

    ngOnInit() {
        this.dialogRef.updateSize("600px", "500px");
    }

    save() {
        if(this.url !== null){
            localStorage.setItem('backendUrl', this.url);
        }
        this.dialogRef.close();
    }
}
