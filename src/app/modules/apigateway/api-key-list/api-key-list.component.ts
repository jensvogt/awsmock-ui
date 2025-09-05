import {Component, OnDestroy, OnInit} from '@angular/core';
import {interval, Observable, Subscription} from "rxjs";
import {PageEvent} from "@angular/material/paginator";
import {Sort} from "@angular/material/sort";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {State, Store} from "@ngrx/store";
import {Location} from "@angular/common";
import {selectApiKeysCounters, selectPageIndex, selectPageSize, selectPrefix} from "./state/api-key-list.selectors";
import {apiKeyListActions} from "./state/api-key-list.actions";
import {byteConversion} from "../../../shared/byte-utils.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {AutoReloadComponent} from "../../../shared/autoreload/auto-reload.component";
import {ApiKeyItem, ListApiKeyCountersResponse} from "../model/api-key-item";
import {ApiGatewayService} from "../service/api-gateway-service.component";
import {ApiKeysListState} from "./state/api-key-list.reducer";
import {KeyAddComponentDialog} from "../api-key-add/api-key-add.component";
import {Actions, ofType} from "@ngrx/effects";

@Component({
    selector: 'api-key-list',
    templateUrl: './api-key-list.component.html',
    styleUrls: ['./api-key-list.component.scss'],
    standalone: false
})
export class ApiKeyListComponent implements OnInit, OnDestroy {

    // Last update
    lastUpdate: Date = new Date();

    // Observables
    pageSize$: Observable<number> = this.store.select(selectPageSize);
    pageIndex$: Observable<number> = this.store.select(selectPageIndex);
    prefix$: Observable<string> = this.store.select(selectPrefix);
    listApiKeysCountersResponse$: Observable<ListApiKeyCountersResponse> = this.store.select(selectApiKeysCounters);
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

    constructor(private readonly snackBar: MatSnackBar, private readonly dialog: MatDialog, private readonly state: State<ApiKeysListState>, private _actions$: Actions,
                private readonly location: Location, private readonly store: Store, private readonly router: Router, private readonly apiGatewayService: ApiGatewayService) {
        this.prefix$.subscribe((data: string) => {
            this.prefixSet = false;
            if (data?.length) {
                this.prefixValue = data;
                this.prefixSet = true;
            }
        });
        this._actions$.pipe(ofType("[api-key-list] Add key success")).subscribe(() => {
            this.loadApiKeys();
        });
        this._actions$.pipe(ofType("[api-key-list] Delete key success")).subscribe(() => {
            this.loadApiKeys();
        });
        //this.listApiKeysCountersResponse$.subscribe((data) => console.log("Response load data: ", data));
    }

    ngOnInit(): void {
        this.loadApiKeys();
        const period = parseInt(<string>localStorage.getItem("autoReload"));
        this.updateSubscription = interval(period).subscribe(() => this.loadApiKeys());
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
                this.updateSubscription = interval(period).subscribe(() => this.loadApiKeys());
            }
        });
    }

    back() {
        this.location.back();
    }

    refresh() {
        this.loadApiKeys();
    }

    setPrefix() {
        this.prefixSet = true;
        this.state.value['api-key-list'].pageIndex = 0;
        this.state.value['api-key-list'].prefix = this.prefixValue;
        this.loadApiKeys();
    }

    unsetPrefix() {
        this.prefixValue = '';
        this.prefixSet = false;
        this.state.value['api-key-list'].prefix = '';
        this.loadApiKeys();
    }

    handlePageEvent(e: PageEvent) {
        this.state.value['api-key-list'].pageSize = e.pageSize;
        this.state.value['api-key-list'].pageIndex = e.pageIndex;
        this.loadApiKeys();
    }

    sortChange(sortState: Sort) {
        let direction = sortState.direction === 'asc' ? 1 : -1
        this.state.value['api-key-list'].sortColumns = [{column: sortState.active, sortDirection: direction}];
        this.loadApiKeys();
    }

    navigateToDetails(name: string) {
        this.router.navigate(['/api-key-list/details/' + btoa(name)]);
    }

    loadApiKeys() {
        this.lastUpdate = new Date();
        this.store.dispatch(apiKeyListActions.loadApiKeys({
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
                this.store.dispatch(apiKeyListActions.addApiKey({request: result}));
            }
        });
    }

    deleteApiKey(apiKey: ApiKeyItem) {
        this.lastUpdate = new Date();
        this.store.dispatch(apiKeyListActions.deleteApiKey({id: apiKey.id}));
    }
}
