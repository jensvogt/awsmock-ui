import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {selectDetails, selectError} from "./state/api-key-detail.selectors";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ApiGatewayService} from "../service/api-gateway-service.component";
import {ApiKeyDetailsResponse, ApiKeyItem, ApiKeyUpdateRequest} from "../model/api-key-item";
import {apiKeyDetailsActions} from "./state/api-key-detail.actions";

@Component({
    selector: 'api-key-detail-component',
    templateUrl: './api-key-detail.component.html',
    styleUrls: ['./api-key-detail.component.scss'],
    standalone: false,
    providers: [ApiGatewayService]
})
export class ApiKeyDetailComponent implements OnInit, OnDestroy {

    // Last update
    lastUpdate: Date = new Date();

    keyId: string = '';
    keyName: string = '';
    apiKey: ApiKeyItem = {} as ApiKeyItem;
    keyDetailsResponse$: Observable<ApiKeyDetailsResponse> = this.store.select(selectDetails);
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
            this.keyId = params['id'];
            this.loadKeyDetails();
        });
        this.keyDetailsError$.subscribe((msg: string) => {
            if (msg?.length) {
                this.snackBar.open("ErrorMessage: " + msg.toString())
            }
        });
        this.keyDetailsResponse$.subscribe((data) => {
//            console.log("API key details: ", data);
            this.apiKey = data.apiKey;
        });
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
        this.store.dispatch(apiKeyDetailsActions.loadDetails({keyId: this.keyId}));
        this.lastUpdate = new Date();
    }

    enabledChanged(event: any) {
        this.apiKey.enabled = event.checked;
        let request: ApiKeyUpdateRequest = {apiKey: this.apiKey}
        this.store.dispatch(apiKeyDetailsActions.updateApiKey({request: request}));
        this.lastUpdate = new Date();
    }
}
