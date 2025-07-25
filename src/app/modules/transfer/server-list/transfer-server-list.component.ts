import {Component, OnDestroy, OnInit} from '@angular/core';
import {interval, Observable, Subscription} from "rxjs";
import {PageEvent} from "@angular/material/paginator";
import {Sort} from "@angular/material/sort";
import {State, Store} from "@ngrx/store";
import {Location} from "@angular/common";
import {selectPageIndex, selectPageSize, selectPrefix, selectTransferServerCounters} from "./state/transfer-server-list.selectors";
import {transferServerListActions} from "./state/transfer-server-list.actions";
import {TransferServerListState} from "./state/transfer-server-list.reducer";
import {byteConversion} from "../../../shared/byte-utils.component";
import {ListTransferServerCountersResponse} from "../model/transfer-server-item";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AutoReloadComponent} from "../../../shared/autoreload/auto-reload.component";

@Component({
    selector: 'transfer-server-list',
    templateUrl: './transfer-server-list.component.html',
    styleUrls: ['./transfer-server-list.component.scss'],
    standalone: false
})
export class TransferServerListComponent implements OnInit, OnDestroy {

    // Last update
    lastUpdate: Date = new Date();

    // Observables
    pageSize$: Observable<number> = this.store.select(selectPageSize);
    pageIndex$: Observable<number> = this.store.select(selectPageIndex);
    prefix$: Observable<string> = this.store.select(selectPrefix);
    listTransferServerCountersResponse$: Observable<ListTransferServerCountersResponse> = this.store.select(selectTransferServerCounters);
    columns: any[] = ['serverId', 'created', 'modified', 'actions'];

    // Auto-update
    updateSubscription: Subscription | undefined;

    // Paging
    pageSizeOptions = [5, 10, 20, 50, 100];
    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;
    disabled = false;

    // Prefix
    prefixValue: string = this.state.value['transfer-server-list'].prefix;
    prefixSet: boolean = false;
    protected readonly byteConversion = byteConversion;

    constructor(private readonly state: State<TransferServerListState>, private readonly location: Location, private readonly store: Store, private readonly dialog: MatDialog) {
        this.prefix$.subscribe((data: string) => {
            this.prefixSet = false;
            if (data?.length) {
                this.prefixValue = data;
                this.prefixSet = true;
            }
        });
        //this.listTransferServerCountersResponse$.subscribe((data) => console.log("Transfer server data: ", data));
    }

    ngOnInit(): void {
        this.loadTransferServer();
        const period = parseInt(<string>localStorage.getItem("autoReload"));
        this.updateSubscription = interval(period).subscribe(() => this.loadTransferServer());
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

        this.dialog.open(AutoReloadComponent, dialogConfig).afterClosed().subscribe((result) => {
            if (result) {
                const period = parseInt(<string>localStorage.getItem("autoReload"));
                this.updateSubscription?.unsubscribe();
                this.updateSubscription = interval(period).subscribe(() => this.loadTransferServer());
            }
        });
    }

    back() {
        this.location.back();
    }

    refresh() {
        this.loadTransferServer();
    }

    setPrefix() {
        this.prefixSet = true;
        this.state.value['transfer-server-list'].pageIndex = 0;
        this.state.value['transfer-server-list'].prefix = this.prefixValue;
        this.loadTransferServer();
    }

    unsetPrefix() {
        this.prefixValue = '';
        this.prefixSet = false;
        this.state.value['transfer-server-list'].prefix = '';
        this.loadTransferServer();
    }

    handlePageEvent(e: PageEvent) {
        this.state.value['transfer-server-list'].pageSize = e.pageSize;
        this.state.value['transfer-server-list'].pageIndex = e.pageIndex;
        this.loadTransferServer();
    }

    sortChange(sortState: Sort) {
        this.state.value['transfer-server-list'].sortColumns = [];
        let column = sortState.active;
        let direction;
        if (sortState.direction === 'asc') {
            direction = 1;
        } else {
            direction = -1;
        }
        this.state.value['transfer-server-list'].sortColumns = [{column: column, sortDirection: direction}];
        this.loadTransferServer();
    }

    loadTransferServer() {
        this.lastUpdate = new Date();
        this.store.dispatch(transferServerListActions.loadTransferServer({
            prefix: this.state.value['transfer-server-list'].prefix,
            pageSize: this.state.value['transfer-server-list'].pageSize,
            pageIndex: this.state.value['transfer-server-list'].pageIndex,
            sortColumns: this.state.value['transfer-server-list'].sortColumns
        }));
    }

    deleteTransferServer(serverId: string) {
        this.store.dispatch(transferServerListActions.deleteTransferServer({serverId: serverId}));
    }
}
