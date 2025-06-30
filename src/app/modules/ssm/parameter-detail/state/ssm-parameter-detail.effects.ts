import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {mergeMap, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {ssmParameterDetailsActions} from "./ssm-parameter-detail.actions";
import {SsmService} from "../../service/ssm-service.component";

@Injectable()
export class SsmParameterDetailEffects {

    loadParametersDetails$ = createEffect(() => this.actions$.pipe(
        ofType(ssmParameterDetailsActions.loadDetails),
        mergeMap(action =>
            this.ssmService.getParameter(action.name)
                .pipe(map((details: any) =>
                        ssmParameterDetailsActions.loadDetailsSuccess({parameterDetails: details})),
                    catchError((error) =>
                        of(ssmParameterDetailsActions.loadDetailsFailure({error: error.message}))
                    )
                )
        ),
    ));

    /*
        loadParameterAttributes$ = createEffect(() => this.actions$.pipe(
            ofType(ssmParameterDetailsActions.loadAttributes),
            mergeMap(action =>
                this.ssmService.listParameterAttributeCounters(action.parameterArn, action.pageSize, action.pageIndex, action.sortColumns)
                    .pipe(map((attributes: any) =>
                            ssmParameterDetailsActions.loadAttributesSuccess({attributes})),
                        catchError((error) =>
                            of(ssmParameterDetailsActions.loadAttributesFailure({error: error.message}))
                        )
                    )
            ),
        ));

        loadLambdaTriggers$ = createEffect(() => this.actions$.pipe(
            ofType(ssmParameterDetailsActions.loadLambdaTriggers),
            mergeMap(action =>
                this.ssmService.listLambdaTriggerCounters(action.parameterArn, action.pageSize, action.pageIndex, action.sortColumns)
                    .pipe(map((lambdaTriggers: any) =>
                            ssmParameterDetailsActions.loadLambdaTriggersSuccess({lambdaTriggers})),
                        catchError((error) =>
                            of(ssmParameterDetailsActions.loadLambdaTriggersFailure({error: error.message}))
                        )
                    )
            ),
        ));

        loadParameterTags$ = createEffect(() => this.actions$.pipe(
            ofType(ssmParameterDetailsActions.loadTags),
            mergeMap(action =>
                this.ssmService.listTagCounters(action.parameterArn, action.pageSize, action.pageIndex, action.sortColumns)
                    .pipe(map((tags: any) =>
                            ssmParameterDetailsActions.loadTagsSuccess({tags})),
                        catchError((error) =>
                            of(ssmParameterDetailsActions.loadTagsFailure({error: error.message}))
                        )
                    )
            ),
        ));

        loadParameterDefaultMessageAttributes$ = createEffect(() => this.actions$.pipe(
            ofType(ssmParameterDetailsActions.loadDefaultMessageAttributes),
            mergeMap(action =>
                this.ssmService.listDefaultMessageAttributeCounters(action.parameterArn, action.pageSize, action.pageIndex, action.sortColumns)
                    .pipe(map((defaultMessageAttributes: any) =>
                            ssmParameterDetailsActions.loadDefaultMessageAttributesSuccess({defaultMessageAttributes})),
                        catchError((error) =>
                            of(ssmParameterDetailsActions.loadDefaultMessageAttributesFailure({error: error.message}))
                        )
                    )
            ),
        ));

        addParameterDefaultMessageAttributes$ = createEffect(() => this.actions$.pipe(
            ofType(ssmParameterDetailsActions.addDefaultMessageAttributes),
            mergeMap(action =>
                this.ssmService.addDefaultMessageAttributeCounters(action.parameterArn, action.name, action.value, action.dataType)
                    .pipe(map((defaultMessageAttributes: any) =>
                            ssmParameterDetailsActions.addDefaultMessageAttributesSuccess({defaultMessageAttributes})),
                        catchError((error) =>
                            of(ssmParameterDetailsActions.addDefaultMessageAttributesFailure({error: error.message}))
                        )
                    )
            ),
        ));

        updateParameterDefaultMessageAttributes$ = createEffect(() => this.actions$.pipe(
            ofType(ssmParameterDetailsActions.updateDefaultMessageAttributes),
            mergeMap(action =>
                this.ssmService.updateDefaultMessageAttributeCounters(action.parameterArn, action.name, action.value, action.dataType)
                    .pipe(map((defaultMessageAttributes: any) =>
                            ssmParameterDetailsActions.updateDefaultMessageAttributesSuccess({defaultMessageAttributes})),
                        catchError((error) =>
                            of(ssmParameterDetailsActions.updateDefaultMessageAttributesFailure({error: error.message}))
                        )
                    )
            ),
        ));

        deleteParameterDefaultMessageAttributes$ = createEffect(() => this.actions$.pipe(
            ofType(ssmParameterDetailsActions.deleteDefaultMessageAttributes),
            mergeMap(action =>
                this.ssmService.deleteDefaultMessageAttributeCounters(action.parameterArn, action.name)
                    .pipe(map((defaultMessageAttributes: any) =>
                            ssmParameterDetailsActions.deleteDefaultMessageAttributesSuccess({defaultMessageAttributes})),
                        catchError((error) =>
                            of(ssmParameterDetailsActions.deleteDefaultMessageAttributesFailure({error: error.message}))
                        )
                    )
            ),
        ));*/

    constructor(private readonly actions$: Actions, private readonly ssmService: SsmService) {
    }
}