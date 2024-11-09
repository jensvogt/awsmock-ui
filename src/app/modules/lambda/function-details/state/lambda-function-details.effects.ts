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

    constructor(private actions$: Actions, private lambdaService: LambdaService) {
    }
}