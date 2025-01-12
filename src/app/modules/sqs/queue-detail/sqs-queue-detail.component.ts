import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SqsQueueDetails} from "../model/sqs-queue-details";
import {Location} from "@angular/common";
import {State, Store} from "@ngrx/store";
import {sqsQueueDetailsActions} from "./state/sqs-queue-detail.actions";
import {Observable} from "rxjs";
import {selectAttributePageIndex, selectAttributePageSize, selectAttributes, selectDetails, selectError} from "./state/sqs-queue-detail.selectors";
import {SqsAttributeCountersResponse} from "../model/sqs-attribute-item";
import {PageEvent} from "@angular/material/paginator";
import {Sort} from "@angular/material/sort";
import {SqsQueueDetailsState} from "./state/sqs-queue-detail.reducer";

@Component({
    selector: 'sqs-queue-detail-component',
    templateUrl: './sqs-queue-detail.component.html',
    styleUrls: ['./sqs-queue-detail.component.scss'],
    standalone: false
})
export class SqsQueueDetailComponent implements OnInit, OnDestroy {
    lastUpdate: Date = new Date();

    queueArn: string = '';
    queueDetails$: Observable<SqsQueueDetails> = this.store.select(selectDetails);
    queueDetailsError$: Observable<string> = this.store.select(selectError);

    // Attributes Table
    queueAttributes$: Observable<SqsAttributeCountersResponse> = this.store.select(selectAttributes);
    attributePageSize$: Observable<number> = this.store.select(selectAttributePageSize);
    attributePageIndex$: Observable<number> = this.store.select(selectAttributePageIndex);
    attributeColumns: any[] = ['name', 'value', 'actions'];
    attributePageSizeOptions = [5, 10, 20, 50, 100];
    private sub: any;

    constructor(private snackBar: MatSnackBar, private route: ActivatedRoute, private location: Location, private store: Store, private state: State<SqsQueueDetailsState>) {
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.queueArn = params['queueArn'];
            this.loadDetails();
            this.loadAttributes();
        });
        this.queueDetailsError$.subscribe((msg: string) => {
            if (msg.length) {
                this.snackBar.open("ErrorMessage: " + msg.toString())
            }
        });
        this.queueAttributes$.subscribe((data: any) => console.log("Data: ", data));
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    refresh() {
        this.store.dispatch(sqsQueueDetailsActions.loadDetails({queueArn: this.queueArn}));
        this.lastUpdate = new Date();
    }

    back() {
        this.location.back();
    }

    // ===================================================================================================================
    // Details
    // ===================================================================================================================
    loadDetails() {
        this.store.dispatch(sqsQueueDetailsActions.loadDetails({queueArn: this.queueArn}));
        this.lastUpdate = new Date();
    }

    save() {
    }

    close() {
        this.location.back();
    }

    // ===================================================================================================================
    // Attributes
    // ===================================================================================================================
    handleAttributePageEvent(e: PageEvent) {
        this.state.value['sqs-queue-details'].attributePageSize = e.pageSize;
        this.state.value['sqs-queue-details'].attributePageIndex = e.pageIndex;
        this.loadAttributes();
    }

    loadAttributes() {
        this.store.dispatch(sqsQueueDetailsActions.loadAttributes({
            queueArn: this.queueArn,
            pageSize: this.state.value['sqs-queue-details'].attributePageSize,
            pageIndex: this.state.value['sqs-queue-details'].attributePageIndex,
            sortColumns: this.state.value['sqs-queue-details'].sortColumns
        }));
        this.lastUpdate = new Date();
    }

    attributeSortChange(sortState: Sort) {
        this.state.value['sqs-queue-details'].sortColumns = [];
        let column = sortState.active;
        let direction = sortState.direction === 'asc' ? 1 : -1;
        this.state.value['sqs-queue-details'].sortColumns = [{column: column, sortDirection: direction}];
        this.loadAttributes();
    }

    refreshAttributes() {
        this.loadAttributes();
    }

}
