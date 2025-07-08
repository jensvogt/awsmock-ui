import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, mergeMap, of} from 'rxjs';
import {applicationDetailsActions} from './application-details.actions';
import {map} from "rxjs/operators";
import {ApplicationService} from "../../service/application-service.component";

@Injectable()
export class ApplicationDetailEffects {

    loadApplication$ = createEffect(() => this.actions$.pipe(
        ofType(applicationDetailsActions.loadApplication),
        mergeMap(action =>
            this.applicationService.getApplication(action.request)
                .pipe(map((getApplicationResponse: any) => applicationDetailsActions.loadApplicationSuccess({getApplicationResponse})),
                    catchError((error) =>
                        of(applicationDetailsActions.loadApplicationFailure({error: error.message}))
                    )
                )
        )
    ));
    //
    // loadEnvironment$ = createEffect(() => this.actions$.pipe(
    //     ofType(applicationDetailsActions.loadEnvironment),
    //     mergeMap(action =>
    //         this.applicationService.listEnvironmentCounters(action.lambdaArn, action.pageSize, action.pageIndex, action.sortColumns)
    //             .pipe(map((environment: any) => applicationDetailsActions.loadEnvironmentSuccess({environment})),
    //                 catchError((error) =>
    //                     of(applicationDetailsActions.loadEnvironmentFailure({error: error.message}))
    //                 )
    //             )
    //     )
    // ));
    //
    // loadTags$ = createEffect(() => this.actions$.pipe(
    //     ofType(applicationDetailsActions.loadTags),
    //     mergeMap(action =>
    //         this.applicationService.listTagCounters(action.lambdaArn, action.pageSize, action.pageIndex, action.sortColumns)
    //             .pipe(map((tags: any) => applicationDetailsActions.loadTagsSuccess({tags})),
    //                 catchError((error) =>
    //                     of(applicationDetailsActions.loadTagsFailure({error: error.message}))
    //                 )
    //             )
    //     )
    // ));
    //
    // loadInstances$ = createEffect(() => this.actions$.pipe(
    //     ofType(applicationDetailsActions.loadInstances),
    //     mergeMap(action =>
    //         this.applicationService.listInstanceCounters(action.lambdaArn, action.pageSize, action.pageIndex, action.sortColumns)
    //             .pipe(map((instances: any) => applicationDetailsActions.loadInstancesSuccess({instances})),
    //                 catchError((error) =>
    //                     of(applicationDetailsActions.loadInstancesFailure({error: error.message}))
    //                 )
    //             )
    //     )
    // ));
    //
    // loadEventSource$ = createEffect(() => this.actions$.pipe(
    //     ofType(applicationDetailsActions.loadEventSource),
    //     mergeMap(action =>
    //         this.applicationService.listEventSourceCounters(action.lambdaArn, action.pageSize, action.pageIndex, action.sortColumns)
    //             .pipe(map((eventSource: any) => applicationDetailsActions.loadEventSourceSuccess({eventSource})),
    //                 catchError((error) =>
    //                     of(applicationDetailsActions.loadEventSourceFailure({error: error.message}))
    //                 )
    //             )
    //     )
    // ));

    constructor(private readonly actions$: Actions, private readonly applicationService: ApplicationService) {
    }
}