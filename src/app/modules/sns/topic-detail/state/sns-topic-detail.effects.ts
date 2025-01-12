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
                        snsTopicDetailsActions.loadSubscriptionsSuccess({subscriptions})),
                    catchError((error) =>
                        of(snsTopicDetailsActions.loadSubscriptionsFailure({error: error.message}))
                    )
                )
        ),
    ));

    loadTopicTags$ = createEffect(() => this.actions$.pipe(
        ofType(snsTopicDetailsActions.loadTags),
        mergeMap(action =>
            this.snsService.listTagCounters(action.topicArn, action.pageSize, action.pageIndex, action.sortColumns)
                .pipe(map((tags: any) =>
                        snsTopicDetailsActions.loadTagsSuccess({tags})),
                    catchError((error) =>
                        of(snsTopicDetailsActions.loadTagsFailure({error: error.message}))
                    )
                )
        ),
    ));

    loadTopicAttributes$ = createEffect(() => this.actions$.pipe(
        ofType(snsTopicDetailsActions.loadAttributes),
        mergeMap(action =>
            this.snsService.listAttributeCounters(action.topicArn, action.pageSize, action.pageIndex, action.sortColumns)
                .pipe(map((attributes: any) =>
                        snsTopicDetailsActions.loadAttributesSuccess({attributes})),
                    catchError((error) =>
                        of(snsTopicDetailsActions.loadAttributesFailure({error: error.message}))
                    )
                )
        ),
    ));

    constructor(private actions$: Actions, private snsService: SnsService) {
    }
}