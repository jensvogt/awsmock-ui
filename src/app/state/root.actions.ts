import {createAction, props} from '@ngrx/store';
import {DatenlieferantArray} from '../../../../libri/Libri.ONE/PIM/frontend/generated-sources/openapi/datenlieferanten';

export const rootActions = {
    loadAllDatenlieferanten: createAction('[Root] load all datenlieferanten'),
    allDatenlieferantenLoaded: createAction(
        '[Root] all datenlieferanten loaded',
        props<{
            response: DatenlieferantArray;
        }>()
    ),
    loadAllDatenlieferantenFailed: createAction('[Root] load all datenlieferanten failed')
};
