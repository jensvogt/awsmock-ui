import {ChangeDetectionStrategy, Component, Inject, OnInit} from "@angular/core";
import {MatButton} from "@angular/material/button";
import {NgForOf, NgIf, SlicePipe} from "@angular/common";
import {MatList, MatListItem} from "@angular/material/list";
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatCheckbox, MatCheckboxModule} from "@angular/material/checkbox";
import {FormsModule} from "@angular/forms";
import {CdkDrag, CdkDragHandle} from "@angular/cdk/drag-drop";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ModuleService} from "../../../services/module.service";

const AllModules = {
    modules: [
        {name: 's3', displayName: 'S3', selected: false},
        {name: 'sqs', displayName: 'SQS', selected: false},
        {name: 'sns', displayName: 'SNS', selected: false},
        {name: 'kms', displayName: 'KMS', selected: false},
        {name: 'ssm', displayName: 'SSM', selected: false},
        {name: 'secretsmanager', displayName: 'SecretsManager', selected: false},
        {name: 'cognito', displayName: 'Cognito', selected: false},
        {name: 'dynamodb', displayName: 'DynamoDB', selected: false},
        {name: 'lambda', displayName: 'Lambda', selected: false},
        {name: 'transfer', displayName: 'Transfer', selected: false},
    ]
}

@Component({
    selector: 'module-selection-component',
    templateUrl: './module-selection.component.html',
    standalone: true,
    imports: [
        MatButton,
        NgIf,
        NgForOf,
        MatList,
        MatListItem,
        MatDialogActions,
        MatDialogClose,
        MatDialogContent,
        MatDialogTitle,
        MatCheckbox,
        MatCheckboxModule,
        SlicePipe,
        FormsModule,
        CdkDrag,
        CdkDragHandle
    ],
    providers: [ModuleService],
    styleUrls: ['./module-selection.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModuleSelectionComponentDialog implements OnInit {

    title: string | undefined = "";

    allSelected: boolean = false;
    includeObjects: boolean = false;
    includeObjectsVisible: boolean = false
    onlyObjects: boolean = true;
    onlyObjectsVisible: boolean = false
    prettyPrint: boolean = true
    prettyPrintVisible: boolean = false
    mode: string = 'export';
    protected readonly allModules = AllModules.modules;

    constructor(private dialogRef: MatDialogRef<ModuleSelectionComponentDialog>, @Inject(MAT_DIALOG_DATA) public data: any, private snackBar: MatSnackBar) {
        this.title = data.title;
        this.mode = data.mode;
        if (this.mode === 'export') {
            this.includeObjectsVisible = true;
            this.prettyPrintVisible = true;
        } else if (this.mode === 'clean') {
            this.onlyObjects = true;
            this.onlyObjectsVisible = true;
        } else if (this.mode === 'erase') {
            this.onlyObjectsVisible = false;
        }
        this.setSome();
    }

    ngOnInit(): void {
        /*  this.moduleService.getModuleList().subscribe((data: any) => {
              data.forEach((module: any) => {
                  this.allModules?.push({name: module.name, selected: false, displayName: module.name});
              });
              this.setAll();
              this.cdr.detectChanges();
          })*/
    }

    setAll() {
        this.allModules?.forEach((item) => {
            item.selected = this.allSelected;
        });
    }

    setSome() {
        this.allModules.forEach((item) => {
            item.selected = item.name === 'sqs' || item.name === 'sns' || item.name === 's3';
        });
    }

    includeObjectsSelected() {
        this.snackBar.open("The resulting file can be very big! Files bigger 10MB will be rejected! Use the command line client instead.", "Done", {duration: 3000})
    }

    close() {
        this.dialogRef.close(false);
    }

    save() {
        this.dialogRef.close({modules: this.allModules, onlyObjects: this.onlyObjects, includeObjects: this.includeObjects, prettyPrint: this.prettyPrint});
    }
}