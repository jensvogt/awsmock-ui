import {Component, OnDestroy, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {byteConversion} from "../../../shared/byte-utils.component";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Store} from "@ngrx/store";
import {GetTableRequest, TableItem} from "../model/table-item";
import {DynamodbService} from "../service/dynamodb.service";
import {tableDetailsActions} from "./state/table-details.actions";
import {Observable} from "rxjs";
import {selectError, selectTableItem} from "./state/table-details.selectors";

@Component({
    selector: 'table-detail-component',
    templateUrl: './table-detail.component.html',
    styleUrls: ['./table-detail.component.scss'],
    standalone: false,
    providers: [DynamodbService]
})
export class TableDetailsComponent implements OnInit, OnDestroy {

    // Last update
    lastUpdate: Date = new Date();

    tableItem = {} as TableItem;
    tableName: string = '';

    tableDetails$: Observable<TableItem> = this.store.select(selectTableItem);
    tableError$: Observable<string> = this.store.select(selectError);

    // Environment
    // environmentColumns: string[] = ['key', 'value', 'actions'];
    // environmentSortColumn: SortColumn = {column: 'key', sortDirection: -1};
    // environmentDatasource: MatTableDataSource<Environment> = {} as MatTableDataSource<Environment>;
    // environmentTotal: number = 0;
    // environmentPageSize: number = 5;
    // environmentPageIndex: number = 0;
    // environmentPageSizeOptions = [5, 10, 20, 50, 100];

    // Tag
    // tagColumns: string[] = ['key', 'value', 'actions'];
    // tagSortColumn: SortColumn = {column: 'key', sortDirection: -1};
    // tagDatasource: MatTableDataSource<Tag> = {} as MatTableDataSource<Tag>;
    // tagTotal: number = 0;
    // tagPageSize: number = 5;
    // tagPageIndex: number = 0;
    // tagPageSizeOptions = [5, 10, 20, 50, 100];

    protected readonly byteConversion = byteConversion;
    private routerSubscription: any;

    constructor(private readonly snackBar: MatSnackBar, private readonly dialog: MatDialog, private readonly location: Location, private readonly route: ActivatedRoute,
                private readonly dynamoDbService: DynamodbService, private readonly store: Store) {
    }

    ngOnInit() {
        this.tableError$.subscribe((message: string) => {
            this.snackBar.open(message);
        });
        this.tableDetails$.subscribe((tableDetails: TableItem) => {
            if (tableDetails === undefined) {
                return;
            }
            this.tableItem = tableDetails;
            console.log(tableDetails);
            // if (this.tableItem.environment) {
            //     this.environmentTotal = Object.keys(this.tableItem.environment).length;
            //     this.environmentDatasource = convertObjectToArray(this.tableItem.environment, this.environmentPageSize, this.environmentPageIndex, this.environmentSortColumn);
            // }
            // if (this.tableItem.tags) {
            //     this.tagTotal = Object.keys(this.tableItem.tags).length;
            //     this.tagDatasource = convertObjectToArray(this.tableItem.tags, this.tagPageSize, this.tagPageIndex, this.tagSortColumn);
            // }
            // if (this.tableItem.dependencies) {
            //     this.dependencyTotal = this.tableItem.dependencies.length;
            //     this.dependencyDatasource = convertArrayToArray(this.tableItem.dependencies, this.dependencyPageSize, this.dependencyPageIndex, this.dependencySortColumn);
            // }
            // if (this.tableItem.description) {
            //     try {
            //         this.tableItem.description = atob(tableDetails.description);
            //     } catch (e) {
            //         console.error(e);
            //         this.tableItem.description = tableDetails.description;
            //     }
            // }
        });

        //this.tableDetails$.subscribe((data) => console.log("Table data:", data));
        this.routerSubscription = this.route.params.subscribe(params => {
            this.tableName = params['tableName'];
            this.loadTable();
        });
    }

    ngOnDestroy() {
        this.routerSubscription.unsubscribe();
    }

    back() {
        this.location.back();
    }

    refresh() {
        this.loadTable();
    }

    loadTable() {
        let request: GetTableRequest = {region: this.dynamoDbService.region, tableName: this.tableName};
        this.store.dispatch(tableDetailsActions.loadTable({request: request}));
        this.lastUpdate = new Date();
    }

    /*
        enabledChanged(event: any) {
            this.tableItem.enabled = event.checked;
            let request: UpdateTableRequest = {table: this.tableItem}
            this.store.dispatch(tableDetailsActions.updateTable({request: request}));
            this.lastUpdate = new Date();
        }*/
    /*
        saveTable() {
            let appItem = {...this.tableItem};
            appItem.description = btoa(this.tableItem.description);
            appItem.dockerfile = btoa(this.tableItem.dockerfile);
            let request: UpdateTableRequest = {table: appItem}
            this.store.dispatch(tableDetailsActions.updateTable({request: request}));
            this.lastUpdate = new Date();
        }*/
}
