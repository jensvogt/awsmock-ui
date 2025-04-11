import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {mergeMap, of} from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import {transferServerDetailActions} from './transfer-server-detail.actions';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {TransferService} from "../../service/transfer.service";

@Injectable()
export class TransferServerDetailEffects {

    sortColumns: SortColumn[] = [];

    loadTransferServer$ = createEffect(() => this.actions$.pipe(
        ofType(transferServerDetailActions.loadTransferServerDetails),
        mergeMap(action =>
            this.transferService.loadTransferServerDetails(action.serverId)
                .pipe(map((transferServerDetailsResponse: any) => transferServerDetailActions.loadTransferServerDetailsSuccess({transferServerDetailsResponse})),
                    catchError((error) =>
                        of(transferServerDetailActions.loadTransferServerDetailsFailure({error: error.message}))
                    )
                )
        ),
    ));

    loadTransferServerUsers$ = createEffect(() => this.actions$.pipe(
        ofType(transferServerDetailActions.loadUsers),
        mergeMap(action =>
            this.transferService.listTransferServerUser(action.serverId, action.pageSize, action.pageIndex, action.sortColumns)
                .pipe(map((users: any) => transferServerDetailActions.loadUsersSuccess({users})),
                    catchError((error) =>
                        of(transferServerDetailActions.loadUsersFailure({error: error.message}))
                    )
                )
        ),
    ));

    loadTransferServerProtocols$ = createEffect(() => this.actions$.pipe(
        ofType(transferServerDetailActions.loadProtocols),
        mergeMap(action =>
            this.transferService.listTransferServerProtocols(action.serverId, action.pageSize, action.pageIndex, action.sortColumns)
                .pipe(map((protocols: any) => transferServerDetailActions.loadProtocolsSuccess({protocols})),
                    catchError((error) =>
                        of(transferServerDetailActions.loadProtocolsFailure({error: error.message}))
                    )
                )
        ),
    ));

    constructor(private actions$: Actions, private transferService: TransferService) {
    }
}