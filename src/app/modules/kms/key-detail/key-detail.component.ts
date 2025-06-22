import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {KmsService} from "../service/kms-service.component";
import {selectDetails, selectError} from "./state/kms-key-detail.selectors";
import {MatSnackBar} from "@angular/material/snack-bar";
import {kmsKeyDetailsActions} from "./state/kms-key-detail.actions";
import {KeyDetailsResponse} from "../model/key-details";

@Component({
    selector: 'kms-key-detail-component',
    templateUrl: './key-detail.component.html',
    styleUrls: ['./key-detail.component.scss'],
    standalone: false,
    providers: [KmsService]
})
export class KmsKeyDetailComponent implements OnInit, OnDestroy {

    // Last update
    lastUpdate: Date = new Date();

    keyId: string = '';
    keyName: string = '';
    keyArn: string = '';
    keyDetailsResponse$: Observable<KeyDetailsResponse> = this.store.select(selectDetails);
    keyDetailsError$: Observable<string> = this.store.select(selectError);

    // Tags Table
    // keyTags$: Observable<KmsTagCountersResponse> = this.store.select(selectTags);
    // tagPageSize$: Observable<number> = this.store.select(selectTagPageSize);
    // tagPageIndex$: Observable<number> = this.store.select(selectTagPageIndex);
    // tagColumns: any[] = ['name', 'value', 'actions'];
    // tagPageSizeOptions = [5, 10, 20, 50, 100];

    private routerSubscription: any;

    constructor(private readonly snackBar: MatSnackBar, private readonly route: ActivatedRoute, private readonly location: Location, private readonly store: Store) {
    }

    ngOnInit() {
        this.routerSubscription = this.route.params.subscribe(params => {
            this.keyId = params['keyId'];
            this.loadKeyDetails();
        });
        this.keyDetailsError$.subscribe((msg: string) => {
            if (msg?.length) {
                this.snackBar.open("ErrorMessage: " + msg.toString())
            }
        });
        //this.keyDetailsResponse$.subscribe((data) => console.log("KMS key details: ", data));
    }

    ngOnDestroy() {
        this.routerSubscription.unsubscribe();
    }

    back() {
        this.location.back();
    }

    // ===================================================================================================================
    // Details
    // ===================================================================================================================
    refresh() {
        this.loadKeyDetails();
    }

    loadKeyDetails() {
        this.store.dispatch(kmsKeyDetailsActions.loadDetails({keyId: this.keyId}));
        this.lastUpdate = new Date();
    }

}
