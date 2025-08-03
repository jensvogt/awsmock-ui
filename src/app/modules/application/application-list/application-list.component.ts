import {Component, OnDestroy, OnInit} from '@angular/core';
import {interval, Observable, Subscription} from "rxjs";
import {PageEvent} from "@angular/material/paginator";
import {Sort} from "@angular/material/sort";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {State, Store} from "@ngrx/store";
import {Location} from "@angular/common";
import {selectApplicationCounters, selectPageIndex, selectPageSize, selectPrefix} from "./state/application-list.selectors";
import {applicationListActions} from "./state/application-list.actions";
import {byteConversion} from "../../../shared/byte-utils.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {AutoReloadComponent} from "../../../shared/autoreload/auto-reload.component";
import {AddApplicationRequest, ApplicationItem, DeleteApplicationRequest, ListApplicationCountersResponse} from "../model/application-item";
import {ApplicationListState} from "./state/application-list.reducer";
import {ApplicationAddDialog} from "../application-add/application-add-dialog.component";
import {ApplicationUploadDialog} from "../application-upload/application-upload-dialog.component";
import {ApplicationService} from "../service/application-service.component";
import {ApplicationLogsDialog} from "../application-logs/application-logs.component";

@Component({
    selector: 'application-list',
    templateUrl: './application-list.component.html',
    styleUrls: ['./application-list.component.scss'],
    standalone: false
})
export class ApplicationListComponent implements OnInit, OnDestroy {

    // Last update
    lastUpdate: Date = new Date();

    // Observables
    pageSize$: Observable<number> = this.store.select(selectPageSize);
    pageIndex$: Observable<number> = this.store.select(selectPageIndex);
    prefix$: Observable<string> = this.store.select(selectPrefix);
    listApplicationCountersResponse$: Observable<ListApplicationCountersResponse> = this.store.select(selectApplicationCounters);
    columns: any[] = ['name', 'version', 'enabled', 'status', 'lastStarted', 'created', 'modified', 'actions'];

    // Auto-update
    updateSubscription: Subscription | undefined;

    // Paging
    pageSizeOptions = [5, 10, 20, 50, 100];
    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;
    disabled = false;

    // Prefix
    prefixValue: string = this.state.value['application-list'].prefix;
    prefixSet: boolean = false;

    // Misc
    protected readonly byteConversion = byteConversion;

    constructor(private readonly snackBar: MatSnackBar, private readonly dialog: MatDialog, private readonly state: State<ApplicationListState>,
                private readonly location: Location, private readonly store: Store, private readonly router: Router, private readonly applicationService: ApplicationService) {
        this.prefix$.subscribe((data: string) => {
            this.prefixSet = false;
            if (data?.length) {
                this.prefixValue = data;
                this.prefixSet = true;
            }
        });
        //this.listApplicationCountersResponse$.subscribe((data) => console.log("Response load data: ", data));
    }

    ngOnInit(): void {
        this.loadApplications();
        const period = parseInt(<string>localStorage.getItem("autoReload"));
        this.updateSubscription = interval(period).subscribe(() => this.loadApplications());
    }

    ngOnDestroy(): void {
        this.updateSubscription?.unsubscribe();
    }

