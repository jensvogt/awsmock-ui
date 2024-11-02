import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SqsQueueDetails} from "../model/sqs-queue-details";
import {Location} from "@angular/common";
import {Store} from "@ngrx/store";
import {sqsQueueDetailsActions} from "./state/sqs-queue-detail.actions";
import {Observable} from "rxjs";
import {selectDetails, selectError} from "./state/sqs-queue-detail.selectors";

@Component({
    selector: 'sqs-queue-detail-component',
    templateUrl: './sqs-queue-detail.component.html',
    styleUrls: ['./sqs-queue-detail.component.scss'],
})
export class SqsQueueDetailComponent implements OnInit, OnDestroy {
    lastUpdate: Date = new Date();

    queueArn: string = '';
    queueDetails$: Observable<SqsQueueDetails> = this.store.select(selectDetails);
    queueDetailsError$: Observable<string> = this.store.select(selectError);
    private sub: any;

    constructor(private snackBar: MatSnackBar, private route: ActivatedRoute, private location: Location, private store: Store) {
        this.store.dispatch(sqsQueueDetailsActions.initialize());
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.queueArn = params['queueArn'];
            this.store.dispatch(sqsQueueDetailsActions.loadDetails({queueArn: this.queueArn}));
        });
        this.queueDetailsError$.subscribe((msg: string) => {
            if (msg.length) {
                console.log("Message", msg);
                this.snackBar.open("ErrorMessage: " + msg.toString())
            }
        });
        this.queueDetails$.subscribe((msg: any) => {
            console.log("Message", msg);
        });
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

    save() {
    }

    close() {
        this.location.back();
    }
}
