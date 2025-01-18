import {MatDialog} from "@angular/material/dialog";
import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {MatSnackBar} from "@angular/material/snack-bar";
import {State, Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {TransferService} from "../service/transfer-service.component";
import {TransferServerDetailsResponse} from "../model/transfer-server-details";
import {TransferServerDetailsState} from "./state/transfer-server-detail.reducer";
import {selectDetails, selectError, selectUserPageIndex, selectUserPageSize, selectUsers} from "./state/transfer-server-detail.selectors";
import {transferServerDetailActions} from "./state/transfer-server-detail.actions";
import {TransferServerUsersResponse} from "../model/transfer-server-users";
import {PageEvent} from "@angular/material/paginator";
import {Sort} from "@angular/material/sort";
import {MatTabChangeEvent} from "@angular/material/tabs";

@Component({
    selector: 'transfer-server-detail-component',
    templateUrl: './transfer-server-detail.component.html',
    styleUrls: ['./transfer-server-detail.component.scss'],
    standalone: false,
    providers: [TransferService]
})
export class TransferServerDetailComponent implements OnInit, OnDestroy {

    // Last update
    lastUpdate: Date = new Date();

    // Server details
    serverId: string = '';
    serverDetails$: Observable<TransferServerDetailsResponse> = this.store.select(selectDetails);
    serverDetailsError$: Observable<string> = this.store.select(selectError);

    // User table
    users$: Observable<TransferServerUsersResponse> = this.store.select(selectUsers);
    userPageSize$: Observable<number> = this.store.select(selectUserPageSize);
    userPageIndex$: Observable<number> = this.store.select(selectUserPageIndex);
    userColumns: any[] = ['name', 'password', 'actions'];
    userPageSizeOptions = [5, 10, 20, 50, 100];

    private routerSubscription: any;

    constructor(private snackBar: MatSnackBar, private transferService: TransferService, private route: ActivatedRoute, private dialog: MatDialog,
                private location: Location, private store: Store, private state: State<TransferServerDetailsState>) {
    }

    ngOnInit() {
        this.routerSubscription = this.route.params.subscribe(params => {
            this.serverId = params['serverId'];
            this.loadTransferServerDetails();
            this.loadUsers();
        });
        this.serverDetailsError$.subscribe((msg: string) => {
            if (msg && msg.length) {
                this.snackBar.open("ErrorMessage: " + msg.toString())
            }
        });
        // this.serverDetails$.subscribe((data) => console.log("Data: ", data));
        //this.users$.subscribe((data) => console.log("Data: ", data));
    }

    ngOnDestroy() {
        this.routerSubscription.unsubscribe();
    }

    back() {
        this.location.back();
    }

    refresh() {
        this.loadTransferServerDetails();
    }

    onTabChanged(e: MatTabChangeEvent) {
        console.log("Event: ", e.tab.textLabel);
        if (e.tab.textLabel == 'Users') {
            this.loadUsers();
        }
    }

    // ===================================================================================================================
    // Details
    // ===================================================================================================================
    loadTransferServerDetails() {
        this.store.dispatch(transferServerDetailActions.loadTransferServerDetails({serverId: this.serverId}));
        this.lastUpdate = new Date();
    }

    // ===================================================================================================================
    // Tags
    // ===================================================================================================================
    handleUserPageEvent(e: PageEvent) {
        this.state.value['transfer-server-details'].tagPageSize = e.pageSize;
        this.state.value['transfer-server-details'].tagPageIndex = e.pageIndex;
        this.loadUsers();
    }

    loadUsers() {
        this.store.dispatch(transferServerDetailActions.loadUsers({
            serverId: this.serverId,
            pageSize: this.state.value['transfer-server-details'].tagPageSize,
            pageIndex: this.state.value['transfer-server-details'].tagPageIndex,
            sortColumns: this.state.value['transfer-server-details'].sortColumns
        }));
        this.lastUpdate = new Date();
    }

    userSortChange(sortState: Sort) {
        this.state.value['transfer-server-details'].sortColumns = [];
        let column = sortState.active;
        let direction = sortState.direction === 'asc' ? 1 : -1;
        this.state.value['transfer-server-details'].sortColumns = [{column: column, sortDirection: direction}];
        this.loadUsers();
    }

    refreshUsers() {
        this.loadUsers();
    }

    deleteUser(name: string) {
        this.transferService.deleteUser(this.serverId, name)
            .subscribe(() => {
                this.loadUsers();
                this.snackBar.open('Transfer user deleted, name: ' + name, 'Dismiss', {duration: 5000});
            });
    }
}