    autoReload(): void {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.maxWidth = '100vw';
        dialogConfig.maxHeight = '100vh';
        dialogConfig.panelClass = 'full-screen-modal';
        dialogConfig.width = "20%"
        dialogConfig.minWidth = '280px'
        dialogConfig.data = {title: 'Export modules', mode: 'export'};

        this.dialog.open(AutoReloadComponent, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                const period = parseInt(<string>localStorage.getItem("autoReload"));
                this.updateSubscription?.unsubscribe();
                this.updateSubscription = interval(period).subscribe(() => this.loadApplications());
            }
        });
    }

    back() {
        this.location.back();
    }

    refresh() {
        this.loadApplications();
    }

    setPrefix() {
        this.prefixSet = true;
        this.state.value['application-list'].pageIndex = 0;
        this.state.value['application-list'].prefix = this.prefixValue;
        this.loadApplications();
    }

    unsetPrefix() {
        this.prefixValue = '';
        this.prefixSet = false;
        this.state.value['application-list'].prefix = '';
        this.loadApplications();
    }

    handlePageEvent(e: PageEvent) {
        this.state.value['application-list'].pageSize = e.pageSize;
        this.state.value['application-list'].pageIndex = e.pageIndex;
        this.loadApplications();
    }

    sortChange(sortState: Sort) {
        let direction = sortState.direction === 'asc' ? 1 : -1
        this.state.value['application-list'].sortColumns = [{column: sortState.active, sortDirection: direction}];
        this.loadApplications();
    }

    navigateToDetails(name: string) {
        this.router.navigate(['/application-list/details/' + btoa(name)]);
    }

    loadApplications() {
        this.lastUpdate = new Date();
        this.store.dispatch(applicationListActions.loadApplications({
            prefix: this.state.value['application-list'].prefix,
            pageSize: this.state.value['application-list'].pageSize,
            pageIndex: this.state.value['application-list'].pageIndex,
            sortColumns: this.state.value['application-list'].sortColumns
        }));
    }

    startAll() {
        this.lastUpdate = new Date();
        this.store.dispatch(applicationListActions.startAllApplications());
    }

    stopAll() {
        this.lastUpdate = new Date();
        this.store.dispatch(applicationListActions.stopAllApplications());
    }

    restartAll() {
        this.lastUpdate = new Date();
        this.store.dispatch(applicationListActions.restartAllApplications());
    }

    uploadCode(application: ApplicationItem) {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {applicationName: application.name};
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

    startApplication(application: ApplicationItem) {
        this.lastUpdate = new Date();
        this.store.dispatch(applicationListActions.startApplication({request: {application: application}}));
    }

    stopApplication(application: ApplicationItem) {
        this.lastUpdate = new Date();
        this.store.dispatch(applicationListActions.stopApplication({request: {application: application}}));
    }

    restartApplication(application: ApplicationItem) {
        this.lastUpdate = new Date();
        this.store.dispatch(applicationListActions.restartApplication({request: {application: application}}));
    }

    rebuildApplication(application: ApplicationItem) {
        this.lastUpdate = new Date();
        this.store.dispatch(applicationListActions.rebuildApplication({request: {application: application}}));
    }

    applicationLogs(application: ApplicationItem) {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {applicationName: application.name, containerId: application.containerId};
        dialogConfig.maxWidth = '100%';
        dialogConfig.maxHeight = '100%';
        dialogConfig.panelClass = 'full-screen-modal';
        dialogConfig.width = "80%";

        this.dialog.open(ApplicationLogsDialog, dialogConfig);
    }

    startDisabled(application: ApplicationItem) {
        return application.status === "RUNNING";
    }

    stopDisabled(application: ApplicationItem) {
        return application.status !== "RUNNING";
    }

    addApplication() {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.maxWidth = '100vw';
        dialogConfig.maxHeight = '100vh';
        dialogConfig.panelClass = 'full-screen-modal';
        dialogConfig.width = "40%"
        dialogConfig.minWidth = '580px'

        this.dialog.open(ApplicationAddDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                let request: AddApplicationRequest = {
                    application: result.application,
                    prefix: this.state.value['application-list'].prefix,
                    pageSize: this.state.value['application-list'].pageSize,
                    pageIndex: this.state.value['application-list'].pageIndex,
                    sortColumns: this.state.value['application-list'].sortColumns,
                    code: result.content
                };
                this.store.dispatch(applicationListActions.addApplication({request: request}));
            }
        });
    }

    deleteApplication(application: ApplicationItem) {
        this.lastUpdate = new Date();
        let request: DeleteApplicationRequest = {
            name: application.name,
            prefix: this.state.value['application-list'].prefix,
            pageSize: this.state.value['application-list'].pageSize,
            pageIndex: this.state.value['application-list'].pageIndex,
            sortColumns: this.state.value['application-list'].sortColumns
        };
        this.store.dispatch(applicationListActions.deleteApplication({request: request}));
    }
}
