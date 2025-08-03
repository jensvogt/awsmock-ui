import {Component, OnDestroy, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {Sort} from "@angular/material/sort";
import {byteConversion} from "../../../shared/byte-utils.component";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Store} from "@ngrx/store";
import {PageEvent} from "@angular/material/paginator";
import {ApplicationItem, Environment, GetApplicationRequest, Tag, UpdateApplicationRequest} from "../model/application-item";
import {ApplicationService} from "../service/application-service.component";
import {applicationDetailsActions} from "./state/application-details.actions";
import {Observable} from "rxjs";
import {selectError} from "../../sqs/queue-detail/state/sqs-queue-detail.selectors";
import {selectApplicationItem} from "./state/application-details.selectors";
import {MatTableDataSource} from "@angular/material/table";
import {SortColumn} from "../../../shared/sorting/sorting.component";
import {ApplicationEnvironmentAddDialog} from "../application-environment-add/application-environment-add.component";
import {ApplicationEnvironmentEditDialog} from "../application-environment-edit/application-environment-edit.component";
import {ApplicationUploadDialog} from "../application-upload/application-upload-dialog.component";
import {convertArrayToArray, convertObjectToArray} from "../../../shared/paging-utils.component";
import {ApplicationTagAddDialog} from "../application-tag-add/application-tag-add.component";
import {ApplicationTagEditDialog} from "../application-tag-edit/application-tag-edit.component";
import {ApplicationDependencyAddDialog} from "../application-dependency-add/application-dependency-add.component";
import {applicationListActions} from "../application-list/state/application-list.actions";
import {ApplicationLogsDialog} from "../application-logs/application-logs.component";

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

    // Tag
    tagColumns: string[] = ['key', 'value', 'actions'];
    tagSortColumn: SortColumn = {column: 'key', sortDirection: -1};
    tagDatasource: MatTableDataSource<Tag> = {} as MatTableDataSource<Tag>;
    tagTotal: number = 0;
    tagPageSize: number = 5;
    tagPageIndex: number = 0;
    tagPageSizeOptions = [5, 10, 20, 50, 100];

    // Dependency
    dependencyColumns: string[] = ['name', 'actions'];
    dependencySortColumn: SortColumn = {column: 'name', sortDirection: -1};
    dependencyDatasource: MatTableDataSource<string> = {} as MatTableDataSource<string>;
    dependencyTotal: number = 0;
    dependencyPageSize: number = 5;
    dependencyPageIndex: number = 0;
    dependencyPageSizeOptions = [5, 10, 20, 50, 100];

    protected readonly byteConversion = byteConversion;
    private routerSubscription: any;

    constructor(private readonly snackBar: MatSnackBar, private readonly dialog: MatDialog, private readonly location: Location, private readonly route: ActivatedRoute, private readonly applicationService: ApplicationService, private readonly store: Store) {
    }

    ngOnInit() {
        this.applicationDetails$.subscribe((applicationDetails: ApplicationItem) => {
            if (applicationDetails === undefined) {
                return;
            }
            this.applicationItem = applicationDetails;
            if (this.applicationItem.environment) {
                this.environmentTotal = Object.keys(this.applicationItem.environment).length;
                this.environmentDatasource = convertObjectToArray(this.applicationItem.environment, this.environmentPageSize, this.environmentPageIndex, this.environmentSortColumn);
            }
            if (this.applicationItem.tags) {
                this.tagTotal = Object.keys(this.applicationItem.tags).length;
                this.tagDatasource = convertObjectToArray(this.applicationItem.tags, this.tagPageSize, this.tagPageIndex, this.tagSortColumn);
            }
            if (this.applicationItem.dependencies) {
                this.dependencyTotal = this.applicationItem.dependencies.length;
                this.dependencyDatasource = convertArrayToArray(this.applicationItem.dependencies, this.dependencyPageSize, this.dependencyPageIndex, this.dependencySortColumn);
            }
            if (this.applicationItem.description) {
                try {
                    this.applicationItem.description = atob(applicationDetails.description);
                } catch (e) {
                    console.error(e);
                    this.applicationItem.description = applicationDetails.description;
                }
            }
        });

        //this.applicationDetails$.subscribe((data) => console.log("Application data:", data));
        this.routerSubscription = this.route.params.subscribe(params => {
            this.applicationName = atob(params['name']);
            this.loadApplication();
        });
    }

    ngOnDestroy() {
        this.routerSubscription.unsubscribe();
    }

    back() {
        this.location.back();
    }

    refresh() {
        this.loadApplication();
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

    rebuildApplication() {
        this.lastUpdate = new Date();
        this.store.dispatch(applicationListActions.rebuildApplication({request: {application: this.applicationItem}}));
    }

    applicationLogs() {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {applicationName: this.applicationItem.name, containerId: this.applicationItem.containerId};
        dialogConfig.maxWidth = '100vw';
        dialogConfig.maxHeight = '100vh';
        dialogConfig.panelClass = 'full-screen-modal';
        dialogConfig.width = "80%"

        this.dialog.open(ApplicationLogsDialog, dialogConfig);
    }

    enabledChanged(event: any) {
        this.applicationItem.enabled = event.checked;
        let request: UpdateApplicationRequest = {application: this.applicationItem}
        this.store.dispatch(applicationDetailsActions.updateApplication({request: request}));
        this.lastUpdate = new Date();
    }

    saveApplication() {
        let appItem = {...this.applicationItem};
        appItem.description = btoa(this.applicationItem.description);
        appItem.dockerfile = btoa(this.applicationItem.dockerfile);
        let request: UpdateApplicationRequest = {application: appItem}
        this.store.dispatch(applicationDetailsActions.updateApplication({request: request}));
        this.lastUpdate = new Date();
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

    // ===================================================================================================================
    // Tag
    // ===================================================================================================================
    handleTagPageEvent(e: PageEvent) {
        this.tagPageSize = e.pageSize;
        this.tagPageIndex = e.pageIndex;
        this.tagDatasource = convertObjectToArray(this.applicationItem.tags, e.pageSize, e.pageIndex, this.tagSortColumn);
    }

    tagSortChanged(sortState: Sort) {
        let direction = sortState.direction === 'asc' ? 1 : -1;
        this.tagSortColumn = {column: sortState.active, sortDirection: direction};
        this.tagDatasource = convertObjectToArray(this.applicationItem.tags, this.tagPageSize, this.tagPageIndex, this.tagSortColumn);
    }

    addTag() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        this.dialog.open(ApplicationTagAddDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result?.key && result.value) {
                this.applicationItem.tags[result.key] = result.value;
                let request: UpdateApplicationRequest = {application: this.applicationItem}
                this.store.dispatch(applicationDetailsActions.updateApplication({request: request}));
                this.snackBar.open('Application tag updated, name: ' + result.key, 'Dismiss', {duration: 5000});
            } else {
                this.snackBar.open('Application tag unchanged, name: ' + result.key, 'Dismiss', {duration: 5000});
            }
        });
    }

    editTag(key: string, value: string) {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {key: key, value: value};

        this.dialog.open(ApplicationTagEditDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result?.key && result.value) {
                this.applicationItem.tags[result.key] = result.value;
                let request: UpdateApplicationRequest = {application: this.applicationItem}
                this.store.dispatch(applicationDetailsActions.updateApplication({request: request}));
                this.snackBar.open('Application tag updated, name: ' + result.key, 'Dismiss', {duration: 5000});
            } else {
                this.snackBar.open('Application tag unchanged, name: ' + result.key, 'Dismiss', {duration: 5000});
            }
        });
    }

    deleteTag(key: string) {
        delete this.applicationItem.tags[key];
        let request: UpdateApplicationRequest = {application: this.applicationItem}
        this.store.dispatch(applicationDetailsActions.updateApplication({request: request}));
        this.snackBar.open('Application tag variable deleted, name: ' + key, 'Dismiss', {duration: 5000});
    }

    // ===================================================================================================================
    // Dependency
    // ===================================================================================================================
    handleDependencyPageEvent(e: PageEvent) {
        this.dependencyPageSize = e.pageSize;
        this.dependencyPageIndex = e.pageIndex;
        this.dependencyDatasource = convertArrayToArray(this.applicationItem.dependencies, e.pageSize, e.pageIndex, this.dependencySortColumn);
    }

    dependencySortChanged(sortState: Sort) {
        let direction = sortState.direction === 'asc' ? 1 : -1;
        this.dependencySortColumn = {column: sortState.active, sortDirection: direction};
        this.dependencyDatasource = convertArrayToArray(this.applicationItem.dependencies, this.dependencyPageSize, this.dependencyPageIndex, this.dependencySortColumn);
    }

    addDependency() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {self: this.applicationItem.name};

        this.dialog.open(ApplicationDependencyAddDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result?.name) {
                if (this.applicationItem.dependencies.indexOf('result.name') < 0) {
                    this.applicationItem.dependencies.push(result.name);
                    let request: UpdateApplicationRequest = {application: this.applicationItem}
                    this.store.dispatch(applicationDetailsActions.updateApplication({request: request}));
                    this.snackBar.open('Application dependencies updated, name: ' + result.key, 'Dismiss', {duration: 5000});
                } else {
                    this.snackBar.open('Application dependency exists already, name: ' + result.key, 'Dismiss', {duration: 5000});
                }
            } else {
                this.snackBar.open('Application dependencies unchanged, name: ' + result.key, 'Dismiss', {duration: 5000});
            }
        });
    }

    deleteDependency(name: string) {
        this.applicationItem.dependencies = this.applicationItem.dependencies.filter(dependency => dependency !== name);
        let request: UpdateApplicationRequest = {application: this.applicationItem}
        this.store.dispatch(applicationDetailsActions.updateApplication({request: request}));
        this.snackBar.open('Application dependency deleted, name: ' + name, 'Dismiss', {duration: 5000});
    }
}
