import {Component, OnDestroy, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {interval, Observable, Subscription} from "rxjs";
import {PageEvent} from "@angular/material/paginator";
import {Sort} from "@angular/material/sort";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SortColumn} from "../../../shared/sorting/sorting.component";
import {CognitoService} from "../../../services/cognito.service";
import {State, Store} from "@ngrx/store";
import {selectItemCounters, selectPageIndex, selectPageSize, selectPrefix} from "./state/dynamodb-item-list.selectors";
import {ItemCountersResponse, ItemItem, PutItemRequest} from "../model/item-item";
import {dynamodbItemListActions} from "./state/dynamodb-item-list.actions";
import {byteConversion} from "../../../shared/byte-utils.component";
import {DynamodbService} from "../service/dynamodb.service";
import {DynamodbItemListState} from "./state/dynamodb-item-list.reducer";
import {ActivatedRoute} from "@angular/router";
import {DynamodbViewItemDialog} from "./view-item/view-item.component";
import {DynamoDbAddItemDialog} from "./add-item/add-item.component";
import {AutoReloadComponent} from "../../../shared/autoreload/auto-reload.component";

@Component({
    selector: 'dynamodb-item-list',
    templateUrl: './item-list.component.html',
    styleUrls: ['./item-list.component.scss'],
    standalone: false,
    providers: [CognitoService]
})
export class DynamodbItemListComponent implements OnInit, OnDestroy {

    // Last update
    lastUpdate: Date = new Date();

    // Table
    tableName: string = '';

    // Item
    pageSize$: Observable<number> = this.store.select(selectPageSize);
    pageIndex$: Observable<number> = this.store.select(selectPageIndex);
    prefix$: Observable<string> = this.store.select(selectPrefix);
    listItemCountersResponse$: Observable<ItemCountersResponse> = this.store.select(selectItemCounters);
    columns: any[] = ['id', 'size', 'created', 'modified', 'actions'];

    // Auto-update
    updateSubscription: Subscription | undefined;

    // Paging
    pageSizeOptions = [5, 10, 20, 50, 100];
    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;
    disabled = false;

    // Sorting
    sortColumns: SortColumn[] = [];

    // Prefix
    prefixValue: string = this.state.value['dynamodb-item-list'].prefix;
    prefixSet: boolean = false;

    protected readonly byteConversion = byteConversion;
    private routerSubscription: Subscription | undefined;

    constructor(private readonly snackBar: MatSnackBar, private readonly route: ActivatedRoute, private readonly dialog: MatDialog, private readonly location: Location, private readonly state: State<DynamodbItemListState>,
                private readonly store: Store, private readonly dynamodbService: DynamodbService) {
        this.prefix$.subscribe((data: string) => {
            this.prefixSet = false;
            if (data?.length) {
                this.prefixValue = data;
                this.prefixSet = true;
            }
        });
        //this.listItemCountersResponse$.subscribe((data) => console.log("Data: ", data));
    }

    ngOnInit(): void {
        this.routerSubscription = this.route.params.subscribe(params => {
            this.tableName = decodeURI(params['tableName']);
        });
        this.loadItems();
        const period = parseInt(<string>localStorage.getItem("autoReload"));
        this.updateSubscription = interval(period).subscribe(() => this.loadItems());
    }

    ngOnDestroy(): void {
        this.updateSubscription?.unsubscribe();
        this.routerSubscription?.unsubscribe();
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
                this.updateSubscription = interval(period).subscribe(() => this.loadItems());
            }
        });
    }

    setPrefix() {
        this.prefixSet = true;
        this.state.value['dynamodb-item-list'].pageIndex = 0;
        this.state.value['dynamodb-item-list'].prefix = this.prefixValue;
        this.loadItems();
    }

    unsetPrefix() {
        this.prefixValue = '';
        this.prefixSet = false;
        this.state.value['dynamodb-item-list'].prefix = '';
        this.loadItems();
    }

    back() {
        this.location.back();
    }

    refresh() {
        this.loadItems();
    }

    handlePageEvent(e: PageEvent) {
        this.state.value['dynamodb-item-list'].pageSize = e.pageSize;
        this.state.value['dynamodb-item-list'].pageIndex = e.pageIndex;
        this.loadItems();
    }

    sortChange(sortState: Sort) {
        this.sortColumns = [];
        if (sortState.direction === 'asc') {
            this.sortColumns.push({column: sortState.active, sortDirection: 1});
        } else {
            this.sortColumns.push({column: sortState.active, sortDirection: -1});
        }
        this.loadItems();
    }

    loadItems() {
        this.lastUpdate = new Date();
        this.store.dispatch(dynamodbItemListActions.loadItems({
            tableName: this.tableName,
            prefix: this.state.value['dynamodb-item-list'].prefix,
            pageSize: this.state.value['dynamodb-item-list'].pageSize,
            pageIndex: this.state.value['dynamodb-item-list'].pageIndex,
            sortColumns: this.state.value['dynamodb-item-list'].sortColumns
        }));
    }

    addItem() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {tableName: this.tableName};
        dialogConfig.maxWidth = '100vw';
        dialogConfig.maxHeight = '100vh';
        dialogConfig.panelClass = 'full-screen-modal';
        dialogConfig.width = "70%"

        this.dialog.open(DynamoDbAddItemDialog, dialogConfig).afterClosed().subscribe((result: PutItemRequest) => {
            if (result) {
                this.dynamodbService.putItem(result)
                    .subscribe(() => {
                        this.snackBar.open('Item added, tableName: ' + this.tableName, 'Done', {duration: 5000});
                        this.loadItems();
                    });
            }
        });
    }

    editItem(item: ItemItem) {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {tableName: this.tableName, item: item};
        dialogConfig.maxWidth = '100vw';
        dialogConfig.maxHeight = '100vh';
        dialogConfig.panelClass = 'full-screen-modal';
        dialogConfig.width = "70%"

        this.dialog.open(DynamodbViewItemDialog, dialogConfig).afterClosed().subscribe((result: PutItemRequest) => {
            if (result) {
                this.dynamodbService.putItem(result)
                    .subscribe(() => {
                        this.snackBar.open('Item updated, tableName: ' + this.tableName, 'Done', {duration: 5000});
                        this.loadItems();
                    });
            }
        });
    }

    deleteItem(item: ItemItem) {
        this.dynamodbService.deleteItem(this.tableName, item.keys)
            .subscribe(() => {
                this.snackBar.open('Item deleted, ID: ' + item.id, 'Done', {duration: 5000});
                this.loadItems();
            });
    }
}
