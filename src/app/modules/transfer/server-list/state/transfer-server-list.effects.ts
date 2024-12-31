import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {mergeMap, of} from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import {transferServerListActions} from './transfer-server-list.actions';
import {SortColumn} from "../../../../shared/sorting/sorting.component";
import {TransferService} from "../../service/transfer-service.component";

@Injectable()
export class TransferServerListEffects {

    sortColumns: SortColumn[] = [];

    loadTransferServer$ = createEffect(() => this.actions$.pipe(
        ofType(transferServerListActions.loadTransferServer),
        mergeMap(action =>
            this.transferService.listTransferServerCounters(
                action.prefix,
                action.pageSize,
                action.pageIndex,
                action.sortColumns)
                .pipe(map((listTransferServerCountersResponse: any) => transferServerListActions.loadTransferServerSuccess({listTransferServerCountersResponse})),
                    catchError((error) =>
                        of(transferServerListActions.loadTransferServerFailure({error: error.message}))
                    )
                )
        ),
    ));

    // @ts-ignore
    deleteQueue$ = createEffect(() => this.actions$.pipe(
        ofType(transferServerListActions.deleteTransferServer),
        mergeMap(action =>
            this.transferService.deleteServer(action.serverId)
                .then(() => transferServerListActions.deleteTransferServerSuccess()))
    ));

    constructor(private actions$: Actions, private transferService: TransferService) {
    }
}