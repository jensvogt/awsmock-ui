import {Component, OnDestroy, OnInit} from '@angular/core';
import {PageEvent} from "@angular/material/paginator";
import {Location} from "@angular/common";
import {Sort} from "@angular/material/sort";
import {interval, Observable, Subscription} from "rxjs";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {SortColumn} from "../../../shared/sorting/sorting.component";
import {State, Store} from "@ngrx/store";
import {keyListActions} from "./state/key-list.actions";
import {selectKeyCounters, selectPageIndex, selectPageSize} from "./state/key-list.selectors";
import {KMSKeyListState} from "./state/key-list.reducer";
import {MatSnackBar} from "@angular/material/snack-bar";
import {byteConversion} from "../../../shared/byte-utils.component";
import {ListKeyCountersResponse} from "../model/key-item";
import {KmsService} from "../service/kms-service.component";
import {KeyAddComponentDialog} from "../key-add/key-add.component";
import {KmsKeyAddRequest} from "../model/key-add-request";

@Component({
    selector: 'kms-key-list-component',
    templateUrl: './key-list.component.html',
    styleUrls: ['./key-list.component.scss'],
    standalone: false,
    providers: [KmsService]
})
export class KmsKeyListComponent implements OnInit, OnDestroy {

    // Last update
    lastUpdate: Date = new Date();

    // Table
    pageSize$: Observable<number> = this.store.select(selectPageSize);
    pageIndex$: Observable<number> = this.store.select(selectPageIndex);
    listKeyCountersResponse$: Observable<ListKeyCountersResponse> = this.store.select(selectKeyCounters);
    columns: any[] = ['keyId', 'keyState', 'keyUsage', 'keySpec', 'created', 'modified', 'actions'];

    // Auto-update
    updateSubscription: Subscription | undefined;

    // Paging
    pageSizeOptions = [5, 10, 20, 50, 100];
    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;
    disabled = false;

    // Prefix
    prefixSet: boolean = false;
    prefixValue: string = '';

    // Sorting, default available
    sortColumns: SortColumn[] = [{column: 'name', sortDirection: -1}];
    protected readonly byteConversion = byteConversion;

    constructor(private readonly snackBar: MatSnackBar, private readonly dialog: MatDialog, private readonly location: Location, private readonly state: State<KMSKeyListState>, private readonly store: Store,
                private readonly kmsService: KmsService) {
    }

    ngOnInit(): void {
        this.loadKeys();
        this.updateSubscription = interval(60000).subscribe(() => this.loadKeys());
        //this.listKeyCountersResponse$.subscribe((data) => console.log("Key list data: ", data));
    }

    ngOnDestroy(): void {
        this.updateSubscription?.unsubscribe();
    }

    back() {
        this.location.back();
    }

    refresh() {
        this.loadKeys();
    }

    setPrefix() {
        this.prefixSet = true;
        this.state.value['kms-key-list'].pageIndex = 0;
        this.state.value['kms-key-list'].prefix = this.prefixValue;
        this.loadKeys();
    }

    unsetPrefix() {
        this.prefixValue = '';
        this.prefixSet = false;
        this.state.value['kms-key-list'].prefix = '';
        this.loadKeys();
    }

    handlePageEvent(e: PageEvent) {
        this.state.value['kms-key-list'].pageSize = e.pageSize;
        this.state.value['kms-key-list'].pageIndex = e.pageIndex;
        this.loadKeys();
    }

    sortChange(sortState: Sort) {
        this.state.value['kms-key-list'].sortColumns = [];
        let direction: number;
        let column = 'keyName';
        if (sortState.active === 'availableMessages') {
            column = 'attributes.availableMessages'
        }
        if (sortState.direction === 'asc') {
            direction = 1;
        } else {
            direction = -1;
        }
        this.state.value['kms-key-list'].sortColumns = [{column: column, sortDirection: direction}];
        this.loadKeys();
    }

    loadKeys() {
        this.store.dispatch(keyListActions.loadKeys({
            prefix: this.state.value['kms-key-list'].prefix,
            pageSize: this.state.value['kms-key-list'].pageSize,
            pageIndex: this.state.value['kms-key-list'].pageIndex,
            sortColumns: this.state.value['kms-key-list'].sortColumns
        }));
    }

    addKey() {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        this.dialog.open(KeyAddComponentDialog, dialogConfig).afterClosed().subscribe((result: KmsKeyAddRequest) => {
            if (result) {
                this.kmsService.createKey(result).subscribe(() => {
                    this.loadKeys();
                    this.snackBar.open('KMS key created, name: ' + result.keyUsage, 'Done', {duration: 5000})
                });
            }
        });
    }

    deleteKey(keyArn: string) {
        this.kmsService.deleteKey(keyArn).subscribe(() => {
            this.loadKeys();
            this.snackBar.open('KMS key deleted, keyArn: ' + keyArn, 'Done', {duration: 5000})
        });
    }
}
