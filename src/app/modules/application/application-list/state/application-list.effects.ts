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

    /*
    createParameter$ = createEffect(() => this.actions$.pipe(
        ofType(applicationListActions.createParameter),
        mergeMap(action =>
            this.ssmService.createParameter(action.request)
                .pipe(map((parameters: any) => applicationListActions.createParameterSuccess({parameters})),
                    catchError((error) =>
                        of(applicationListActions.createParameterFailure({error: error.message}))
                    )
                )
        ),
    ));

    updateParameter$ = createEffect(() => this.actions$.pipe(
        ofType(applicationListActions.updateParameter),
        mergeMap(action =>
            this.ssmService.updateParameter(action.request)
                .pipe(map((parameters: any) => applicationListActions.updateParameterSuccess({parameters})),
                    catchError((error) =>
                        of(applicationListActions.updateParameterFailure({error: error.message}))
                    )
                )
        ),
    ));

    deleteParameter$ = createEffect(() => this.actions$.pipe(
        ofType(applicationListActions.deleteParameter),
        mergeMap((action) =>
            this.ssmService.deleteParameter(action.name, action.prefix, action.pageSize, action.pageIndex, action.sortColumns)
                .pipe(map((parameters: any) => applicationListActions.deleteParameterSuccess({parameters})),
                    catchError((error) =>
                        of(applicationListActions.deleteParameterFailure({error: error.message}))
                    )
                )
        )
    ));*/

    constructor(private readonly actions$: Actions, private readonly applicationService: ApplicationService) {
    }
}
