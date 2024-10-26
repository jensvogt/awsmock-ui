import {Injectable} from '@angular/core';
import {Actions} from '@ngrx/effects';

// maxSigned32BitInteger is the highest Integer value in JAVA, which differs to Number.MAX_SAFE_INTEGER
// eslint-disable-next-line @typescript-eslint/no-magic-numbers
export const maxSigned32BitInteger: number = 2 ** 31 - 1;

@Injectable()
export class RootEffect {

    /*loadAllDatenlieferanten$: Observable<TypedAction<string>> = createEffect(() => {
        return this.actions$.pipe(
            ofType(rootActions.loadAllDatenlieferanten, createNewDatenlieferantSuccess),
            switchMap(() => {
                return this.datenlieferantService.getAll({status: DatenlieferantSearchStatus.CONFIGURED}, maxSigned32BitInteger).pipe(
                    map((searchResponse: DatenlieferantArray) => rootActions.allDatenlieferantenLoaded({response: searchResponse})),
                    catchError((error: HttpErrorResponse) => {
                        this.restExceptionHandlerService.showErrorModal(error);
                        return of(rootActions.loadAllDatenlieferantenFailed());
                    })
                );
            })
        );
    });*/

    constructor(
        private readonly actions$: Actions,
        //private readonly datenlieferantService: DatenlieferantService,
        //private readonly restExceptionHandlerService: RestExceptionHandlerService
    ) {}
}
