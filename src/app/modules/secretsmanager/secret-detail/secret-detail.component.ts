import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Location} from "@angular/common";
import {State, Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {
    selectDetails,
    selectError,
    selectRotationLambdaARNs,
    selectTagPageIndex,
    selectTagPageSize,
    selectTags,
    selectVersionPageIndex,
    selectVersionPageSize,
    selectVersions
} from "./state/secret-detail.selectors";
import {PageEvent} from "@angular/material/paginator";
import {Sort} from "@angular/material/sort";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {LoadLambdaArnsResponse, RotateSecretRequest, SecretDetails} from "../model/secret-detail-item";
import {SecretTagCountersResponse} from "../model/secret-tag-item";
import {SecretDetailsState} from "./state/secret-detail.reducer";
import {secretDetailsActions} from "./state/secret-detail.actions";
import {SecretVersionCountersResponse} from "../model/secret-version-item";
import * as uuid from 'uuid';
import {SecretAddDialogComponent} from "../secret-add/secret-add-component";
import {SecretValueEditDialogComponent} from "./value-edit/value-edit-component";

interface LambdaSelect {
    value: string;
    label: string;
}

@Component({
    selector: 'sqs-secret-detail-component',
    templateUrl: './secret-detail.component.html',
    styleUrls: ['./secret-detail.component.scss'],
    standalone: false
})
export class SecretDetailComponent implements OnInit, OnDestroy {
    lastUpdate: Date = new Date();

    secretArn: string = '';
    secretUrl: string = '';
    secretName: string = '';
    secretId: string = '';
    secret: SecretDetails = {} as SecretDetails;
    secretDetails$: Observable<SecretDetails> = this.store.select(selectDetails);
    secretDetailsError$: Observable<string> = this.store.select(selectError);

    // Secret versions
    secretVersions$: Observable<SecretVersionCountersResponse> = this.store.select(selectVersions);
    versionPageSize$: Observable<number> = this.store.select(selectVersionPageSize);
    versionPageIndex$: Observable<number> = this.store.select(selectVersionPageIndex);
    versionColumns: any[] = ['id', 'stages', 'actions'];
    versionPageSizeOptions = [5, 10, 20, 50, 100];

    // Rotation lambdas
    rotationLambdaARNs$: Observable<LoadLambdaArnsResponse> = this.store.select(selectRotationLambdaARNs);
    rotationLambdaSelect: LambdaSelect[] = [];
    rotationLambdaSelection: string | undefined = "";

    // Tags Table
    secretTags$: Observable<SecretTagCountersResponse> = this.store.select(selectTags);
    tagPageSize$: Observable<number> = this.store.select(selectTagPageSize);
    tagPageIndex$: Observable<number> = this.store.select(selectTagPageIndex);
    tagColumns: any[] = ['name', 'value', 'actions'];
    tagPageSizeOptions = [5, 10, 20, 50, 100];

    private routerSubscription: any;

    constructor(private readonly snackBar: MatSnackBar, private readonly route: ActivatedRoute,
                private readonly dialog: MatDialog, private readonly location: Location, private readonly store: Store,
                private readonly state: State<SecretDetailsState>) {
    }

    ngOnInit() {
        this.routerSubscription = this.route.params.subscribe(params => {
            this.secretId = params['secretId'];
            this.loadLambdas();
            this.loadDetails();
            this.loadVersions();
            this.loadTags();
        });
        this.secretDetailsError$.subscribe((msg: string) => {
            if (msg.length) {
                this.snackBar.open("ErrorMessage: " + msg.toString())
            }
        });
        this.secretDetails$.subscribe((data: any) => {
            this.secretUrl = data.secretUrl;
            this.secretName = data.secretName;
            this.secretId = data.secretId;
            this.secret = data;
            this.rotationLambdaSelection = this.secret?.rotationLambdaARN;
        });

        this.rotationLambdaARNs$.subscribe((data: any) => {
            this.rotationLambdaSelect = [];
            data.lambdaArns.forEach((d: string) => {
                this.rotationLambdaSelect.push({value: d, label: d});
            });
        });
        //this.secretDetails$.subscribe((data: any) => console.log("SecretDetails: ", data));
        //this.secretVersions$.subscribe((data: any) => console.log("Versions: ", data));
        //this.secretTags$.subscribe((data: any) => console.log("Data: ", data));
        //this.lambdaTriggers$.subscribe((data: any) => console.log("Data: ", data));
    }

    ngOnDestroy() {
        this.routerSubscription.unsubscribe();
    }

    refresh() {
        this.loadLambdas();
        this.loadDetails();
        this.loadVersions();
        this.loadTags();
        this.lastUpdate = new Date();
    }

    back() {
        this.location.back();
    }

    // ===================================================================================================================
    // Details
    // ===================================================================================================================
    loadDetails() {
        this.store.dispatch(secretDetailsActions.loadDetails({secretId: this.secretId}));
        this.lastUpdate = new Date();
    }

    // ===================================================================================================================
    // Versions
    // ===================================================================================================================
    handleVersionPageEvent(e: PageEvent) {
        this.state.value['secret-details'].versionPageSize = e.pageSize;
        this.state.value['secret-details'].versionPageIndex = e.pageIndex;
        this.loadVersions();
    }

    loadVersions() {
        this.store.dispatch(secretDetailsActions.loadVersions({
            secretId: this.secretId,
            pageSize: this.state.value['secret-details'].versionPageSize,
            pageIndex: this.state.value['secret-details'].versionPageIndex,
            sortColumns: this.state.value['secret-details'].versionSortColumns
        }));
        this.lastUpdate = new Date();
    }

    versionSortChange(sortState: Sort) {
        this.state.value['secret-details'].sortColumns = [];
        let column = sortState.active;
        let direction = sortState.direction === 'asc' ? 1 : -1;
        this.state.value['secret-details'].versionSortColumns = [{column: column, sortDirection: direction}];
        this.loadVersions();
    }

    deleteVersions(versionId: string) {
        this.loadVersions();
    }

    refreshVersions() {
        this.loadVersions();
        this.loadLambdas();
    }

    editValue() {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = this.secret;

        this.dialog.open(SecretValueEditDialogComponent, dialogConfig).afterClosed().subscribe(result => {
            console.log("Dialog result: ", result);
            if (result) {
                this.secret.secretString = result;
                this.store.dispatch(secretDetailsActions.updateDetails({secretDetails: this.secret}));
                this.lastUpdate = new Date();
            }
        });
    }

    // ===================================================================================================================
    // Rotation rule
    // ===================================================================================================================

    loadLambdas() {
        this.store.dispatch(secretDetailsActions.loadLambdasARNs());
        this.lastUpdate = new Date();
    }

    rotateSecret() {
        let rotateSecretRequest: RotateSecretRequest = {
            SecretId: this.secret.secretId,
            RotateImmediately: true,
            RotationRules: this.secret.rotationRules,
            RotationLambdaARN: this.secret.rotationLambdaARN,
            ClientRequestToken: uuid.v4()
        };
        this.store.dispatch(secretDetailsActions.rotateSecret({rotateSecretRequest: rotateSecretRequest}));
        this.lastUpdate = new Date();
    }

    rotationLambdaArnChanged(event: any): void {
        if (event.isUserInput) {
            if (event.source.selected) {
                this.secret.rotationLambdaARN = event.source.value;
            }
        }
    }

    saveRotationRules() {
        this.store.dispatch(secretDetailsActions.updateDetails({secretDetails: this.secret}));
        this.lastUpdate = new Date();
    }

    // ===================================================================================================================
    // Tags
    // ===================================================================================================================
    handleTagPageEvent(e: PageEvent) {
        this.state.value['secret-details'].tagPageSize = e.pageSize;
        this.state.value['secret-details'].tagPageIndex = e.pageIndex;
        this.loadTags();
    }

    loadTags() {
        // this.store.dispatch(secretDetailsActions.loadTags({
        //     secretArn: this.secretArn,
        //     pageSize: this.state.value['secret-details'].tagPageSize,
        //     pageIndex: this.state.value['secret-details'].tagPageIndex,
        //     sortColumns: this.state.value['secret-details'].tagSortColumns
        // }));
        this.lastUpdate = new Date();
    }

    tagSortChange(sortState: Sort) {
        this.state.value['secret-details'].sortColumns = [];
        let column = sortState.active;
        let direction = sortState.direction === 'asc' ? 1 : -1;
        this.state.value['secret-details'].sortColumns = [{column: column, sortDirection: direction}];
        this.loadTags();
    }

    refreshTags() {
        this.loadTags();
    }

    deleteTag(key: string) {
        /* this.secretsmanagerService.deleteTag(this.secretUrl, key)
             .subscribe(() => {
                 this.loadTags();
                 this.snackBar.open('SQS tag deleted, name: ' + key, 'Dismiss', {duration: 5000});
             });*/
    }

    editTag(tagKey: string, tagValue: string) {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            secretUrl: this.secretUrl,
            secretName: this.secretName,
            tagKey: tagKey,
            tagValue: tagValue
        };

        /*this.dialog.open(SqsTagEditDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                if (result.tagKey !== tagKey || result.tagValue !== tagValue) {
                    this.secretsmanagerService.addTag(result.secretUrl, result.tagKey, result.tagValue)
                        .subscribe(() => {
                            this.loadTags();
                            this.snackBar.open('SQS tag changed, name: ' + result.tagKey, 'Dismiss', {duration: 5000});
                        })
                } else {
                    this.snackBar.open('SQS tag unchanged, name: ' + result.tagKey, 'Dismiss', {duration: 5000});
                }
            }
        });*/
    }

    addTag() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {secretArn: this.secretArn, secretName: this.secretName, secretUrl: this.secretUrl};

        /*this.dialog.open(SqsTagAddDialog, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                this.secretsmanagerService.addTag(result.secretUrl, result.key, result.value)
                    .subscribe(() => {
                        this.loadTags();
                        this.snackBar.open('SQS secret tag added, name: ' + result.key, 'Dismiss', {duration: 5000});
                    })
            }
        });*/
    }
}
