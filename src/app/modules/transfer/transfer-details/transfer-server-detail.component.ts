import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {MatSnackBar} from "@angular/material/snack-bar";
import {State, Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {TransferService} from "../service/transfer.service";
import {TransferServerDetailsResponse} from "../model/transfer-server-details";
import {TransferServerDetailsState} from "./state/transfer-server-detail.reducer";
import {selectDetails, selectError, selectProtocolPageIndex, selectProtocolPageSize, selectProtocols, selectUserPageIndex, selectUserPageSize, selectUsers} from "./state/transfer-server-detail.selectors";
import {transferServerDetailActions} from "./state/transfer-server-detail.actions";
import {TransferServerUsersResponse} from "../model/transfer-server-users";
import {PageEvent} from "@angular/material/paginator";
import {Sort} from "@angular/material/sort";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {TransferServerProtocolsResponse} from "../model/transfer-server-protocols";
import {UserAddComponentDialog} from "./user-add/user-add-component";
import {ProtocolAddComponentDialog} from "./protocol-add/protocol-add-component";

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

    // Protocol table
    protocols$: Observable<TransferServerProtocolsResponse> = this.store.select(selectProtocols);
    protocolPageSize$: Observable<number> = this.store.select(selectProtocolPageSize);
    protocolPageIndex$: Observable<number> = this.store.select(selectProtocolPageIndex);
    protocolColumns: any[] = ['name', 'port', 'actions'];
    protocolPageSizeOptions = [5, 10, 20, 50, 100];

    // SFTP client
    client: any;
    private routerSubscription: any;

    constructor(private snackBar: MatSnackBar, private transferService: TransferService, private route: ActivatedRoute, private dialog: MatDialog,
                private location: Location, private store: Store, private state: State<TransferServerDetailsState>) {
        // this.client = new SftpClient();
    }

    ngOnInit() {
        this.routerSubscription = this.route.params.subscribe(params => {
            this.serverId = params['serverId'];
            this.loadTransferServerDetails();
            this.loadUsers();
            this.loadProtocols();
        });
        this.serverDetailsError$.subscribe((msg: string) => {
            if (msg && msg.length) {
                this.snackBar.open("ErrorMessage: " + msg.toString())
            }
        });
        //this.serverDetails$.subscribe((data) => console.log("Data: ", data));
        //this.users$.subscribe((data) => console.log("Data: ", data));
        //this.protocols$.subscribe((data) => console.log("Protocols: ", data));
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

    getPorts() {
        return "2121, 2222";
    }

    async upload() {

        /*  await this.connect({host: "localhost", port: 2222, username: "ftpuser1", password: ""});
          let fileObjects;
          try {
              fileObjects = await this.client.list("/tmp");
          } catch (err) {
              console.log('Listing failed:', err);
          }

          const fileNames = [];

          for (const file of fileObjects) {
              if (file.type === 'd') {
                  console.log(`${new Date(file.modifyTime).toISOString()} PRE ${file.name}`);
              } else {
                  console.log(`${new Date(file.modifyTime).toISOString()} ${file.size} ${file.name}`);
              }

              fileNames.push(file.name);
          }*/
    }

    //
    // async connect(options: { host: any; port: any; username: any; password: any }) {
    //     console.log(`Connecting to ${options.host}:${options.port}`);
    //     try {
    //         await this.client.connect(options);
    //     } catch (err) {
    //         console.log('Failed to connect:', err);
    //     }
    // }

    // ===================================================================================================================
    // Users
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

    addUser() {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        this.dialog.open(UserAddComponentDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                this.transferService.addUser(this.serverId, result.username, result.password).subscribe(() => {
                    this.loadUsers();
                    this.snackBar.open('User added, username: ' + result.username, 'Done', {duration: 5000})
                });
            }
        });

    }

    refreshUsers() {
        this.loadUsers();
        this.loadProtocols();
    }

    deleteUser(name: string) {
        this.transferService.deleteUser(this.serverId, name)
            .subscribe(() => {
                this.loadUsers();
                this.snackBar.open('Transfer user deleted, name: ' + name, 'Dismiss', {duration: 5000});
            });
    }

    // ===================================================================================================================
    // Protocols
    // ===================================================================================================================
    handleProtocolPageEvent(e: PageEvent) {
        this.state.value['transfer-server-details'].tagPageSize = e.pageSize;
        this.state.value['transfer-server-details'].tagPageIndex = e.pageIndex;
        this.loadProtocols();
    }

    loadProtocols() {
        this.store.dispatch(transferServerDetailActions.loadProtocols({
            serverId: this.serverId,
            pageSize: this.state.value['transfer-server-details'].protocolPageSize,
            pageIndex: this.state.value['transfer-server-details'].protocolPageIndex,
            sortColumns: this.state.value['transfer-server-details'].sortColumns
        }));
        this.lastUpdate = new Date();
    }

    protocolSortChange(sortState: Sort) {
        this.state.value['transfer-server-details'].sortColumns = [];
        let column = sortState.active;
        let direction = sortState.direction === 'asc' ? 1 : -1;
        this.state.value['transfer-server-details'].sortColumns = [{column: column, sortDirection: direction}];
        this.loadProtocols();
    }

    refreshProtocols() {
        this.loadProtocols();
    }

    addProtocol() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        this.dialog.open(ProtocolAddComponentDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                console.log("Result: ", result);
                this.transferService.addProtocol(this.serverId, result.protocol, result.port).subscribe(() => {
                    this.loadProtocols();
                    this.snackBar.open('Protocol added, protocol: ' + result.protocol, 'Done', {duration: 5000})
                });
            }
        });
    }

    deleteProtocol(protocol: string) {
        this.transferService.deleteProtocol(this.serverId, protocol)
            .subscribe(() => {
                this.loadProtocols();
                this.snackBar.open('Transfer protocol deleted, protocol: ' + protocol, 'Dismiss', {duration: 5000});
            });
    }
}
