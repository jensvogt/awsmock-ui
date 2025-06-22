import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {mergeMap, of} from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import {KmsService} from "../../service/kms-service.component";
import {kmsKeyDetailsActions} from "./kms-key-detail.actions";

@Injectable()
export class KmsKeyDetailEffects {

    loadKeyDetails$ = createEffect(() => this.actions$.pipe(
        ofType(kmsKeyDetailsActions.loadDetails),
        mergeMap(action =>
            this.kmsService.getKeyDetails(action.keyId)
                .pipe(map((keyDetails: any) =>
                        kmsKeyDetailsActions.loadDetailsSuccess({keyDetails: keyDetails})),
                    catchError((error) =>
                        of(kmsKeyDetailsActions.loadDetailsFailure({error: error.message}))
                    )
                )
        ),
    ));

    constructor(private readonly actions$: Actions, private readonly kmsService: KmsService) {
    }
}