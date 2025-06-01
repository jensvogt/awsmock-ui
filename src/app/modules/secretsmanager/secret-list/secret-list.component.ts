import {Component, OnDestroy, OnInit} from '@angular/core';
import {interval, Observable, Subscription} from "rxjs";
import {PageEvent} from "@angular/material/paginator";
import {Sort} from "@angular/material/sort";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {State, Store} from "@ngrx/store";
import {Location} from "@angular/common";
import {selectPageIndex, selectPageSize, selectPrefix, selectSecretCounters} from "./state/secret-list.selectors";
import {secretListActions} from "./state/secret-list.actions";
import {byteConversion} from "../../../shared/byte-utils.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SecretListState} from "./state/secret-list.reducer";
import {SecretsmanagerService} from "../service/secretsmanager-service.component";
import {ListSecretCountersResponse} from "../model/secret-item";
import {SecretAddDialogComponent} from "../secret-add/secret-add-component";

@Component({
    selector: 'secret-list',
    templateUrl: './secret-list.component.html',
    styleUrls: ['./secret-list.component.scss'],
    standalone: false
})
export class SecretListComponent implements OnInit, OnDestroy {

    // Last update
    lastUpdate: Date = new Date();

    // Observables
    pageSize$: Observable<number> = this.store.select(selectPageSize);
    pageIndex$: Observable<number> = this.store.select(selectPageIndex);
    prefix$: Observable<string> = this.store.select(selectPrefix);
    listSecretCountersResponse$: Observable<ListSecretCountersResponse> = this.store.select(selectSecretCounters);
    columns: any[] = ['secretName', 'secretId', 'created', 'modified', 'actions'];

    // Auto-update
    updateSubscription: Subscription | undefined;

    // Paging
    pageSizeOptions = [5, 10, 20, 50, 100];
    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;
    disabled = false;

    // Prefix
    prefixValue: string = this.state.value['secret-list'].prefix;
    prefixSet: boolean = false;

    // Misc
    protected readonly byteConversion = byteConversion;

    constructor(private snackBar: MatSnackBar, private dialog: MatDialog, private state: State<SecretListState>, private secretsmanagerService: SecretsmanagerService,
                private location: Location, private store: Store) {
        this.prefix$.subscribe((data: string) => {
            this.prefixSet = false;
            if (data && data.length) {
                this.prefixValue = data;
                this.prefixSet = true;
            }
        });
        //this.listSecretCountersResponse$.subscribe((data) => console.log("SecretCounters: ", data));
    }

    ngOnInit(): void {
        this.loadSecrets();
        this.updateSubscription = interval(60000).subscribe(() => this.loadSecrets());
    }

    ngOnDestroy(): void {
        this.updateSubscription?.unsubscribe();
    }

    back() {
        this.location.back();
    }

    refresh() {
        this.loadSecrets();
    }

    setPrefix() {
        this.prefixSet = true;
        this.state.value['secret-list'].pageIndex = 0;
        this.state.value['secret-list'].prefix = this.prefixValue;
        this.loadSecrets();
    }

    unsetPrefix() {
        this.prefixValue = '';
        this.prefixSet = false;
        this.state.value['secret-list'].prefix = '';
        this.loadSecrets();
    }

    handlePageEvent(e: PageEvent) {
        this.state.value['secret-list'].pageSize = e.pageSize;
        this.state.value['secret-list'].pageIndex = e.pageIndex;
        this.loadSecrets();
    }

    sortChange(sortState: Sort) {
        this.state.value['secret-list'].sortColumns = [{column: sortState.active, sortDirection: sortState.direction === 'asc' ? 1 : -1}];
        this.loadSecrets();
    }

    loadSecrets() {
        this.lastUpdate = new Date();
        this.store.dispatch(secretListActions.loadSecrets({
            prefix: this.state.value['secret-list'].prefix,
            pageSize: this.state.value['secret-list'].pageSize,
            pageIndex: this.state.value['secret-list'].pageIndex,
            sortColumns: this.state.value['secret-list'].sortColumns
        }));
    }

    createSecret() {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        this.dialog.open(SecretAddDialogComponent, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                this.secretsmanagerService.createSecret(result).subscribe(() => {
                    this.loadSecrets();
                    this.snackBar.open('Secret created, arn: ' + result, 'Done', {duration: 5000})
                });
            }
        });
    }

    deleteSecret(secretId: string) {
        this.secretsmanagerService.deleteSecret(secretId).subscribe(() => {
            this.loadSecrets()
            this.snackBar.open('Secret deleted, url: ' + secretId, 'Done', {duration: 5000})
        });
    }
}
