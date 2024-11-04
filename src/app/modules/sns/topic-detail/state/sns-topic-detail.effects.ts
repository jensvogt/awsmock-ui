import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {mergeMap, of} from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import {snsTopicDetailsActions} from './sns-topic-detail.actions';
import {SnsService} from "../../service/sns-service.component";

@Injectable()
export class SnsTopicDetailEffects {

    loadTopicDetails$ = createEffect(() => this.actions$.pipe(
        ofType(snsTopicDetailsActions.loadDetails),
        mergeMap(action =>
            this.snsService.getTopicDetails(action.topicArn)
                .pipe(map((topicDetails: any) =>
                        snsTopicDetailsActions.loadDetailsSuccess({topicDetails: topicDetails})),
                    catchError((error) =>
                        of(snsTopicDetailsActions.loadDetailsFailure({error: error.message}))
                    )
                )
        ),
    ));

    loadTopicSubscriptions$ = createEffect(() => this.actions$.pipe(
        ofType(snsTopicDetailsActions.loadSubscriptions),
        mergeMap(action =>
            this.snsService.listSubscriptionsCounters(action.topicArn, action.pageSize, action.pageIndex, action.sortColumns)
                .pipe(map((subscriptions: any) =>
                        snsTopicDetailsActions.loadSubscriptionsSuccess({subscriptions: subscriptions})),
                    catchError((error) =>
                        of(snsTopicDetailsActions.loadSubscriptionsFailure({error: error.message}))
                    )
                )
        ),
    ));

    constructor(private actions$: Actions, private snsService: SnsService) {
    }
}