import {Component, inject, OnDestroy, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {Sort} from "@angular/material/sort";
import {PageEvent} from "@angular/material/paginator";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {LambdaService} from "../service/lambda-service.component";
import {LambdaFunctionItem} from "../model/function-item";
import {State, Store} from "@ngrx/store";
import {LambdaFunctionDetailsState} from "./state/lambda-function-details.reducer";
import {lambdaFunctionDetailsActions} from "./state/lambda-function-details.actions";
import {Observable} from "rxjs";
import {selectFunctionItem} from "./state/lambda-function-details.selectors";
import {byteConversion} from "../../../shared/byte-utils.component";

@Component({
    selector: 'bucket-detail-component',
    templateUrl: './function-detail.component.html',
    styleUrls: ['./function-detail.component.scss'],
    providers: [LambdaService]
})
export class LambdaFunctionDetailsComponent implements OnInit, OnDestroy {

    // Last update
    lastUpdate: Date = new Date();

    functionItem = {} as LambdaFunctionItem;
    functionName: string = '';
    functionItem$: Observable<LambdaFunctionItem> = this.store.select(selectFunctionItem);
    protected readonly byteConversion = byteConversion;
    private routerSubscription: any;
    // Sorting
    private _liveAnnouncer = inject(LiveAnnouncer);

    constructor(private location: Location, private route: ActivatedRoute, private state: State<LambdaFunctionDetailsState>, private store: Store) {
    }

    ngOnInit() {
        this.routerSubscription = this.route.params.subscribe(params => {
            this.functionName = params['functionName'];
        });
        this.functionItem$?.subscribe((data: LambdaFunctionItem) => {
            this.functionItem = data;
            this.lastUpdate = new Date();
            console.log(data);
        });
        this.loadFunction();
    }

    ngOnDestroy() {
        this.routerSubscription.unsubscribe();
    }

    back() {
        this.location.back();
    }

    // ===================================================================================================================
    // Details

    refresh() {
        this.loadFunction();
    }

    // ===================================================================================================================
    // Lambda Notifications

    // ===================================================================================================================
    loadFunction() {
        this.store.dispatch(lambdaFunctionDetailsActions.loadFunction({
            name: this.functionName
        }));
    }

    // ===================================================================================================================
    lambdaNotificationSortChange(sortState: Sort) {
        if (sortState.direction) {
            this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
        } else {
            this._liveAnnouncer.announce('Sorting cleared');
        }
        this.loadFunction();
    }

    handleLambdaNotificationPageEvent(e: PageEvent) {

    }

    save() {
        this.location.back();
    }
}
