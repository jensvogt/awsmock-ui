import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {mergeMap, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {applicationListActions} from './application-list.actions';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {ApplicationService} from "../../service/application-service.component";

@Injectable()
export class ApplicationListEffects {

    sortColumns: SortColumn[] = [];

    loadApplications$ = createEffect(() => this.actions$.pipe(
        ofType(applicationListActions.loadApplications),
        mergeMap(action =>
            this.applicationService.listApplicationCounters(action.prefix, action.pageSize, action.pageIndex, action.sortColumns)
                .pipe(map((applications: any) => applicationListActions.loadApplicationsSuccess({applications})),
                    catchError((error) =>
                        of(applicationListActions.loadApplicationsFailure({error: error.message}))
                    )
                )
        ),
    ));

    addApplication$ = createEffect(() => this.actions$.pipe(
        ofType(applicationListActions.addApplication),
        mergeMap(action =>
            this.applicationService.addApplication(action.request)
                .pipe(map((applications: any) => applicationListActions.addApplicationSuccess({applications})),
                    catchError((error) =>
                        of(applicationListActions.addApplicationFailure({error: error.message}))
                    )
                )
        ),
    ));

    startApplication$ = createEffect(() => this.actions$.pipe(
        ofType(applicationListActions.startApplication),
        mergeMap(action =>
            this.applicationService.startApplication(action.request)
                .pipe(map((applications: any) => applicationListActions.startApplicationSuccess({applications})),
                    catchError((error) =>
                        of(applicationListActions.startApplicationFailure({error: error.message}))
                    )
                )
        ),
    ));

    stopApplication$ = createEffect(() => this.actions$.pipe(
        ofType(applicationListActions.stopApplication),
        mergeMap(action =>
            this.applicationService.stopApplication(action.request)
                .pipe(map((applications: any) => applicationListActions.stopApplicationSuccess({applications})),
                    catchError((error) =>
                        of(applicationListActions.stopApplicationFailure({error: error.message}))
                    )
                )
        ),
    ));

    deleteApplication$ = createEffect(() => this.actions$.pipe(
        ofType(applicationListActions.deleteApplication),
        mergeMap((action) =>
            this.applicationService.deleteApplication(action.request)
                .pipe(map((applications: any) => applicationListActions.deleteApplicationSuccess({applications})),
                    catchError((error) =>
                        of(applicationListActions.deleteApplicationFailure({error: error.message}))
                    )
                )
        )
    ));

    constructor(private readonly actions$: Actions, private readonly applicationService: ApplicationService) {
    }
}
