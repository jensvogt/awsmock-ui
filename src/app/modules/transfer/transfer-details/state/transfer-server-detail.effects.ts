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

    // @ts-ignore
    // deleteQueue$ = createEffect(() => this.actions$.pipe(
    //     ofType(transferServerDetailActions.deleteTransferServer),
    //     mergeMap(action =>
    //         this.transferService.deleteServer(action.serverId)
    //             .then(() => transferServerDetailActions.deleteTransferServerSuccess()))
    // ));

    constructor(private actions$: Actions, private transferService: TransferService) {
    }
}