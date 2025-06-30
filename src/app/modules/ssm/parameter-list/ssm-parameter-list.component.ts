import {Component, OnDestroy, OnInit} from '@angular/core';
import {interval, Observable, Subscription} from "rxjs";
import {PageEvent} from "@angular/material/paginator";
import {Sort} from "@angular/material/sort";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {State, Store} from "@ngrx/store";
import {Location} from "@angular/common";
import {selectPageIndex, selectPageSize, selectParameterCounters, selectPrefix} from "./state/ssm-parameter-list.selectors";
import {ssmParameterListActions} from "./state/ssm-parameter-list.actions";
import {byteConversion} from "../../../shared/byte-utils.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ListParameterCountersResponse} from "../model/ssm-parameter-item";
import {SsmParameterListState} from "./state/ssm-parameter-list.reducer";
import {SsmService} from "../service/ssm-service.component";
import {Router} from "@angular/router";

@Component({
    selector: 'ssm-parameter-list',
    templateUrl: './ssm-parameter-list.component.html',
    styleUrls: ['./ssm-parameter-list.component.scss'],
    standalone: false
})
export class SsmParameterListComponent implements OnInit, OnDestroy {

    // Last update
    lastUpdate: Date = new Date();
    loading: boolean = false;

    // Observables
    pageSize$: Observable<number> = this.store.select(selectPageSize);
    pageIndex$: Observable<number> = this.store.select(selectPageIndex);
    prefix$: Observable<string> = this.store.select(selectPrefix);
    listParameterCountersResponse$: Observable<ListParameterCountersResponse> = this.store.select(selectParameterCounters);
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

    constructor(private readonly snackBar: MatSnackBar, private readonly dialog: MatDialog, private readonly state: State<SsmParameterListState>, private readonly ssmService: SsmService,
                private readonly location: Location, private readonly store: Store, private readonly router: Router) {
        this.prefix$.subscribe((data: string) => {
            this.prefixSet = false;
            if (data?.length) {
                this.prefixValue = data;
                this.prefixSet = true;
            }
        });
        //this.listQueueCountersResponse$.subscribe((data) => console.log("Data: ", data));
    }

    ngOnInit(): void {
        this.loadParameters();
        this.updateSubscription = interval(60000).subscribe(() => this.loadParameters());
    }

    ngOnDestroy(): void {
        this.updateSubscription?.unsubscribe();
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
        this.store.dispatch(ssmParameterListActions.loadParameters({
            prefix: this.state.value['ssm-parameter-list'].prefix,
            pageSize: this.state.value['ssm-parameter-list'].pageSize,
            pageIndex: this.state.value['ssm-parameter-list'].pageIndex,
            sortColumns: this.state.value['ssm-parameter-list'].sortColumns
        }));
    }

    createParameter() {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        /*this.dialog.open(QueueAddComponentDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                this.ssmService.createQueue(result).subscribe(() => {
                    this.loadQueues();
                    this.snackBar.open('SQS queue created, url: ' + result, 'Done', {duration: 5000})
                });
            }
        });*/
    }

    deleteParameter(name: string) {
        this.lastUpdate = new Date();
        this.store.dispatch(ssmParameterListActions.deleteParameter({
            name: name,
            prefix: this.state.value['ssm-parameter-list'].prefix,
            pageSize: this.state.value['ssm-parameter-list'].pageSize,
            pageIndex: this.state.value['ssm-parameter-list'].pageIndex,
            sortColumns: this.state.value['ssm-parameter-list'].sortColumns
        }));
    }
}
