import {Injectable} from '@angular/core';
import {Actions} from '@ngrx/effects';

import {AwsMockHttpService} from "../../../services/awsmock-http.service";
import {SortColumn} from "../../../shared/sorting/sorting.component";

@Injectable()
export class DashboardEffects {

    sortColumns: SortColumn[] = [];

/*    loadQueues$ = createEffect(() => this.actions$.pipe(
        ofType(sqsQueueListActions.loadQueues),
        mergeMap(() =>
            this.awsmockHttpService.listQueueCounters(
                sqsQueueListActions.loadQueues.arguments.prefix,
                sqsQueueListActions.loadQueues.arguments.pageSize,
                sqsQueueListActions.loadQueues.arguments.pageIndex,
                sqsQueueListActions.loadQueues.arguments.sortColumns)
                .pipe(map((queues: any) => sqsQueueListActions.loadQueuesSuccess({queues})),
                    catchError((error) =>
                        of(sqsQueueListActions.loadQueuesFailure({error: error.message}))
                    )
                )
        ),
    ));*/

    constructor(private actions$: Actions, private awsmockHttpService: AwsMockHttpService) {
    }
}