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
import {ApplicationService} from "../service/application-service.component";
import {ListApplicationCountersResponse} from "../model/application-item";
import {ApplicationListState} from "./state/application-list.reducer";

@Component({
    selector: 'application-list',
    templateUrl: './application-list.component.html',
    styleUrls: ['./application-list.component.scss'],
    standalone: false
})
export class ApplicationListComponent implements OnInit, OnDestroy {

    // Last update
    lastUpdate: Date = new Date();
    loading: boolean = false;

    // Observables
    pageSize$: Observable<number> = this.store.select(selectPageSize);
    pageIndex$: Observable<number> = this.store.select(selectPageIndex);
    prefix$: Observable<string> = this.store.select(selectPrefix);
    listApplicationCountersResponse$: Observable<ListApplicationCountersResponse> = this.store.select(selectApplicationCounters);
    columns: any[] = ['name', 'created', 'modified', 'actions'];

    // Auto-update
    updateSubscription: Subscription | undefined;

    // Paging
    pageSizeOptions = [5, 10, 20, 50, 100];
    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;
    disabled = false;

    // Prefix
    prefixValue: string = this.state.value['ssm-parameter-list'].prefix;
    prefixSet: boolean = false;

    // Misc
    protected readonly byteConversion = byteConversion;
    protected readonly encodeURI = encodeURI;
    protected readonly btoa = btoa;

    constructor(private readonly snackBar: MatSnackBar, private readonly dialog: MatDialog, private readonly state: State<ApplicationListState>, private readonly applicationService: ApplicationService,
                private readonly location: Location, private readonly store: Store, private readonly router: Router) {
        this.prefix$.subscribe((data: string) => {
            this.prefixSet = false;
            if (data?.length) {
                this.prefixValue = data;
                this.prefixSet = true;
            }
        });
        //this.listParameterCountersResponse$.subscribe((data) => console.log("Response load data: ", data));
    }

    ngOnInit(): void {
        this.loadParameters();
        const period = parseInt(<string>localStorage.getItem("autoReload"));
        this.updateSubscription = interval(period).subscribe(() => this.loadParameters());
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
                this.updateSubscription = interval(period).subscribe(() => this.loadParameters());
            }
        });
    }

    back() {
        this.location.back();
    }

    refresh() {
        this.loadParameters();
    }

    setPrefix() {
        this.prefixSet = true;
        this.state.value['ssm-parameter-list'].pageIndex = 0;
        this.state.value['ssm-parameter-list'].prefix = this.prefixValue;
        this.loadParameters();
    }

    unsetPrefix() {
        this.prefixValue = '';
        this.prefixSet = false;
        this.state.value['ssm-parameter-list'].prefix = '';
        this.loadParameters();
    }

    handlePageEvent(e: PageEvent) {
        this.state.value['ssm-parameter-list'].pageSize = e.pageSize;
        this.state.value['ssm-parameter-list'].pageIndex = e.pageIndex;
        this.loadParameters();
    }

    sortChange(sortState: Sort) {
        let column = sortState.active;
        if (sortState.active === 'name') {
            column = 'name'
        }
        let direction = sortState.direction === 'asc' ? 1 : -1
        this.state.value['ssm-parameter-list'].sortColumns = [{column: column, sortDirection: direction}];
        this.loadParameters();
    }

    navigateToDetails(name: string) {
        this.router.navigate(['/ssm-parameter-list/details/' + btoa(name)]);
    }

    loadParameters() {
        this.lastUpdate = new Date();
        this.store.dispatch(applicationListActions.loadApplications({
            prefix: this.state.value['ssm-parameter-list'].prefix,
            pageSize: this.state.value['ssm-parameter-list'].pageSize,
            pageIndex: this.state.value['ssm-parameter-list'].pageIndex,
            sortColumns: this.state.value['ssm-parameter-list'].sortColumns
        }));
    }

    createApplication() {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.maxWidth = '100vw';
        dialogConfig.maxHeight = '100vh';
        dialogConfig.panelClass = 'full-screen-modal';
        dialogConfig.width = "40%"
        dialogConfig.minWidth = '580px'

        /*this.dialog.open(ParameterAddDialogComponent, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                let request: CreateParameterCounterRequest = {
                    name: result.name,
                    value: result.value,
                    description: result.description,
                    type: result.type,
                    kmsKeyArn: result.kmsKeyArn,
                    prefix: this.state.value['ssm-parameter-list'].prefix,
                    pageSize: this.state.value['ssm-parameter-list'].pageSize,
                    pageIndex: this.state.value['ssm-parameter-list'].pageIndex,
                    sortColumns: this.state.value['ssm-parameter-list'].sortColumns
                };
                this.store.dispatch(applicationListActions.createParameter({request: request}));
            }
        });*/
    }

    editParameter(parameter: any) {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.maxWidth = '100vw';
        dialogConfig.maxHeight = '100vh';
        dialogConfig.panelClass = 'full-screen-modal';
        dialogConfig.width = "40%"
        dialogConfig.minWidth = '580px'
        dialogConfig.data = parameter;

        /*    this.dialog.open(ParameterEditDialogComponent, dialogConfig).afterClosed().subscribe(result => {
                if (result) {
                    let request: UpdateParameterCounterRequest = {
                        name: result.name,
                        value: result.value,
                        description: result.description,
                        type: result.type,
                        kmsKeyArn: result.kmsKeyArn,
                        prefix: this.state.value['ssm-parameter-list'].prefix,
                        pageSize: this.state.value['ssm-parameter-list'].pageSize,
                        pageIndex: this.state.value['ssm-parameter-list'].pageIndex,
                        sortColumns: this.state.value['ssm-parameter-list'].sortColumns
                    };
                    this.store.dispatch(applicationListActions.updateParameter({request: request}));
                }
            });*/
    }

    deleteParameter(name: string) {
        this.lastUpdate = new Date();
        /*this.store.dispatch(applicationListActions.deleteParameter({
            name: name,
            prefix: this.state.value['ssm-parameter-list'].prefix,
            pageSize: this.state.value['ssm-parameter-list'].pageSize,
            pageIndex: this.state.value['ssm-parameter-list'].pageIndex,
            sortColumns: this.state.value['ssm-parameter-list'].sortColumns
        }));*/
    }
}
