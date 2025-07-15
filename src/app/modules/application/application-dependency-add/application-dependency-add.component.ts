import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component, Inject, OnInit} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {ApplicationService} from "../service/application-service.component";
import {MatOption, MatSelect} from "@angular/material/select";

@Component({
    selector: 'application-dependency-add-dialog',
    templateUrl: './application-dependency-add.component.html',
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
        ReactiveFormsModule,
        MatSelect,
        MatOption
    ],
    styleUrls: ['./application-dependency-add.component.scss'],
})
export class ApplicationDependencyAddDialog implements OnInit {

    // @ts-ignore
    selectedName: string = '';
    applicationName: string = '';
    applicationNames: string[] = [];

    constructor(private readonly dialogRef: MatDialogRef<ApplicationDependencyAddDialog>, @Inject(MAT_DIALOG_DATA) public data: any, private readonly applicationService: ApplicationService) {
        this.applicationName = data.self;
    }

    ngOnInit(): void {
        this.applicationService.listApplicationNames().subscribe((applicationNames: any) => {
            this.applicationNames = applicationNames.filter((dependency: string) => dependency !== this.applicationName);
        });
    }

    save() {
        this.dialogRef.close({name: this.selectedName});
    }
}
