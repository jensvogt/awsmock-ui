import {Component, OnDestroy, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {Sort} from "@angular/material/sort";
import {byteConversion} from "../../../shared/byte-utils.component";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {State, Store} from "@ngrx/store";
import {PageEvent} from "@angular/material/paginator";
import {ApplicationItem, Environment, GetApplicationRequest, Options, UpdateApplicationRequest} from "../model/application-item";
import {ApplicationService} from "../service/application-service.component";
import {ApplicationDetailsState} from "./state/application-details.reducer";
import {applicationDetailsActions} from "./state/application-details.actions";
import {Observable} from "rxjs";
import {selectError} from "../../sqs/queue-detail/state/sqs-queue-detail.selectors";
import {selectApplicationItem} from "./state/application-details.selectors";
import {MatTableDataSource} from "@angular/material/table";
import {SortColumn} from "../../../shared/sorting/sorting.component";
import {ApplicationEnvironmentAddDialog} from "../application-environment-add/application-environment-add.component";
import {ApplicationEnvironmentEditDialog} from "../application-environment-edit/application-environment-edit.component";
import {ApplicationUploadDialog} from "../application-upload/application-upload-dialog.component";

@Component({
    selector: 'application-detail-component',
    templateUrl: './application-detail.component.html',
    styleUrls: ['./application-detail.component.scss'],
    standalone: false,
    providers: [ApplicationService]
})
export class ApplicationDetailsComponent implements OnInit, OnDestroy {

    // Last update
    lastUpdate: Date = new Date();

    applicationItem = {} as ApplicationItem;
    applicationName: string = '';

    applicationDetails$: Observable<ApplicationItem> = this.store.select(selectApplicationItem);
    applicationError$: Observable<string> = this.store.select(selectError);

    // Environment
    environmentColumns: string[] = ['key', 'value', 'actions'];
    environmentSortColumn: SortColumn = {column: 'key', sortDirection: -1};
    environmentDatasource: MatTableDataSource<Environment> = {} as MatTableDataSource<Environment>;
    environmentTotal: number = 0;
    environmentPageSize: number = 5;
    environmentPageIndex: number = 0;
    environmentPageSizeOptions = [5, 10, 20, 50, 100];

    // Options
    optionsColumns: string[] = ['key', 'value', 'actions'];
    optionsSortColumn: SortColumn = {column: 'key', sortDirection: -1};
    optionsDatasource: MatTableDataSource<Options> = {} as MatTableDataSource<Options>;
    optionsTotal: number = 0;
    optionsPageSize: number = 5;
    optionsPageIndex: number = 0;
    optionsPageSizeOptions = [5, 10, 20, 50, 100];

    protected readonly byteConversion = byteConversion;
    private routerSubscription: any;

    constructor(private readonly snackBar: MatSnackBar, private readonly dialog: MatDialog, private readonly location: Location, private readonly route: ActivatedRoute, private readonly applicationService: ApplicationService,
                private readonly store: Store, private readonly state: State<ApplicationDetailsState>) {
    }

    ngOnInit() {
        this.routerSubscription = this.route.params.subscribe(params => {
            this.applicationName = atob(params['name']);
            this.loadApplication();
        });
        this.applicationDetails$.subscribe(applicationDetails => {
            console.log("applicationDetails: ", applicationDetails);
            this.applicationItem = applicationDetails;
            this.environmentDatasource = this.convertObjectToArray('environment', applicationDetails.environment, this.environmentPageSize, this.environmentPageIndex, this.environmentSortColumn);
            this.optionsDatasource = this.convertObjectToArray('options', applicationDetails.options, this.optionsPageSize, this.optionsPageIndex, this.optionsSortColumn);
        })
        //this.lambdaEnvironment$.subscribe((data) => console.log(data));
        //this.lambdaTags$.subscribe((data) => console.log(data));
        //this.lambdaInstances$.subscribe((data) => console.log("Lambda instances: ", data));
    }

    ngOnDestroy() {
        this.routerSubscription.unsubscribe();
    }

    back() {
        this.location.back();
    }

    refresh() {
        this.loadApplication();
        //this.loadEnvironment();
    }

    loadApplication() {
        let request: GetApplicationRequest = {name: this.applicationName};
        this.store.dispatch(applicationDetailsActions.loadApplication({request: request}));
        this.lastUpdate = new Date();
    }

    uploadCode() {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {applicationName: this.applicationItem.name};
        dialogConfig.maxWidth = '100vw';
        dialogConfig.maxHeight = '100vh';
        dialogConfig.panelClass = 'full-screen-modal';
        dialogConfig.width = "40%"

        this.dialog.open(ApplicationUploadDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                this.applicationService.uploadApplicationCode(result.applicationName, result.applicationCode, result.version).subscribe(() => {
                    this.snackBar.open('Application code uploaded, name: ' + result.applicationName, 'Done', {duration: 5000});
                });
            }
        });
    }

    // ===================================================================================================================
    // Environment
    // ===================================================================================================================
    handleEnvironmentPageEvent(e: PageEvent) {
        this.environmentPageSize = e.pageSize;
        this.environmentPageIndex = e.pageIndex;
        this.environmentDatasource = this.convertObjectToArray('environment', this.applicationItem.environment, e.pageSize, e.pageIndex, this.environmentSortColumn);
    }

    environmentSortChanged(sortState: Sort) {
        let direction = sortState.direction === 'asc' ? 1 : -1;
        this.environmentSortColumn = {column: sortState.active, sortDirection: direction};
        this.environmentDatasource = this.convertObjectToArray('environment', this.applicationItem.environment, this.environmentPageSize, this.environmentPageIndex, this.environmentSortColumn);
    }

    addEnvironment() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        this.dialog.open(ApplicationEnvironmentAddDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result?.key && result.value) {
                this.applicationItem.environment[result.key] = result.value;
                let request: UpdateApplicationRequest = {application: this.applicationItem}
                this.store.dispatch(applicationDetailsActions.updateApplication({request: request}));
                this.snackBar.open('Application environment variable updated, name: ' + result.key, 'Dismiss', {duration: 5000});
            } else {
                this.snackBar.open('Application environment variable unchanged, name: ' + result.key, 'Dismiss', {duration: 5000});
            }
        });
    }

    editEnvironment(key: string, value: string) {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {key: key, value: value};

        this.dialog.open(ApplicationEnvironmentEditDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result?.key && result.value) {
                this.applicationItem.environment[result.key] = result.value;
                let request: UpdateApplicationRequest = {application: this.applicationItem}
                this.store.dispatch(applicationDetailsActions.updateApplication({request: request}));
                this.snackBar.open('Application environment variable updated, name: ' + result.key, 'Dismiss', {duration: 5000});
            } else {
                this.snackBar.open('Application environment variable unchanged, name: ' + result.key, 'Dismiss', {duration: 5000});
            }
        });
    }

    deleteEnvironment(key: string) {
        delete this.applicationItem.environment[key];
        let request: UpdateApplicationRequest = {application: this.applicationItem}
        this.store.dispatch(applicationDetailsActions.updateApplication({request: request}));
        this.snackBar.open('Application environment variable deleted, name: ' + key, 'Dismiss', {duration: 5000});
    }

    // ===================================================================================================================
    // Options
    // ===================================================================================================================
    handleOptionsPageEvent(e: PageEvent) {
        this.optionsPageSize = e.pageSize;
        this.optionsPageIndex = e.pageIndex;
        this.optionsDatasource = this.convertObjectToArray('options', this.applicationItem.options, e.pageSize, e.pageIndex, this.optionsSortColumn);
    }

    optionsSortChanged(sortState: Sort) {
        let direction = sortState.direction === 'asc' ? 1 : -1;
        this.optionsSortColumn = {column: sortState.active, sortDirection: direction};
        this.optionsDatasource = this.convertObjectToArray('options', this.applicationItem.options, this.optionsPageSize, this.optionsPageIndex, this.optionsSortColumn);
    }

    addOptions() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {functionArn: this.applicationName};

        // this.dialog.open(LambdaOptionsAddDialog, dialogConfig).afterClosed().subscribe(result => {
        //     if (result) {
        //         if (result.Key && result.Value) {
        //             this.optionsService.addOptions(this.functionArn, result.Key, result.Value)
        //                 .subscribe(() => {
        //                     this.loadOptions();
        //                     this.snackBar.open('Lambda options variable changed, name: ' + result.key, 'Dismiss', {duration: 5000});
        //                 })
        //         } else {
        //             this.snackBar.open('Lambda options variable unchanged, name: ' + result.key, 'Dismiss', {duration: 5000});
        //         }
        //     }
        // });
    }

    editOptions(key: string, value: string) {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {optionsName: this.applicationName, key: key, value: value};

        // this.dialog.open(LambdaOptionsEditDialog, dialogConfig).afterClosed().subscribe(result => {
        //     if (result) {
        //         if (result.Key !== key || result.Value !== value) {
        //             this.optionsService.updateOptions(this.functionArn, result.Key, result.Value)
        //                 .subscribe(() => {
        //                     this.loadTags();
        //                     this.snackBar.open('Lambda options variable updated, name: ' + result.key, 'Dismiss', {duration: 5000});
        //                 })
        //         } else {
        //             this.snackBar.open('Lambda options variable unchanged, name: ' + result.key, 'Dismiss', {duration: 5000});
        //         }
        //     }
        // });
    }

    deleteOptions(key: string) {
        // this.optionsService.deleteOptions(this.functionArn, key)
        //     .subscribe(() => {
        //         this.loadOptions();
        //         this.snackBar.open('Lambda options variable deleted, name: ' + key, 'Dismiss', {duration: 5000});
        //     })
    }

    convertObjectToArray(name: string, obj: any, pageSize: number, pageIndex: number, sortColumn: SortColumn): MatTableDataSource<Environment> {
        let environments: Environment[] = [];
        for (let key of Object.getOwnPropertyNames(obj)) {
            environments.push({key: key, value: obj[key]});
        }
        this.environmentTotal = environments.length;

        environments = environments.sort((a: any, b: any) => a[sortColumn.column].localeCompare(b[sortColumn.column]));
        if (sortColumn.sortDirection === 1) {
            environments = environments.reverse();
        }
        if (environments.length > pageSize) {
            environments = environments.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
        }
        return new MatTableDataSource<Environment>(environments);
    }
}
