import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, mergeMap, of} from 'rxjs';
import {lambdaFunctionDetailsActions} from './lambda-function-details.actions';
import {map} from "rxjs/operators";
import {LambdaService} from "../../service/lambda-service.component";

@Injectable()
export class LambdaFunctionDetailsEffects {

    loadFunction$ = createEffect(() => this.actions$.pipe(
        ofType(lambdaFunctionDetailsActions.loadFunction),
        mergeMap(action =>
            this.lambdaService.getFunction(action.name)
                .pipe(map((functionItem: any) => lambdaFunctionDetailsActions.loadFunctionSuccess({functionItem})),
                    catchError((error) =>
                        of(lambdaFunctionDetailsActions.loadFunctionFailure({error: error.message}))
                    )
                )
        )
    ));

    loadEnvironment$ = createEffect(() => this.actions$.pipe(
        ofType(lambdaFunctionDetailsActions.loadEnvironment),
        mergeMap(action =>
            this.lambdaService.listEnvironmentCounters(action.lambdaArn, action.pageSize, action.pageIndex, action.sortColumns)
                .pipe(map((environment: any) => lambdaFunctionDetailsActions.loadEnvironmentSuccess({environment})),
                    catchError((error) =>
                        of(lambdaFunctionDetailsActions.loadEnvironmentFailure({error: error.message}))
                    )
                )
        )
    ));

    loadTags$ = createEffect(() => this.actions$.pipe(
        ofType(lambdaFunctionDetailsActions.loadTags),
        mergeMap(action =>
            this.lambdaService.listTagCounters(action.lambdaArn, action.pageSize, action.pageIndex, action.sortColumns)
                .pipe(map((tags: any) => lambdaFunctionDetailsActions.loadTagsSuccess({tags})),
                    catchError((error) =>
                        of(lambdaFunctionDetailsActions.loadTagsFailure({error: error.message}))
                    )
                )
        )
    ));

    constructor(private actions$: Actions, private lambdaService: LambdaService) {
    }
}