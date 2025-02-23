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
import {rootActions} from "../../../state/root.actions";
import {Observable} from "rxjs";
import {selectBackendServer} from "../../../state/root.selector";

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

    url$: Observable<string> = this.store.select(selectBackendServer);
    url: string = '';

    constructor(private readonly dialogRef: MatDialogRef<BackendDialog>, private readonly state: State<RootState>, private readonly store: Store<RootState>) {
        this.url$.subscribe((data)=> {
            this.url = data;
        });
    }

    ngOnInit() {
        this.dialogRef.updateSize("600px", "500px");
    }

    save() {
        this.store.dispatch(rootActions.setBackendServer({server: this.url}));
        this.dialogRef.close(this.url);
    }
}
