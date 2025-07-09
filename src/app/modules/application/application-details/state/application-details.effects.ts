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

    updateApplication$ = createEffect(() => this.actions$.pipe(
        ofType(applicationDetailsActions.updateApplication),
        mergeMap(action =>
            this.applicationService.updateApplication(action.request)
                .pipe(map((getApplicationResponse: any) => applicationDetailsActions.updateApplicationSuccess({getApplicationResponse})),
                    catchError((error) =>
                        of(applicationDetailsActions.updateApplicationFailure({error: error.message}))
                    )
                )
        )
    ));

    constructor(private readonly actions$: Actions, private readonly applicationService: ApplicationService) {
    }
}