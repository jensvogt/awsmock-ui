import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Location} from "@angular/common";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {selectDetails, selectError} from "./state/ssm-parameter-detail.selectors";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {SsmParameterDetails, SsmParameterDetailsResponse, UpdateParameterCounterRequest} from "../model/ssm-parameter-item";
import {ssmParameterDetailsActions} from "./state/ssm-parameter-detail.actions";
import {ParameterEditDialogComponent} from "../parameter-edit/parameter-edit-component";
import {ssmParameterListActions} from "../parameter-list/state/ssm-parameter-list.actions";

@Component({
    selector: 'ssm-parameter-detail-component',
    templateUrl: './ssm-parameter-detail.component.html',
    styleUrls: ['./ssm-parameter-detail.component.scss'],
    standalone: false
})
export class SsmParameterDetailComponent implements OnInit, OnDestroy {
    lastUpdate: Date = new Date();

    parameterName: string = '';
    parameterValue: string = '';
    parameterItem: SsmParameterDetails = {} as SsmParameterDetails;
    kmsKeyId: string = '';
    parameterDetails$: Observable<SsmParameterDetailsResponse> = this.store.select(selectDetails);
    parameterDetailsError$: Observable<string> = this.store.select(selectError);

    // Tags table
    // parameterTags$: Observable<SqsTagCountersResponse> = this.store.select(selectTags);
    // tagPageSize$: Observable<number> = this.store.select(selectTagPageSize);
    // tagPageIndex$: Observable<number> = this.store.select(selectTagPageIndex);
    // tagColumns: any[] = ['name', 'value', 'actions'];
    // tagPageSizeOptions = [5, 10, 20, 50, 100];

    private routerSubscription: any;

    constructor(private readonly snackBar: MatSnackBar, private readonly route: ActivatedRoute, private readonly dialog: MatDialog, private readonly location: Location, private readonly store: Store) {
    }

    ngOnInit() {
        this.routerSubscription = this.route.params.subscribe(params => {
            this.parameterName = atob(params['name']);
            this.loadDetails();
        });
        this.parameterDetailsError$.subscribe((msg: string) => {
            if (msg.length) {
                this.snackBar.open("ErrorMessage: " + msg.toString())
            }
        });
        this.parameterDetails$.subscribe((data: any) => {
            if (data?.Parameter) {
                this.kmsKeyId = data.Parameter.KmsKeyArn.substring(data.Parameter.KmsKeyArn.lastIndexOf('/') + 1);
                this.parameterValue = atob(data.Parameter.Value);
                this.parameterItem = data.Parameter;
            }
        });
        //this.parameterDetails$.subscribe((data: any) => console.log("ParameterDetails: ", data));
        //this.parameterAttributes$.subscribe((data: any) => console.log("Attributes: ", data));
        //this.parameterTags$.subscribe((data: any) => console.log("Data: ", data));
        //this.lambdaTriggers$.subscribe((data: any) => console.log("Data: ", data));
    }

    ngOnDestroy() {
        this.routerSubscription.unsubscribe();
    }

    refresh() {
        this.loadDetails();
    }

    back() {
        this.location.back();
    }

    editParameter() {

        const dialogConfig = new MatDialogConfig();

        let pItem = {...this.parameterItem};
        pItem.Value = this.parameterValue;
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.maxWidth = '100vw';
        dialogConfig.maxHeight = '100vh';
        dialogConfig.panelClass = 'full-screen-modal';
        dialogConfig.width = "40%"
        dialogConfig.minWidth = '580px'
        dialogConfig.data = pItem;

        this.dialog.open(ParameterEditDialogComponent, dialogConfig).afterClosed().subscribe(result => {
            if (result) {
                let request: UpdateParameterCounterRequest = {
                    name: result.name,
                    value: result.value,
                    description: result.description,
                    type: result.type,
                    kmsKeyArn: result.kmsKeyArn,
                    prefix: '',
                    pageSize: -1,
                    pageIndex: -1,
                    sortColumns: []
                };
                this.store.dispatch(ssmParameterListActions.updateParameter({request: request}));
            }
        });
    }

    // ===================================================================================================================
    // Details
    // ===================================================================================================================
    loadDetails() {
        this.store.dispatch(ssmParameterDetailsActions.loadDetails({name: this.parameterName}));
        this.lastUpdate = new Date();
    }
}
