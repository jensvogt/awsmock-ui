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
import {convertObjectToArray} from "../../../shared/paging-utils.component";

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
            this.environmentTotal = Object.getOwnPropertyNames(applicationDetails.environment).length;
            this.environmentDatasource = convertObjectToArray(applicationDetails.environment, this.environmentPageSize, this.environmentPageIndex, this.environmentSortColumn);
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
        this.environmentDatasource = convertObjectToArray(this.applicationItem.environment, e.pageSize, e.pageIndex, this.environmentSortColumn);
    }

    environmentSortChanged(sortState: Sort) {
        let direction = sortState.direction === 'asc' ? 1 : -1;
        this.environmentSortColumn = {column: sortState.active, sortDirection: direction};
        this.environmentDatasource = convertObjectToArray(this.applicationItem.environment, this.environmentPageSize, this.environmentPageIndex, this.environmentSortColumn);
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
}
