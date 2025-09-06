import {Component, OnDestroy, OnInit} from '@angular/core';
import {interval, Observable, Subscription} from "rxjs";
import {PageEvent} from "@angular/material/paginator";
import {Sort} from "@angular/material/sort";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {State, Store} from "@ngrx/store";
import {Location} from "@angular/common";
import {selectPageIndex, selectPageSize, selectPrefix, selectRestApisCounters} from "./state/rest-api-list.selectors";
import {restApiListActions} from "./state/rest-api-list.actions";
import {byteConversion} from "../../../shared/byte-utils.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {AutoReloadComponent} from "../../../shared/autoreload/auto-reload.component";
import {ApiKeyItem} from "../model/api-key-item";
import {ApiGatewayService} from "../service/api-gateway-service.component";
import {KeyAddComponentDialog} from "../api-key-add/api-key-add.component";
import {Actions, ofType} from "@ngrx/effects";
import {ListRestApiCountersResponse} from "../model/rest-api-item";
import {RestApisListState} from "./state/rest-api-list.reducer";

@Component({
    selector: 'rest-api-list',
    templateUrl: './rest-api-list.component.html',
    styleUrls: ['./rest-api-list.component.scss'],
    standalone: false
})
export class RestApiListComponent implements OnInit, OnDestroy {

    // Last update
    lastUpdate: Date = new Date();

    // Observables
    pageSize$: Observable<number> = this.store.select(selectPageSize);
    pageIndex$: Observable<number> = this.store.select(selectPageIndex);
    prefix$: Observable<string> = this.store.select(selectPrefix);
    listRestApiCountersResponse$: Observable<ListRestApiCountersResponse> = this.store.select(selectRestApisCounters);
    columns: any[] = ['name', 'id', 'enabled', 'created', 'modified', 'actions'];

    // Auto-update
    updateSubscription: Subscription | undefined;

    // Paging
    pageSizeOptions = [5, 10, 20, 50, 100];
    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;
    disabled = false;

    // Prefix
    prefixValue: string = this.state.value['api-key-list'].prefix;
    prefixSet: boolean = false;

    // Misc
    protected readonly byteConversion = byteConversion;

    constructor(private readonly snackBar: MatSnackBar, private readonly dialog: MatDialog, private readonly state: State<RestApisListState>, private readonly _actions$: Actions,
                private readonly location: Location, private readonly store: Store, private readonly router: Router, private readonly apiGatewayService: ApiGatewayService) {
        this.prefix$.subscribe((data: string) => {
            this.prefixSet = false;
            if (data?.length) {
                this.prefixValue = data;
                this.prefixSet = true;
            }
        });
        this._actions$.pipe(ofType("[api-key-list] Add key success")).subscribe(() => {
            this.loadRestApis();
        });
        this._actions$.pipe(ofType("[api-key-list] Delete key success")).subscribe(() => {
            this.loadRestApis();
        });
        //this.listApiKeysCountersResponse$.subscribe((data) => console.log("Response load data: ", data));
    }

    ngOnInit(): void {
        this.loadRestApis();
        const period = parseInt(<string>localStorage.getItem("autoReload"));
        this.updateSubscription = interval(period).subscribe(() => this.loadRestApis());
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
                this.updateSubscription = interval(period).subscribe(() => this.loadRestApis());
            }
        });
    }

    back() {
        this.location.back();
    }

    refresh() {
        this.loadRestApis();
    }

    setPrefix() {
        this.prefixSet = true;
        this.state.value['api-key-list'].pageIndex = 0;
        this.state.value['api-key-list'].prefix = this.prefixValue;
        this.loadRestApis();
    }

    unsetPrefix() {
        this.prefixValue = '';
        this.prefixSet = false;
        this.state.value['api-key-list'].prefix = '';
        this.loadRestApis();
    }

    handlePageEvent(e: PageEvent) {
        this.state.value['api-key-list'].pageSize = e.pageSize;
        this.state.value['api-key-list'].pageIndex = e.pageIndex;
        this.loadRestApis();
    }

    sortChange(sortState: Sort) {
        let direction = sortState.direction === 'asc' ? 1 : -1
        this.state.value['api-key-list'].sortColumns = [{column: sortState.active, sortDirection: direction}];
        this.loadRestApis();
    }

    loadRestApis() {
        this.lastUpdate = new Date();
        this.store.dispatch(restApiListActions.loadRestApis({
            prefix: this.state.value['api-key-list'].prefix,
            pageSize: this.state.value['api-key-list'].pageSize,
            pageIndex: this.state.value['api-key-list'].pageIndex,
            sortColumns: this.state.value['api-key-list'].sortColumns
        }));
    }

    addApiKey() {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.maxWidth = '100vw';
        dialogConfig.maxHeight = '100vh';
        dialogConfig.panelClass = 'full-screen-modal';
        dialogConfig.width = "40%"
        dialogConfig.minWidth = '580px'

        this.dialog.open(KeyAddComponentDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                this.store.dispatch(restApiListActions.addRestApi({request: result}));
            }
        });
    }

    deleteApiKey(apiKey: ApiKeyItem) {
        this.lastUpdate = new Date();
        this.store.dispatch(restApiListActions.deleteRestApi({id: apiKey.id}));
    }
}
