import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {Component, OnInit} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatList, MatListItem, MatListItemLine, MatListItemTitle} from "@angular/material/list";
import {ModuleService} from "../../../services/module.service";
import packageJson from "../../../../../package.json";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";

@Component({
    selector: 'config-dialog',
    templateUrl: './config.component.html',
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
        MatListItemLine,
        MatListItemTitle,
        MatGridList,
        MatGridTile
    ],
    providers: [ModuleService],
    styleUrls: ['./config.component.scss']
})
export class ConfigComponentDialog implements OnInit {

    configuration: any = {}
    uiVersion: string = packageJson.version;

    constructor(private dialogRef: MatDialogRef<ConfigComponentDialog>, private moduleService: ModuleService) {
    }

    ngOnInit() {
        this.getConfig();
    }

    getConfig() {
        this.moduleService.getConfig().subscribe((data: any) => {
            this.configuration = data;
        })
    }

    close() {
        this.dialogRef.close(false);
    }
}
