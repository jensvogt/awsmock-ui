import {ChangeDetectorRef, Component, inject, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {MatSort, Sort} from "@angular/material/sort";
import {LambdaService} from "../service/lambda-service.component";
import {Environment, LambdaFunctionItem, Tag} from "../model/function-item";
import {byteConversion} from "../../../shared/byte-utils.component";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {LambdaFunctionUpgradeDialog} from "../function-upgrade/function-upgrade-dialog.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {dateConversion} from "../../../shared/date-utils.component";

@Component({
    selector: 'lambda-function-detail-component',
    templateUrl: './function-detail.component.html',
    styleUrls: ['./function-detail.component.scss'],
    standalone: false,
    providers: [LambdaService]
})
export class LambdaFunctionDetailsComponent implements OnInit, OnDestroy {

    // Last update
    lastUpdate: Date = new Date();

    functionItem = {} as LambdaFunctionItem;
    functionName: string = '';

    // Environment
    environmentColumns: string[] = ['key', 'value', 'actions'];
    environmentDataSource = new MatTableDataSource<Environment>();
    environments: Environment[] = [];
    // @ts-ignore
    @ViewChild('environmentTable', {read: MatSort, static: true}) environmentSort: MatSort;

    //@ViewChild('table2', { read: MatSort, static: true }) sort2: MatSort;
    // Tags
    tagColumns: string[] = ['key', 'value', 'actions'];
    tagsDataSource = new MatTableDataSource<Tag>;
    @ViewChild(MatSort) tagSort!: MatSort;

    protected readonly byteConversion = byteConversion;
    protected readonly dateConversion = dateConversion;

    private routerSubscription: any;
    // Sorting
    private _liveAnnouncer = inject(LiveAnnouncer);

    constructor(private snackBar: MatSnackBar, private dialog: MatDialog, private location: Location, private route: ActivatedRoute, private lambdaService: LambdaService, private cdRef: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.routerSubscription = this.route.params.subscribe(params => {
            this.functionName = params['functionName'];
            this.loadFunction();
        });
        this.environmentDataSource.sort = this.environmentSort;
        //this.cdRef.detectChanges();
    }

    ngOnDestroy() {
        this.routerSubscription.unsubscribe();
    }

    back() {
        this.location.back();
    }

    refresh() {
        this.loadFunction();
    }

    loadFunction() {
        this.lambdaService.getFunction(this.functionName).subscribe((data: any) => {
            this.lastUpdate = new Date();
            this.functionItem = data;
            this.environmentDataSource = this.convertEnvironment(data);
            this.tagsDataSource = this.convertTags(data);
        });
    }

    environmentSortChanged(sortState: Sort) {
        console.log("Sort: ", sortState);
        this.environmentDataSource = this.sortEnvs(this.functionItem.environment, sortState.active, sortState.direction);
    }

    tagsSortChanged(sortState: Sort) {
        if (sortState.direction) {
            //this.environmentDataSource = new MatTableDataSource(this.sortEnvData(this.functionItem.environment, 'name', 'asc'));
        } else {
            //this.environmentDataSource = new MatTableDataSource(this.sortEnvData(this.functionItem.environment, 'name', 'desc'));
        }
    }

    uploadCode() {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {functionArn: this.functionItem.functionArn};
        dialogConfig.maxWidth = '100vw';
        dialogConfig.maxHeight = '100vh';
        dialogConfig.panelClass = 'full-screen-modal';
        dialogConfig.width = "40%"

        this.dialog.open(LambdaFunctionUpgradeDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                this.lambdaService.uploadFunctionCode(result.functionArn, result.functionCode, result.version).subscribe(() => {
                    this.loadFunction();
                    this.snackBar.open('Lambda function code uploaded, ARN: ' + this.functionItem.functionArn, 'Done', {duration: 5000});
                });
            }
        });
    }

    private convertEnvironment(data: any): MatTableDataSource<Environment> {
        let i = 0;
        this.environments = [];
        for (let t in data.environment) {
            this.environments [i++] = {key: t, value: data.environment[t]};
        }
        return new MatTableDataSource(this.environments);
    }

    private convertTags(data: any): MatTableDataSource<Tag> {
        let i = 0;
        let tags: Tag[] = [];
        for (let t in data.tags) {
            tags[i++] = {key: t, value: data.tags[t]};
        }
        return new MatTableDataSource(tags)
    }

    private sortEnvs(array: Environment[], attr: string, direction: string): any {
        if (attr === 'key') {
            if (direction === 'asc') {
                array.sort((a: Environment, b: Environment) => a.key.localeCompare(b.key));
            } else {
                array.sort((a: { key: string; }, b: { key: string; }) => b.key.localeCompare(b.key));
            }
        } else if (attr === 'value') {
            array.sort((a: { value: string; }, b: { value: string; }) => a.value.localeCompare(b.value));
        }
        console.log(array);
        return this.convertEnvironment(array);
    }
}
